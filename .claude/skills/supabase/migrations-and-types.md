# Migraciones y Tipos TypeScript — Referencia Completa

## Principio fundamental

**Nunca editar el schema directamente desde el Dashboard en producción.**
Todo cambio de schema va en un archivo SQL en `supabase/migrations/`.
Los archivos de migración son inmutables una vez commiteados — no se editan, se crean nuevos.

---

## Flujo de trabajo estándar para cambios de schema

```
1. Crear migración  →  2. Aplicar local  →  3. Generar tipos  →  4. Commit  →  5. Push a remoto
```

### 1. Crear el archivo de migración
```bash
# El nombre debe ser descriptivo y en snake_case
npx supabase migration new add_condicion_pago_to_comprobantes
# Genera: supabase/migrations/20240521123456_add_condicion_pago_to_comprobantes.sql
```

### 2. Escribir el SQL de la migración
```sql
-- supabase/migrations/20240521123456_add_condicion_pago_to_comprobantes.sql

-- Agregar columna
alter table public.fiscal_comprobantes
  add column condicion_pago text;

-- Agregar índice si la columna se filtra frecuentemente
create index idx_fiscal_comprobantes_condicion
  on public.fiscal_comprobantes(tenant_id, condicion_pago)
  where condicion_pago is not null;
```

### 3. Aplicar en el proyecto remoto
```bash
npx supabase db push --project-ref zomukalrkafpmbxgdgwl
```

### 4. Regenerar tipos TypeScript
```bash
npx supabase gen types typescript \
  --project-id zomukalrkafpmbxgdgwl \
  --schema public \
  > src/types/database.ts
```

### 5. Verificar y commitear
```bash
# Verificar que el build pasa con los nuevos tipos
npm run build

git add supabase/migrations/ src/types/database.ts
git commit -m "feat: agrega condicion_pago a fiscal_comprobantes"
```

---

## Plantillas de migración por tipo de operación

### Nueva tabla
```sql
create table public.nueva_tabla (
  id          uuid        primary key default gen_random_uuid(),
  tenant_id   uuid        not null references public.tenants(id) on delete cascade,
  created_by  uuid        references auth.users(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Índice de tenant (obligatorio)
create index idx_nueva_tabla_tenant_id on public.nueva_tabla(tenant_id);

-- Trigger para updated_at
create trigger set_updated_at
  before update on public.nueva_tabla
  for each row execute function moddatetime(updated_at);

-- RLS
alter table public.nueva_tabla enable row level security;

create policy "tenant_all" on public.nueva_tabla
  for all to authenticated
  using (tenant_id = public.current_user_tenant_id())
  with check (tenant_id = public.current_user_tenant_id());
```

### Agregar columna NOT NULL con valor por defecto
```sql
-- Primero agregar con default, luego si necesitas quitar el default:
alter table public.mi_tabla
  add column nueva_columna text not null default 'valor_inicial';

-- Si el default fue solo para la migración y no se quiere en el futuro:
alter table public.mi_tabla
  alter column nueva_columna drop default;
```

### Agregar CHECK constraint
```sql
alter table public.mi_tabla
  add constraint mi_tabla_estado_check
  check (estado in ('activo', 'inactivo', 'archivado'));
```

### Crear función SECURITY DEFINER
```sql
create or replace function public.mi_funcion(param text)
returns text
language sql
stable          -- usar si no modifica datos y es determinista
security definer
set search_path = public  -- siempre, por seguridad
as $$
  select algo from mi_tabla where columna = param;
$$;

-- Revocar acceso público por defecto
revoke execute on function public.mi_funcion from public;
grant execute on function public.mi_funcion to authenticated;
```

### Rename de columna (cuidado con el impacto)
```sql
alter table public.mi_tabla
  rename column nombre_viejo to nombre_nuevo;

-- IMPORTANTE: actualizar también src/types/database.ts regenerando tipos
```

---

## Tipos TypeScript generados — cómo usarlos

### Estructura del archivo generado
```typescript
// src/types/database.ts (GENERADO — no editar a mano)
export type Database = {
  public: {
    Tables: {
      fiscal_comprobantes: {
        Row: { /* todos los campos */ }
        Insert: { /* campos requeridos para insert */ }
        Update: { /* todos opcionales para update */ }
      }
    }
    Functions: {
      current_user_tenant_id: { /* ... */ }
    }
  }
}
```

### Cómo extraer tipos en el código de la app
```typescript
// En src/tools/fiscal-ia/lib/fiscal-types.ts (ejemplo del proyecto)
import type { Database } from '@/types/database'

// Tipo de una fila completa
type ComprobanteRow = Database['public']['Tables']['fiscal_comprobantes']['Row']

// Tipo para insert
type ComprobanteInsert = Database['public']['Tables']['fiscal_comprobantes']['Insert']

// Tipo para update (todos opcionales)
type ComprobanteUpdate = Database['public']['Tables']['fiscal_comprobantes']['Update']
```

### Narrowing con tipos específicos del dominio
```typescript
// Usar Omit + tipos más estrechos cuando la BD usa text pero el dominio tiene union
type ComprobanteFiscal = Omit<ComprobanteRow, 'tipo' | 'estado'> & {
  tipo: TipoComprobante      // 'factura_a' | 'factura_b' | ...
  estado: EstadoComprobante  // 'borrador' | 'confirmado' | 'anulado'
}
```

---

## Historial de migraciones

### Ver qué migraciones están aplicadas en el remoto
```bash
npx supabase migration list --project-ref zomukalrkafpmbxgdgwl
```

### Pull del estado actual del remoto (para sincronizar)
```bash
# Útil cuando hiciste cambios desde el Dashboard (no recomendado, pero pasa)
npx supabase db pull --project-ref zomukalrkafpmbxgdgwl
```

---

## Reglas que nunca se rompen

1. **Nunca editar un archivo de migración ya commiteado** — crear uno nuevo
2. **Nunca hacer `db push` sin haber regenerado y verificado los tipos**
3. **Toda migración en producción pasó primero por desarrollo local** (cuando sea posible)
4. **El archivo `src/types/database.ts` se regenera, no se edita a mano**
5. **Si una migración falla en producción, escribir una migración de rollback** — no modificar la original
