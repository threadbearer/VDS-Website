---
name: add-api-route
description: How to add a new API route in this repo — the withApiAuth wrapper, tenant isolation, the Supabase service client, public-route exemptions, and documentation. Use when creating any src/app/api/**/route.ts.
---

# Add an API route

**Scaffold (optional):** `./scripts/make-route.sh api/<feature>` generates a `withApiAuth`-wrapped `route.ts`. Verify the `createServiceClient` import resolves to the path CONTEXT.md documents (`@/lib/supabase`) before relying on it.

**Required pattern** for authenticated routes:
```ts
import { withApiAuth } from '@/lib/api-handler';
import { createServiceClient } from '@/lib/supabase';

export const GET = withApiAuth(async (request, apiCtx) => {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('table')
    .select('col_a, col_b')            // name columns; never select('*')
    .eq('tenant_id', apiCtx.tenantId); // tenant id comes from apiCtx, never the body
  // apiCtx: userId, tenantId, tenantName, role, isAdmin
});
```

**Rules**
- Always wrap authenticated handlers in `withApiAuth` (from `@/lib/api-handler`). A Stop hook blocks tenant ids read from the request body.
- Use `createServiceClient()` in API routes only — never in a component/page (leaks the service role; Stop-hook blocked).
- **Webhook / public / cron route?** It needs its own auth mechanism (Twilio HMAC via `@/lib/twilio`, Stripe `constructEvent`, or `verifyBearerSecret()` from `@/lib/secret-auth` for `CRON_SECRET`/`ORCHESTRATOR_SECRET`). Add it to `publicRoutes` in `src/proxy.ts` and document the exemption in CONTEXT.md §2. Never compare a header to a template-literal secret.

**Finish**
1. Document the route in `CONTEXT.md` (Architecture Map + §2 if exempt).
2. Run `./scripts/audit-security.sh` and `./scripts/audit-health.sh`.
