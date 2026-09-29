---
name: add-dashboard-page
description: How to add a page to the admin dashboard or client portal in this repo — SSR Supabase client, proxy protection, sidebar links, and design tokens. Use when creating any src/app/dashboard/** or src/app/client/** page.
---

# Add a dashboard / client-portal page

1. Create `src/app/dashboard/<name>/page.tsx` (admin) or `src/app/client/<name>/page.tsx` (tenant portal). It's automatically protected by `src/proxy.ts`.
2. For data, use the SSR client: `import { createClient } from '@/utils/supabase/server'` — never `createServiceClient()` in a page (Stop-hook blocked). `searchParams` is a `Promise<...>`; await it.
3. Add a nav link: `src/components/layout/Sidebar.tsx` (admin) or `ClientSidebar.tsx` (client).
4. Use the design system: `.glass-card`, `.btn-gold` / `.btn-outline`, tokens from CONTEXT.md §6. No long inline Tailwind strings — add semantic classes to `src/app/globals.css`. No raw `<svg>` — import from `src/components/icons.tsx`.
5. Shared admin/client UI: several client components are shared across both portals (e.g. `AppointmentsClient`, `IntegrationsClient`) — reuse rather than duplicate.
6. Update the Architecture Map in `CONTEXT.md`, then run `./scripts/audit-health.sh`.
