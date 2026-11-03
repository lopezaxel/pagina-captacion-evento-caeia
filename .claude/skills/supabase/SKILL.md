---
name: supabase
description: >
  Experto senior en Supabase. Actívame cuando trabajes con: RLS policies,
  migraciones SQL, Edge Functions (Deno), Storage buckets, Auth, tipos
  TypeScript generados desde el schema, debugging de queries lentas,
  multi-tenant patterns, SECURITY DEFINER functions, Supabase CLI,
  o cualquier integración con el cliente supabase-js.
argument-hint: "[área específica: rls | edge-functions | migrations | storage | types | debug]"
---

# Supabase — Skill Senior

Soy el experto en Supabase de este proyecto. Conozco el schema multi-tenant,
el patrón de RLS con SECURITY DEFINER, y cada área del stack.

Archivos de referencia:
- `${CLAUDE_SKILL_DIR}/rls-and-policies.md` — RLS, multi-tenant, performance, debugging
- `${CLAUDE_SKILL_DIR}/edge-functions.md` — Deno runtime, CORS, secrets, deployment
- `${CLAUDE_SKILL_DIR}/migrations-and-types.md` — Migraciones, generación de tipos TS
- `${CLAUDE_SKILL_DIR}/storage.md` — Buckets, acceso, signed URLs, políticas

---

## Contexto del proyecto

- **Project ID:** `zomukalrkafpmbxgdgwl` (us-west-2, Postgres 17)
- **Arquitectura:** Multi-tenant estricto — cada tabla tiene `tenant_id uuid`
- **Roles:** `super_admin` | `tenant_admin` | `tenant_user`
- **Funciones SECURITY DEFINER expuestas en `public`:**
  - `public.current_user_tenant_id()` → uuid
  - `public.current_user_is_super_admin()` → boolean
  - `public.current_user_role()` → text
- **Bucket Storage:** `logos-empresas` (logo por empresa, embebido en `factura-pdf`)
- **Edge Functions activas:** `wsfe-emit` (emisión ARCA/WSFE), `factura-pdf` (PDF con QR RG 4291), `arca-padron-consulta` (consulta de padrón ARCA), `whatsapp-webhook` (agente de WhatsApp), `gemini-proxy` (proxy central Gemini API), `arca-smoke-test`/`padron-smoke-test` (diagnóstico sin auth)

> Estas funciones NUNCA hacen subquery directa a `users` desde policies sobre
> `users` (causaría recursión infinita). Siempre usar las funciones del `public`.

---

## Reglas absolutas del proyecto

1. **RLS en TODAS las tablas** — sin excepciones, sin bypassrls en código cliente
2. **Un tenant jamás ve datos de otro** — `tenant_id` en cada policy relevante
3. **Variables de entorno para todas las keys** — nunca hardcodear
4. **Migraciones versionadas** — todo cambio de schema va en `supabase/migrations/`
5. **Tipos TS regenerados** tras cada migración que cambia el schema
6. **Service key solo en Edge Functions** — nunca en el cliente browser
7. **Storage RLS obligatorio** — ningún bucket es verdaderamente "público" sin policy

---

## Patrón RLS multi-tenant — el único correcto para este proyecto

> Ojo con el nombre de columna: `public.users` tiene `tenant_id` (FK a `empresas`),
> pero el resto de las tablas de negocio (`clientes_empresa`, `facturas_emitidas`,
> `certificados_arca`, etc.) usan **`empresa_id`** como su FK a `empresas` — no
> `tenant_id`. La función `current_user_tenant_id()` devuelve ese mismo uuid en
> ambos casos, solo cambia contra qué columna se compara en el `using`/`with check`.

```sql
-- CORRECTO: usa la función SECURITY DEFINER del schema public
create policy "empresa_isolation"
on public.mi_tabla
for all to authenticated
using (empresa_id = public.current_user_tenant_id())
with check (empresa_id = public.current_user_tenant_id());

-- INCORRECTO: subquery directa (recursión infinita si la tabla es users)
-- using (empresa_id = (select tenant_id from users where id = auth.uid()))
```

Para tablas donde `super_admin` necesita ver todo:
```sql
create policy "super_admin_or_tenant"
on public.mi_tabla
for select to authenticated
using (
  public.current_user_is_super_admin()
  or empresa_id = public.current_user_tenant_id()
);
```

Para tablas operativas internas que el frontend NUNCA debe leer directo (logs de
webhook, tickets WSAA cacheados, mensajes de WhatsApp): habilitar RLS pero **sin
ninguna policy para `authenticated`** — solo `service_role` (Edge Functions)
accede. Precedente real: `whatsapp_mensajes`, `whatsapp_sesiones`, `arca_tickets`.

---

## Trampas de seguridad de Supabase (varias nos pasaron de verdad)

Fuente: skills oficiales `supabase/agent-skills` (revisadas 2026-10-08), filtradas por lo que nos aplica.

1. **Grants: RLS filtra filas, no decide quién entra a la tabla.** `anon` y `authenticated` reciben permisos por defecto sobre todo lo que se crea en `public`. Tabla nueva → `revoke all ... from anon`, y a `authenticated` solo lo que usa la app (nunca `truncate`/`references`/`trigger`). *Nos pasó (Sesión 35):* `anon` tenía todo sobre 27 tablas y 5 tenían policies `USING (true)`. Una policy sin `TO authenticated` también se evalúa para `anon`.
2. **`SECURITY DEFINER` en `public` es un endpoint público.** Postgres da `EXECUTE` a `PUBLIC` por defecto, así que `/rest/v1/rpc/<función>` la expone. Toda función nueva: `revoke execute ... from public, anon` + `grant execute ... to authenticated, service_role` si corresponde, `set search_path` fijo, y si es una acción privilegiada (`admin_*`, `wsfe_*`) verificar rol/`auth.uid()` **adentro**. No agregar `SECURITY DEFINER` para "arreglar" un permiso denegado: saca el control de acceso sin resolver la causa. Excepción consciente: `current_user_*` quedan ejecutables por `authenticated` porque las policies las necesitan.
3. **Columnas sensibles en UPDATE.** Un `WITH CHECK` que solo compara `empresa_id`/`id` deja cambiar `role` o `tenant_id` de la propia fila. *Nos pasó (Sesión 33):* un usuario podía hacerse `super_admin`. Policy de UPDATE sobre `users` (o cualquier tabla con rol/tenant): exigir en `WITH CHECK` que esas columnas no cambien, y probarlo en una transacción con rollback.
4. **Nunca autorizar con `user_metadata`.** `raw_user_meta_data` lo edita el propio usuario y aparece en `auth.jwt()`. Roles y tenant viven en `public.users` (o `app_metadata`). Hoy no se usa en el código: mantenerlo así.
5. **Un UPDATE necesita también policy de SELECT.** Sin ella devuelve 0 filas, sin error: parece que "no guardó".
6. **Storage con `upsert: true` necesita INSERT + SELECT + UPDATE** en `storage.objects`. Con solo INSERT, reemplazar el logo falla en silencio.
7. **JWT viejo tras borrar un usuario.** Borrar un usuario no invalida sus access tokens vigentes; cerrar sesiones primero (`signOut` global) y no confiar en claims para operaciones sensibles.
8. **Nunca `service_role` ni secret key en el navegador;** en frontend solo la publishable. Tokens de Management API/CLI/MCP: preferir uno con alcance limitado.

## Flujo de trabajo al tocar la base

1. Mirar el estado actual antes de cambiar (`list_tables`, o consultar `pg_policies`/grants).
2. Iterar con `execute_sql`; cuando esté bien, guardarlo como migración versionada en `supabase/migrations/`. Evitar `apply_migration` para probar: deja una entrada de historial por cada intento.
3. **Correr los advisors** (`get_advisors` security + performance) al cerrar cualquier cambio de schema o policies, y arreglar lo nuevo.
4. **Verificar con una query** que el cambio hace lo que se espera (y que lo prohibido sigue prohibido, con un usuario de otra empresa). Sin verificación el arreglo no está terminado.
5. Si un enfoque falla 2-3 veces, parar y replantear (logs con `query_logs`, `search_docs`); no reintentar el mismo comando.
6. Para funciones o ajustes de Supabase que cambian seguido, consultar la doc vigente (`search_docs`) en vez de la memoria.

**Índices:** Postgres no indexa las claves foráneas solo. Toda FK nueva que se use en joins/filtros o con `ON DELETE` lleva su índice. Detectar las que faltan con el advisor `unindexed_foreign_keys`.

---

## Checklist antes de hacer cualquier cambio en Supabase

- [ ] ¿Hay una migración nueva en `supabase/migrations/`?
- [ ] ¿Se actualizaron los tipos TypeScript en `src/types/database.ts`?
- [ ] ¿La nueva tabla/columna tiene RLS habilitado?
- [ ] ¿Tiene policy con `tenant_id`?
- [ ] ¿`anon` quedó sin permisos sobre la tabla/función nueva (trampas 1 y 2)?
- [ ] ¿Las policies de UPDATE protegen `role`/`tenant_id` y tienen `WITH CHECK` (trampa 3)?
- [ ] ¿La FK nueva tiene índice?
- [ ] ¿Si hay Storage involucrado, tiene policy en `storage.objects`?
- [ ] ¿Las Edge Functions que tocás usan el service key del env, no el publishable?
- [ ] ¿Corriste los advisors y verificaste con una query?

---

## Comandos esenciales de referencia rápida

```bash
# Generar tipos TS desde el proyecto remoto
npx supabase gen types typescript --project-id zomukalrkafpmbxgdgwl --schema public > src/types/database.ts

# Nueva migración
npx supabase migration new nombre_descriptivo

# Aplicar migraciones al remoto
npx supabase db push

# Pull del estado remoto (para sincronizar)
npx supabase db pull

# Deploy de una Edge Function
npx supabase functions deploy nombre-funcion --project-ref zomukalrkafpmbxgdgwl

# Servir funciones localmente
npx supabase functions serve

# Ver logs de una función en producción
npx supabase functions logs nombre-funcion --project-ref zomukalrkafpmbxgdgwl
```

---

## Estructura de archivos Supabase en este proyecto

```
supabase/
  migrations/                  ← UN archivo SQL por cambio, nunca editar los existentes
    20260828000001_empresas_color_marca.sql
    20260904000001_facturas_emitidas_realtime.sql
  functions/
    wsfe-emit/
      index.ts                 ← wrapper HTTP delgado (CORS, verificación de tenant)
    factura-pdf/
      index.ts
    whatsapp-webhook/
      index.ts
    _shared/                   ← helpers y lógica de negocio compartida entre funciones
      wsfe-emit-core.ts        ← núcleo reusable (ej. por wsfe-emit y el agente de WhatsApp)
      whatsapp-signature.ts    ← verificación HMAC de webhooks firmados
      SupabaseTicketStorage.ts
src/
  lib/
    supabase.ts                ← cliente browser (publishable key)
    edge-function-error.ts     ← extraerErrorEdgeFunction() — supabase-js descarta
                                   el body real en respuestas no-2xx, hay que leer
                                   fnError.context para el mensaje real
  types/
    database.ts                ← GENERADO — nunca editar a mano, regenerar con el
                                   comando de arriba (puede haber columnas reales
                                   sin migración versionada en el repo, ej. `punto_venta`)
```

---

## Cuándo leer cada archivo de referencia

| Situación | Leer |
|-----------|------|
| Escribir o debuggear una policy RLS | `rls-and-policies.md` |
| Crear o modificar una Edge Function | `edge-functions.md` |
| Cambiar el schema, nueva tabla/columna | `migrations-and-types.md` |
| Trabajar con archivos, uploads, previews | `storage.md` |

Si el usuario especifica un área con $ARGUMENTS, ir directo al archivo correspondiente.
