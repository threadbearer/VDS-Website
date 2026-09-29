# This is NOT the Next.js you know

This project runs a Next.js version with breaking changes from your training data — APIs, conventions, and file structure may differ. Before using an unfamiliar Next.js API, check the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices. Non-obvious specifics you can't infer:
- **Proxy, not Middleware**: the file is `src/proxy.ts` exporting `proxy()`. Never create `middleware.ts`.
- `searchParams` in page components is a `Promise<...>` — await it.

---

# Working in this repo

## Orient from CONTEXT.md, then explore deliberately
`CONTEXT.md` is the architecture index — every file's purpose, the Supabase client matrix, design tokens, the DB table registry, pricing, and the work queue. Start there instead of rediscovering structure. When a task genuinely needs broad exploration, delegate it to a **subagent** (Explore / general-purpose) so the reading happens in a separate context window and doesn't crowd yours. Don't under-read to save tokens, and don't stop to ask permission just to read files.

## Supabase client matrix (never mix)
```
API routes / webhooks    → createServiceClient()  from @/lib/supabase
Dashboard pages (SSR)    → createClient()          from @/utils/supabase/server
Browser components       → createClient()          from @/utils/supabase/client
```
Never create new client factories. `createServiceClient()` in a component/page leaks the service-role key to the browser — a Stop hook blocks this in changed files.

## Auth & tenancy
Authenticated API routes MUST use `withApiAuth` from `@/lib/api-handler`, and MUST query by `apiCtx.tenantId` — never a tenant id read from the request body (Stop-hook enforced). Document any intentionally-exempt route in CONTEXT.md §2.

## TypeScript (strict mode)
- `createServiceClient()` is typed via the `Database` generic from `src/types/database.types.ts`. After any schema change, run `npm run types:generate`.
- Don't add `@ts-expect-error` without first confirming the error actually exists.
- Fix every instance of a type-error pattern in one pass. Use `npx tsc --noEmit 2>&1 | head -5` to see the next error without a full build, and prefer `./scripts/build-check.sh` over raw `npm run build` (it filters the Webpack/Turbopack log noise out of your context).

## Keep the index current
After architectural changes (new files, routes, tables, env vars, patterns), update `CONTEXT.md` so future sessions don't re-discover them. New DB table → migration with RLS enabled and both `USING` + `WITH CHECK`, add it to the table registry, then run `./scripts/audit-security.sh`.

## Token & junk hygiene
- **No raw `<svg>`** in components/pages — import from `src/components/icons.tsx` (add missing icons there).
- **No `console.log`** in finished code — use `console.error` / `console.warn` only, for genuine persistent alerts (a PostToolUse hook flags leftover `console.log`).
- Extract long inline Tailwind strings into semantic classes in `src/app/globals.css`.

## Background work: don't poll
Launch long or background commands, then yield your turn — the harness wakes you when they finish. Don't spin in status-check loops; it wastes context.

---

# Verification & review — the loop

Guardrails here are enforced deterministically, not by memory. Fix what they surface before you finish — don't just report it.

- **Hooks** (`.claude/settings.json`, model-agnostic shell scripts): PostToolUse flags leftover `console.log`; a Stop hook blocks genuine leaks (service-role client in a component, tenant id from the body) in your changed files.
- **Scripts** (also run by `.husky/pre-commit` and CI, so they gate every commit): `./scripts/audit-health.sh` (architecture / doc-drift), `./scripts/audit-security.sh` (RLS / secrets / route auth), `npx tsc --noEmit`, `npx tsx scripts/tests/smoke-tests.ts`.
- **Review passes**: `/code-review` for correctness on the diff; the `security-auditor` and `architecture-reviewer` subagents for deeper, focused passes.
- **The Crucible** (`npx tsx scripts/crucible-fortify.ts`, or `/fortify`): a cross-model (Gemini) second opinion on token efficiency and cross-file smells, governed by this same file. It writes `enrichment_suggestions.md` + `enrichment_suggestions.json` and **proposes** new rules for a human to curate — it never edits AGENTS.md. Run it after significant features or architectural changes and apply the worthwhile suggestions.
