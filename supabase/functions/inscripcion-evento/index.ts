// Edge Function: recibe las inscripciones al evento del 18/11/2026 y las guarda en el schema
// cerrado `evento_caeia` del proyecto Sistema NIKI. NO toca `public` ni nada de CAEIA.
//
// Despliegue (solo cuando Axel lo pida): verify_jwt = false, porque la página es pública y no lleva
// ninguna clave en el navegador. Variables de entorno (Secrets de la función):
//   - SUPABASE_DB_URL      → la pone Supabase sola.
//   - ALLOWED_ORIGINS      → direcciones desde las que se acepta el formulario, separadas por coma
//                            (ej.: https://evento.caeia.app). Sin esto solo acepta localhost.
//   - IP_SALT              → texto secreto largo y al azar, para guardar un hash de la IP y no la IP.
//   - RATE_LIMIT_MAX       → (opcional) intentos por IP cada 10 minutos. Por defecto 30.
//   - EVENTO_RESEND_API_KEY → (opcional) API key de Resend creada SOLO para el evento. Con esta y EVENTO_NOTIFY_EMAIL la función le
//                            avisa a Axel por mail cada vez que se guarda una inscripción nueva (los duplicados no avisan).
//   - EVENTO_NOTIFY_EMAIL  → (opcional) mail donde llegan los avisos. Sin la key o sin esto, no se avisa nada.
//   - EVENTO_MAIL_FROM     → (opcional) remitente. Por defecto «Evento CAEIA <evento@caeia.app>» (dominio ya verificado en Resend).
//   Ojo: los secretos de Supabase son de TODO el proyecto (compartido con CAEIA, que ya usa RESEND_API_KEY para el onboarding),
//   por eso estos llevan el prefijo EVENTO_: así no se pisa nada de CAEIA.
//   El aviso lleva poco a propósito: nombre, origen y total. No lleva WhatsApp ni mail de la persona.
//
// Por qué conexión directa y no supabase-js: el schema `evento_caeia` no está expuesto a la API
// (cambiar eso afectaría a CAEIA), así que se escribe con SQL directo y consultas parametrizadas.

import postgres from 'npm:postgres@3.4.5'

// El campo «Soy…» (columna `tipo`) se sacó el 2026-11-14: la función ya no lo pide ni lo guarda (la columna quedó opcional en la
// tabla). Un navegador con la versión vieja de la página que todavía lo mande simplemente se ignora.
const FACTURAS = ['No facturo', 'Menos de 10', 'Entre 10 y 50', 'Más de 50']
const COMO = [
  'Desde el portal de ARCA',
  'Con una planilla de Excel',
  'Con otro sistema o app',
  'Me factura mi contador',
  'Otra forma',
]

const MAX_BODY = 8_000
const RATE_WINDOW_MIN = 10
const RATE_MAX = Number(Deno.env.get('RATE_LIMIT_MAX') ?? '30') || 30

const ALLOWED_ORIGINS = (
  Deno.env.get('ALLOWED_ORIGINS') ??
  'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173'
)
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean)

// Disponible en el runtime de las Edge Functions de Supabase: deja terminar una tarea después de responder.
declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void }

const RESEND_API_KEY = Deno.env.get('EVENTO_RESEND_API_KEY')
const NOTIFY_EMAIL = Deno.env.get('EVENTO_NOTIFY_EMAIL')
const MAIL_FROM = Deno.env.get('EVENTO_MAIL_FROM') ?? 'Evento CAEIA <evento@caeia.app>'

// Hitos que se destacan en el asunto del aviso: cada 10 desde 20 hasta 100, y después cada 50.
const esHito = (n: number) => n >= 20 && ((n <= 100 && n % 10 === 0) || (n > 100 && n % 50 === 0))

const sql = postgres(Deno.env.get('SUPABASE_DB_URL')!, {
  max: 1,
  prepare: false,
  idle_timeout: 20,
  connect_timeout: 10,
})

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

// Saca caracteres de control (Postgres no acepta el \u0000) y recorta.
function clean(value: unknown, max: number, keepNewlines = false): string {
  if (typeof value !== 'string') return ''
  const re = keepNewlines ? /[\u0000-\u0009\u000b-\u001f\u007f]/g : /[\u0000-\u001f\u007f]/g
  return value.replace(re, ' ').replace(/[ \t]+/g, ' ').trim().slice(0, max)
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Le avisa a Axel por mail que hay una inscripción nueva. Nunca rompe la inscripción: si algo falla, solo lo registra. */
async function avisarInscripcion(nombre: string, origen: string | null) {
  if (!RESEND_API_KEY || !NOTIFY_EMAIL) return
  try {
    const [{ n }] = await sql<{ n: number }[]>`select count(*)::int as n from evento_caeia.inscripciones`
    const asunto = esHito(n) ? `Ya son ${n} inscriptos al evento del 18/11` : `Nueva inscripción (#${n}): ${nombre}`
    // Texto plano (no HTML): el nombre lo escribe cualquier persona y así no puede meter nada raro en el mail.
    const text = [
      esHito(n) ? `Llegaste a ${n} inscriptos.` : 'Se anotó una persona nueva.',
      '',
      `Nombre: ${nombre}`,
      `Origen del link: ${origen ?? 'sin origen'}`,
      `Total de inscriptos: ${n}`,
    ].join('\n')
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: MAIL_FROM, to: [NOTIFY_EMAIL], subject: asunto, text }),
    })
    if (!res.ok) console.error('inscripcion-evento: Resend respondió', res.status)
  } catch (err) {
    console.error('inscripcion-evento: error al avisar', err instanceof Error ? err.name : 'desconocido')
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')?.replace(/\/$/, '') ?? null

  // Si llega con un Origin que no es el de la página, se rechaza (el navegador ya lo bloquea; esto lo hace explícito).
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return reply(403, { ok: false, error: 'origen' }, null)
  if (req.method === 'OPTIONS') return reply(204, null, origin)
  if (req.method !== 'POST') return reply(405, { ok: false, error: 'metodo' }, origin)

  // --- Leer y validar el cuerpo (nada de esto toca la base) ---
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

  // Campo trampa: las personas no lo ven; los bots lo completan. Se responde "ok" sin guardar nada.
  if (typeof b.website === 'string' && b.website.trim() !== '') return reply(200, { ok: true }, origin)

  const nombre = clean(b.nombre, 120)
  const whatsapp = clean(b.whatsapp, 20).replace(/\s/g, '')
  const email = clean(b.email, 254).toLowerCase()
  const rubro = clean(b.rubro, 120) || null
  const facturas = clean(b.facturas, 40)
  const como = clean(b.como, 60)
  const tarea = clean(b.tarea, 1000, true) || null
  const origenRaw = clean(b.origen, 32).toLowerCase()
  const origen = /^[a-z0-9_-]{1,32}$/.test(origenRaw) ? origenRaw : null
  const consentimientoTexto = clean(b.consentimiento_texto, 2000)

  const problemas: string[] = []
  if (nombre.length < 2) problemas.push('nombre')
  if (!/^\+54\d{10}$/.test(whatsapp)) problemas.push('whatsapp')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problemas.push('email')
  if (facturas && !FACTURAS.includes(facturas)) problemas.push('facturas')
  if (como && !COMO.includes(como)) problemas.push('como')
  if (b.consentimiento !== true) problemas.push('consentimiento')
  if (consentimientoTexto.length < 20) problemas.push('consentimiento_texto')
  if (problemas.length > 0) return reply(400, { ok: false, error: 'validacion', campos: problemas }, origin)

  try {
    // --- Límite de intentos por IP (se guarda un hash, no la IP) ---
    const ip =
      req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'desconocida'
    const ipHash = await sha256(`${Deno.env.get('IP_SALT') ?? ''}|${ip}`)

    await sql`delete from evento_caeia.intentos where created_at < now() - interval '1 day'`
    const [{ n }] = await sql<{ n: number }[]>`
      select count(*)::int as n from evento_caeia.intentos
      where ip_hash = ${ipHash} and created_at > now() - make_interval(mins => ${RATE_WINDOW_MIN})`
    if (n >= RATE_MAX) return reply(429, { ok: false, error: 'demasiados' }, origin)
    await sql`insert into evento_caeia.intentos (ip_hash) values (${ipHash})`

    // --- Guardar. Si el WhatsApp o el mail ya estaban, no se duplica y se responde igual que si fuera nuevo
    //     (así nadie puede averiguar quién está anotado). ---
    const filas = await sql<{ encuesta_token: string }[]>`
      insert into evento_caeia.inscripciones
        (nombre, whatsapp, email, rubro, facturas_por_mes, como_factura_hoy, tarea_repetitiva,
         origen, consentimiento, consentimiento_texto)
      values
        (${nombre}, ${whatsapp}, ${email}, ${rubro}, ${facturas || null}, ${como || null}, ${tarea},
         ${origen}, true, ${consentimientoTexto})
      on conflict do nothing
      returning encuesta_token`

    // Código para enlazar la encuesta opcional. Si la persona ya estaba anotada se devuelve uno al azar que no
    // corresponde a ninguna fila: así la respuesta es idéntica y nadie puede averiguar quién está anotado.
    const token = filas[0]?.encuesta_token ?? crypto.randomUUID()
    // Solo si la inscripción es nueva (un duplicado no se guarda y no avisa). Se responde igual de rápido: el aviso corre aparte.
    if (filas[0]) EdgeRuntime.waitUntil(avisarInscripcion(nombre, origen))
    return reply(200, { ok: true, token }, origin)
  } catch (err) {
    // Nunca se registran los datos de la persona, solo el tipo de error.
    console.error('inscripcion-evento: error al guardar', err instanceof Error ? err.name : 'desconocido')
    return reply(500, { ok: false, error: 'servidor' }, origin)
  }
})
