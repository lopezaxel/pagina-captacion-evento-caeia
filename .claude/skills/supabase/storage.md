# Storage — Referencia Completa

## Buckets del proyecto

| Bucket | Visibilidad | Uso |
|--------|-------------|-----|
| `logos-empresas` | Privado (RLS) | Logo de cada empresa, embebido en `factura-pdf` |

**Regla:** Ningún bucket es públicamente accesible sin autenticación.
Los archivos privados siempre se sirven mediante **signed URLs** con expiración.

> El Módulo Compras (digitalización de comprobantes con Gemini, bucket
> `fiscal-archivos` en una versión anterior del proyecto) está **pausado y su
> código fue eliminado** — se rediseñará desde cero más adelante. No asumir
> que ese bucket existe todavía.

---

## Estructura de paths en `logos-empresas`

```
logos-empresas/
  {empresa_id}/
    logo.png
```

Un solo archivo por empresa (se sobreescribe con `upsert: true` al cambiar el
logo). El path usa `empresa_id`, no `tenant_id` — mismo criterio que el resto
de las tablas de negocio (`clientes_empresa`, `facturas_emitidas`, etc.), ver
`SKILL.md` sobre esa distinción de nombres de columna.

---

## Políticas RLS en Storage — patrón real (`20260826000001_datos_fiscales_completos.sql`)

Las policies en Storage se aplican sobre `storage.objects`.
Las funciones helper del proyecto (`current_user_tenant_id()`, `current_user_is_super_admin()`) también funcionan aquí.

### Select — el propio tenant o super_admin
```sql
create policy "logos_empresas_select" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'logos-empresas'
    and (
      public.current_user_is_super_admin()
      or (storage.foldername(name))[1] = public.current_user_tenant_id()::text
    )
  );
```

### Insert — solo el propio tenant
```sql
create policy "logos_empresas_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'logos-empresas'
    and (storage.foldername(name))[1] = public.current_user_tenant_id()::text
  );
```

### Update — solo el propio tenant
```sql
create policy "logos_empresas_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'logos-empresas'
    and (storage.foldername(name))[1] = public.current_user_tenant_id()::text
  );
```

### Delete — el propio tenant o super_admin
```sql
create policy "logos_empresas_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'logos-empresas'
    and (
      public.current_user_is_super_admin()
      or (storage.foldername(name))[1] = public.current_user_tenant_id()::text
    )
  );
```

---

## Upload de archivos — patrones del proyecto

### Upload con upsert (reemplaza el logo anterior)
```typescript
const path = `${empresaId}/logo.${extension}`

const { error } = await supabase.storage
  .from('logos-empresas')
  .upload(path, blob, {
    contentType: mimeType,   // 'image/png' | 'image/jpeg'
    upsert: true,            // reemplaza el logo existente de la empresa
  })

if (error) throw new Error(`Error al subir: ${error.message}`)
```

### Eliminar archivos
```typescript
const { error } = await supabase.storage
  .from('logos-empresas')
  .remove([path])

// Siempre eliminar los archivos cuando se borra el registro de BD
// El orden es: eliminar storage → eliminar registro BD (nunca al revés)
```

---

## Signed URLs — acceso temporal a archivos privados

### URL firmada para preview (300 segundos = 5 minutos)
```typescript
const { data, error } = await supabase.storage
  .from('logos-empresas')
  .createSignedUrl(storagePath, 300)

if (error || !data) return null
return data.signedUrl
```

### URL firmada para descarga directa
```typescript
const { data, error } = await supabase.storage
  .from('logos-empresas')
  .createSignedUrl(storagePath, 3600, {
    download: true,                    // fuerza descarga en el browser
    // download: 'logo-empresa.png',   // con nombre personalizado
  })
```

### Múltiples URLs en batch (más eficiente)
```typescript
const { data, error } = await supabase.storage
  .from('<bucket>')
  .createSignedUrls(paths, 300)

// data es array de { path, signedUrl, error }
```

---

## Transformaciones de imagen

```typescript
// Thumbnail para preview en lista
const { data } = await supabase.storage
  .from('logos-empresas')
  .createSignedUrl(storagePath, 300, {
    transform: {
      width: 200,
      height: 200,
      resize: 'contain',    // contain | cover | fill
      quality: 80,
      format: 'webp',
    },
  })
```

---

## Manejo de errores comunes en Storage

| Error | Causa | Fix |
|-------|-------|-----|
| `The resource already exists` | `upsert: false` y el path existe | Usar `upsert: true` o un path único |
| `new row violates row-level security` | La policy de INSERT no pasa | Verificar que el primer segmento del path (`empresa_id`) coincide con el del usuario |
| `Object not found` | Path incorrecto o RLS bloquea SELECT | Verificar path y policy de SELECT |
| `Payload too large` | Archivo supera el límite del bucket | `logos-empresas` limita a 2 MB (`image/png`/`image/jpeg`) — comprimir antes de subir |

---

## Configuración del bucket en migración — patrón real

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'logos-empresas',
  'logos-empresas',
  false,               -- private
  2097152,             -- 2 MB por archivo
  array['image/png', 'image/jpeg']
)
on conflict (id) do update
  set file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
```

A diferencia de lo que sugería una versión anterior de esta skill, los buckets
de este proyecto **sí se crean en migraciones versionadas** (no en `seed.sql`
ni solo desde el Dashboard) — ver `20260826000001_datos_fiscales_completos.sql`
como precedente completo (bucket + las 4 policies de arriba en el mismo archivo).

---

## Flujo completo: subir y usar el logo de una empresa

```typescript
// 1. SUBIR (en ConfiguracionPage, sección Datos de Facturación)
const path = `${empresaId}/logo.${extension}`
await supabase.storage.from('logos-empresas').upload(path, blob, { contentType: mimeType, upsert: true })

// 2. GUARDAR el path en la BD (no la URL firmada, que expira)
await supabase.from('empresas').update({ logo_path: path }).eq('id', empresaId)

// 3. RECUPERAR para mostrar (generar URL firmada on-demand, o embeber en el PDF)
const { data } = await supabase.storage.from('logos-empresas').createSignedUrl(path, 300)
const previewUrl = data?.signedUrl

// 4. ELIMINAR (si la empresa saca su logo)
await supabase.storage.from('logos-empresas').remove([path])
```

> Nunca guardar la signed URL en la BD. Guardar el `storage_path` (`empresas.logo_path`)
> y generar la URL firmada en cada visualización. Las signed URLs expiran.
