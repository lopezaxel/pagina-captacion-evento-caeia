# Edge Functions — Referencia Completa

## Runtime: Deno, no Node.js

Las Edge Functions corren en **Deno** (no Node). Diferencias críticas:
- Imports por URL o npm: `import { serve } from "https://deno.land/std/http/server.ts"` o `import x from "npm:paquete"`
- No hay `node_modules` — no existe `require()`
- TypeScript nativo, sin compilar
- APIs web estándar: `fetch`, `Request`, `Response`, `URL`, `crypto`, etc.
- Variables de entorno: `Deno.env.get('MI_VAR')`

---

## Estructura mínima de una Edge Function

```typescript
// supabase/functions/mi-funcion/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  // Preflight CORS — siempre primero
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()

    // Lógica de la función aquí

    return new Response(
      JSON.stringify({ resultado: 'ok' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado'
    return new Response(
      JSON.stringify({ error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
```

---

## Clientes Supabase dentro de una Edge Function

### Cliente con service key (admin, bypasea RLS)
```typescript
// Para operaciones administrativas que el RLS no debería bloquear
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } }
)
```

### Cliente con el JWT del usuario (respeta RLS)
```typescript
// Extrae el JWT del header Authorization del request entrante
const authHeader = req.headers.get('Authorization')

const supabaseUser = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!,
  {
    global: { headers: { Authorization: authHeader ?? '' } },
    auth: { persistSession: false },
  }
)

// Verificar que el usuario está autenticado
const { data: { user }, error: authError } = await supabaseUser.auth.getUser()
if (authError || !user) {
  return new Response(
    JSON.stringify({ error: 'No autorizado' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
  )
}
```

---

## Variables de entorno y secrets

### Secrets automáticos disponibles en toda función
| Variable | Contenido |
|----------|-----------|
| `SUPABASE_URL` | URL del proyecto |
| `SUPABASE_ANON_KEY` | Publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service key (admin) |
| `SUPABASE_DB_URL` | Conexión directa a Postgres |

### Agregar secrets propios (Gemini API, etc.)
```bash
# Setear en el proyecto remoto
npx supabase secrets set GEMINI_API_KEY=tu-key --project-ref zomukalrkafpmbxgdgwl

# Para desarrollo local, crear el archivo (NO commitear)
# supabase/functions/.env
GEMINI_API_KEY=tu-key-local

# Leer en la función
const apiKey = Deno.env.get('GEMINI_API_KEY')!
```

### Ver secrets configurados
```bash
npx supabase secrets list --project-ref zomukalrkafpmbxgdgwl
```

---

## Invocación desde el cliente React

```typescript
// Con supabase-js (maneja auth automáticamente)
const { data, error } = await supabase.functions.invoke<{ respuesta: string }>('mi-funcion', {
  body: { parametro: 'valor' },
})

if (error) throw new Error(error.message)
```

---

## Shared helpers entre funciones

```
supabase/functions/
  _shared/           ← el guion bajo lo excluye del deploy individual
    cors.ts
    gemini-client.ts
    supabase-admin.ts
```

```typescript
// _shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Importar desde otra función:
import { corsHeaders } from '../_shared/cors.ts'
```

---

## Desarrollo local

```bash
# Iniciar Supabase local (necesita Docker)
npx supabase start

# Servir todas las funciones en modo watch
npx supabase functions serve

# Servir una función específica con sus secrets
npx supabase functions serve mi-funcion --env-file supabase/functions/.env

# Testear manualmente
curl -i --location --request POST 'http://localhost:54321/functions/v1/mi-funcion' \
  --header 'Authorization: Bearer TU_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"parametro":"valor"}'
```

---

## Deploy a producción

```bash
# Deploy de una función específica
npx supabase functions deploy mi-funcion --project-ref zomukalrkafpmbxgdgwl

# Deploy de todas las funciones
npx supabase functions deploy --project-ref zomukalrkafpmbxgdgwl

# Ver logs en tiempo real
npx supabase functions logs mi-funcion --project-ref zomukalrkafpmbxgdgwl --tail
```

---

## Límites y consideraciones de Supabase Edge Functions

| Límite | Valor |
|--------|-------|
| Tiempo máximo de ejecución | 150 segundos |
| Tamaño máximo del body | 6 MB |
| Memoria | 150 MB |
| Cold start típico | ~250ms |

- Las funciones son stateless — no guardar estado en variables globales
- Para procesamiento largo, usar `EdgeRuntime.waitUntil()` o encolar en Postgres
- Gemini multimodal: pasar imágenes como base64 dentro del body JSON (máx 6 MB)

---

## Manejo de errores — patrón completo

```typescript
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validar content-type
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Content-Type debe ser application/json' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const body = await req.json()

    // Validar campos requeridos
    if (!body.campo_requerido) {
      return new Response(
        JSON.stringify({ error: 'campo_requerido es obligatorio' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 422 }
      )
    }

    // Lógica principal
    const resultado = await hacerAlgo(body)

    return new Response(
      JSON.stringify(resultado),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Error en mi-funcion:', error)  // aparece en supabase functions logs
    const message = error instanceof Error ? error.message : 'Error interno'
    return new Response(
      JSON.stringify({ error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
```
