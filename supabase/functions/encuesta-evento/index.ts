// Edge Function: recibe las respuestas de la encuesta opcional que se muestra después de inscribirse al evento del 18/11/2026
// y las guarda en el schema cerrado `evento_caeia`. NO toca `public` ni nada de CAEIA.
//
// Despliegue: verify_jwt = false (la página es pública y no lleva claves). Usa los mismos secretos que `inscripcion-evento`:
// ALLOWED_ORIGINS, IP_SALT, RATE_LIMIT_MAX y SUPABASE_DB_URL (ver ese archivo).
//
// Las respuestas se enlazan a la inscripción con el código (token) que devolvió `inscripcion-evento`. La página no puede leer
// nada. Si el código no corresponde a ninguna inscripción se responde "ok" y no se guarda nada (así no se puede averiguar
// qué códigos existen).
//
// IMPORTANTE: las opciones válidas de cada pregunta tienen que coincidir con content.survey en src/content.ts.

import postgres from 'npm:postgres@3.4.5'

const MOLESTIA = [
  'Me lleva mucho tiempo',
  'Es complicado y me confundo',
  'Dependo de mi contador',
  'Los errores y las correcciones',
  'Cuando ARCA no funciona',
  'Nada, no me molesta',
]
const GASTO = ['Nada', 'Menos de $10.000', 'Entre $10.000 y $30.000', 'Más de $30.000', 'No sé']
const PRECIO = [
  'Menos de $10.000',
  'Entre $10.000 y $20.000',
  'Entre $20.000 y $30.000',
  'Entre $30.000 y $50.000',
  'Más de $50.000',
  'No pagaría',
]
const TARJETA = ['Sí', 'Tal vez', 'No']

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
const MAX_BODY = 4_000
const RATE_WINDOW_MIN = 10
const RATE_MAX = Number(Deno.env.get('RATE_LIMIT_MAX') ?? '30') || 30

const ALLOWED_ORIGINS = (
  Deno.env.get('ALLOWED_ORIGINS') ??
  'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173'
)
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean)

const sql = postgres(Deno.env.get('SUPABASE_DB_URL')!, { max: 1, prepare: false, idle_timeout: 20, connect_timeout: 10 })

function corsHeaders(origin: string | null): Record<string, string> {
  const h: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  }
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    h['Access-Control-Allow-Origin'] = origin
    h['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    h['Access-Control-Allow-Headers'] = 'Content-Type'
    h['Access-Control-Max-Age'] = '600'
  }
  return h
}

function reply(status: number, body: unknown, origin: string | null) {
  return new Response(status === 204 ? null : JSON.stringify(body), { status, headers: corsHeaders(origin) })
}

function clean(value: unknown, max: number, keepNewlines = false): string {
  if (typeof value !== 'string') return ''
  const re = keepNewlines ? /[\u0000-\u0009\u000b-\u001f\u007f]/g : /[\u0000-\u001f\u007f]/g
  return value.replace(re, ' ').replace(/[ \t]+/g, ' ').trim().slice(0, max)
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')?.replace(/\/$/, '') ?? null
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return reply(403, { ok: false, error: 'origen' }, null)
  if (req.method === 'OPTIONS') return reply(204, null, origin)
  if (req.method !== 'POST') return reply(405, { ok: false, error: 'metodo' }, origin)

  const raw = await req.text()
  if (raw.length > MAX_BODY) return reply(413, { ok: false, error: 'tamano' }, origin)
  let b: Record<string, unknown>
  try {
    const parsed = JSON.parse(raw)
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('forma')
    b = parsed as Record<string, unknown>
  } catch {
    return reply(400, { ok: false, error: 'json' }, origin)
  }

  // Campo trampa anti-bots: si viene completo se responde "ok" sin guardar.
  if (typeof b.website === 'string' && b.website.trim() !== '') return reply(200, { ok: true }, origin)

  const token = clean(b.token, 36).toLowerCase()
  const pick = (v: unknown, list: string[]) => {
    const t = clean(v, 120)
    return t === '' ? null : list.includes(t) ? t : undefined // undefined = valor no permitido
  }
  const molestia = pick(b.molestia, MOLESTIA)
  const gasto = pick(b.gasto_mensual, GASTO)
  const precio = pick(b.precio_justo, PRECIO)
  const tarjeta = pick(b.probaria_con_tarjeta, TARJETA)
  const imprescindible = clean(b.imprescindible, 500, true) || null

  const problemas: string[] = []
  if (!UUID.test(token)) problemas.push('token')
  if (molestia === undefined) problemas.push('molestia')
  if (gasto === undefined) problemas.push('gasto_mensual')
  if (precio === undefined) problemas.push('precio_justo')
  if (tarjeta === undefined) problemas.push('probaria_con_tarjeta')
  if (!molestia && !gasto && !precio && !tarjeta && !imprescindible) problemas.push('vacia')
  if (problemas.length > 0) return reply(400, { ok: false, error: 'validacion', campos: problemas }, origin)

  try {
    const ip =
      req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'desconocida'
    const ipHash = await sha256(`${Deno.env.get('IP_SALT') ?? ''}|${ip}`)
    await sql`delete from evento_caeia.intentos where created_at < now() - interval '1 day'`
    const [{ n }] = await sql<{ n: number }[]>`
      select count(*)::int as n from evento_caeia.intentos
      where ip_hash = ${ipHash} and created_at > now() - make_interval(mins => ${RATE_WINDOW_MIN})`
    if (n >= RATE_MAX) return reply(429, { ok: false, error: 'demasiados' }, origin)
    await sql`insert into evento_caeia.intentos (ip_hash) values (${ipHash})`

    // Si el código no existe no se guarda nada y se responde igual que si existiera.
    await sql`
      insert into evento_caeia.respuestas_encuesta
        (inscripcion_id, molestia, gasto_mensual, precio_justo, probaria_con_tarjeta, imprescindible)
      select i.id, ${molestia}, ${gasto}, ${precio}, ${tarjeta}, ${imprescindible}
      from evento_caeia.inscripciones i
      where i.encuesta_token = ${token}::uuid
      on conflict (inscripcion_id) do nothing`

    return reply(200, { ok: true }, origin)
  } catch (err) {
    console.error('encuesta-evento: error al guardar', err instanceof Error ? err.name : 'desconocido')
    return reply(500, { ok: false, error: 'servidor' }, origin)
  }
})
