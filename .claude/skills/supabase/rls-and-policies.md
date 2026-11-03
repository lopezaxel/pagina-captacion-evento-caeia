# RLS y Políticas — Referencia Completa

## Anatomía de una policy

```sql
create policy "nombre_descriptivo"
on public.tabla
as permissive          -- permissive (default) | restrictive
for select             -- select | insert | update | delete | all
to authenticated       -- anon | authenticated | nombre_rol
using (/* condición para SELECT y DELETE */)
with check (/* condición para INSERT y UPDATE */);
```

**Regla**: UPDATE siempre necesita `using` Y `with check`.
**Regla**: INSERT solo necesita `with check`.
**Regla**: SELECT y DELETE solo necesitan `using`.

---

## Patrón multi-tenant de este proyecto

### Tabla básica (solo el tenant ve sus datos)
```sql
alter table public.mi_tabla enable row level security;

create policy "tenant_select"
on public.mi_tabla for select to authenticated
using (tenant_id = public.current_user_tenant_id());

create policy "tenant_insert"
on public.mi_tabla for insert to authenticated
with check (tenant_id = public.current_user_tenant_id());

create policy "tenant_update"
on public.mi_tabla for update to authenticated
using (tenant_id = public.current_user_tenant_id())
with check (tenant_id = public.current_user_tenant_id());

create policy "tenant_delete"
on public.mi_tabla for delete to authenticated
using (tenant_id = public.current_user_tenant_id());
```

### Con acceso del super_admin
```sql
create policy "select_tenant_or_admin"
on public.mi_tabla for select to authenticated
using (
  public.current_user_is_super_admin()
  or tenant_id = public.current_user_tenant_id()
);
```

### Solo tenant_admin puede borrar
```sql
create policy "delete_only_admin"
on public.mi_tabla for delete to authenticated
using (
  tenant_id = public.current_user_tenant_id()
  and public.current_user_role() in ('tenant_admin', 'super_admin')
);
```

---

## Funciones SECURITY DEFINER — cómo están definidas

```sql
-- Devuelve el tenant_id del usuario actual (sin recursión)
create or replace function public.current_user_tenant_id()
returns uuid language sql stable security definer
set search_path = public
as $$
  select tenant_id from public.users where id = auth.uid()
$$;

-- Verifica si el usuario actual es super_admin
create or replace function public.current_user_is_super_admin()
returns boolean language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'super_admin'
  )
$$;

-- Devuelve el rol del usuario actual
create or replace function public.current_user_role()
returns text language sql stable security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid()
$$;
```

> CRÍTICO: `set search_path = public` evita ataques de search_path hijacking.
> CRÍTICO: `stable` permite a Postgres cachear el resultado en la misma query.

---

## Performance — las 5 reglas

### 1. Siempre envolver funciones en SELECT
```sql
-- LENTO: se evalúa por fila
using (auth.uid() = user_id)

-- RÁPIDO: Postgres cachea el resultado (hasta 99.99% más rápido)
using ((select auth.uid()) = user_id)

-- En este proyecto ya está resuelto: public.current_user_tenant_id()
-- es STABLE, por lo que Postgres la cachea automáticamente
```

### 2. Índices en columnas de policy
```sql
-- Siempre indexar tenant_id en tablas con muchos registros
create index idx_mi_tabla_tenant_id on public.mi_tabla(tenant_id);

-- Si filtrás por tenant_id + otra columna frecuentemente
create index idx_mi_tabla_tenant_fecha on public.mi_tabla(tenant_id, fecha_emision);
```

### 3. Especificar siempre el rol en la policy
```sql
-- SIN TO: Postgres evalúa la policy para TODOS los roles (incluye anon)
using (tenant_id = public.current_user_tenant_id())

-- CON TO: solo evalúa para authenticated (más eficiente)
to authenticated using (tenant_id = public.current_user_tenant_id())
```

### 4. Agregar filtros en el cliente también
```typescript
// El RLS ya filtra, pero agregar el filtro en la query evita
// que Postgres escanee filas de otros tenants antes del filtro RLS
const { data } = await supabase
  .from('mi_tabla')
  .select('*')
  .eq('tenant_id', tenantId)  // ← siempre agregar esto también
```

### 5. Evitar JOINs complejos dentro de policies
```sql
-- LENTO: join dentro de la policy
using (
  exists (
    select 1 from memberships m
    where m.user_id = auth.uid() and m.tenant_id = tenant_id
  )
)

-- RÁPIDO: usar función SECURITY DEFINER que encapsule la lógica
using (tenant_id = public.current_user_tenant_id())
```

---

## Debugging de policies

### Ver todas las policies de una tabla
```sql
select policyname, cmd, roles, qual, with_check
from pg_policies
where tablename = 'mi_tabla' and schemaname = 'public';
```

### Simular una query como un usuario específico
```sql
-- En el SQL Editor de Supabase Dashboard
set local role authenticated;
set local "request.jwt.claims" = '{"sub": "uuid-del-usuario", "role": "authenticated"}';

select * from public.mi_tabla;  -- verás solo lo que ve ese usuario
```

### Diagnóstico de recursión infinita
Síntoma: `ERROR: infinite recursion detected in policy for relation "users"`
Causa: policy sobre `users` que hace subquery a `users`
Fix: usar `public.current_user_tenant_id()` (SECURITY DEFINER, no recursa)

### Diagnóstico de "no rows returned" inesperado
1. Verificar que RLS está habilitado: `select relrowsecurity from pg_class where relname = 'mi_tabla'`
2. Verificar que existen policies: query a `pg_policies`
3. Probar con service key para confirmar que los datos existen
4. Revisar que el `tenant_id` del usuario coincide con el de los registros

---

## Views y RLS

Las views bypasean RLS por defecto en Postgres. Para que una view respete RLS:

```sql
create view public.mi_view
with (security_invoker = true)  -- ← Postgres 15+, obligatorio
as select * from public.mi_tabla;
```

Sin `security_invoker = true`, la view corre con privilegios del owner y saltea el RLS.

---

## Tablas del sistema Supabase que NO llevan RLS del proyecto

- `auth.users` — manejada por Supabase Auth, no tocar
- `storage.objects` — tiene su propio sistema de policies (ver storage.md)
- `storage.buckets` — configurada vía CLI/Dashboard

## Plantilla completa para nueva tabla multi-tenant

```sql
-- 1. Crear tabla
create table public.nueva_tabla (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now(),
  -- ... tus columnas
);

-- 2. Habilitar RLS
alter table public.nueva_tabla enable row level security;

-- 3. Índice de tenant
create index idx_nueva_tabla_tenant_id on public.nueva_tabla(tenant_id);

-- 4. Policies
create policy "tenant_select" on public.nueva_tabla
  for select to authenticated
  using (tenant_id = public.current_user_tenant_id());

create policy "tenant_insert" on public.nueva_tabla
  for insert to authenticated
  with check (tenant_id = public.current_user_tenant_id());

create policy "tenant_update" on public.nueva_tabla
  for update to authenticated
  using (tenant_id = public.current_user_tenant_id())
  with check (tenant_id = public.current_user_tenant_id());

create policy "tenant_delete" on public.nueva_tabla
  for delete to authenticated
  using (tenant_id = public.current_user_tenant_id());
```
