# CREATIQ

## Descripción
Meta Ads creative analytics SaaS. AI-powered platform that syncs ad accounts, analyzes every creative asset, and surfaces why ads are working or failing — built for performance marketing agencies and DTC brands.

## Arquitectura
- Next.js 16 con App Router
- Tailwind CSS v4 para estilos
- shadcn/ui para componentes de UI
- Supabase para base de datos + autenticación
- Vercel para despliegue

## shadcn/ui
Componentes instalados en `/components/ui/`:
- Button, Card, Input, Label
- Table, Badge, Avatar, Dialog

## Autenticación
- Supabase Auth (email + password)
- Middleware en `proxy.ts` protege `/dashboard/*` y `/admin/*`
- Helpers en `lib/supabase/` (server.ts, client.ts, middleware.ts)
- Google OAuth preparado (falta configurar credenciales)

## Base de datos (Supabase)
Tablas:
- `waitlist` — emails de la landing (RLS: solo INSERT público)
- `profiles` — usuarios registrados (clerk_id = Supabase Auth uid)
- `projects` — proyectos por usuario (FK a profiles)

Todas con RLS habilitado. Acceso admin via service_role key.

## Estructura de carpetas
```
app/
  (auth)/          — login, register, actions
  (default)/       — landing page, admin waitlist
  (dashboard)/     — dashboard con sidebar (projects, overview, etc.)
  api/waitlist/    — API con rate limiting
  auth/callback/   — OAuth callback
components/
  ui/              — shadcn/ui (button, card, input, table, badge, avatar, dialog, label)
  admin/           — AdminWaitlist (stats, tabla, export CSV)
  auth/            — LogoutButton, GoogleButton
lib/
  supabase/        — server.ts, client.ts, middleware.ts (auth helpers)
  db/              — supabase.ts, queries.ts, types.ts (data layer)
```

## Rutas principales
- `/` — landing page con waitlist form
- `/login` y `/register` — auth con Supabase
- `/dashboard` — app principal (protegida)
- `/dashboard/projects` — CRUD de proyectos
- `/admin` — panel de waitlist con stats y tabla (protegida)

## Convenciones
- Componentes React funcionales con TypeScript
- Variables de entorno en .env.local (no subir a git)
- Server actions para mutaciones (no API routes)
- Service role key solo en server-side
