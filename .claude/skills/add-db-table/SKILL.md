---
name: add-db-table
description: How to add a Supabase/Postgres table in this repo — timestamped migration, mandatory RLS with tenant policies, the table registry, type generation, and the security audit. Use when creating any supabase/migrations table.
---

# Add a database table

Every table MUST have RLS enabled with strict tenant_id policies.

1. **Migration** — create `supabase/migrations/<UTC-timestamp>_create_<name>_table.sql`:
   ```sql
   create table <name> ( id uuid primary key default gen_random_uuid(),
     tenant_id uuid not null references tenants(id) on delete cascade,
     -- columns...
     created_at timestamptz not null default now() );

   alter table <name> enable row level security;

   create policy "<name>_tenant_isolation" on <name>
     for all to authenticated
     using   (tenant_id = (select tenant_id from user_tenants where user_id = auth.uid()))
     with check (tenant_id = (select tenant_id from user_tenants where user_id = auth.uid()));
   ```
   - Always `TO authenticated` (never `auth.role() = 'authenticated'`).
   - `FOR ALL` policies need BOTH `USING` and `WITH CHECK`.
   - RPCs: `SECURITY INVOKER` unless a definer is explicitly required. Never trust `user_metadata` for authorization.
   - Service-role-only tables (no per-user access, e.g. `rate_limits`, `leads`): enable RLS with no policies and access only via `createServiceClient()`.

2. **Register** — add the table to CONTEXT.md's *Database Table Registry* (RLS ✅, policy summary, migration file).

3. **Types** — run `npm run types:generate` so `src/types/database.types.ts` reflects the new table.

4. **Apply** — execute the SQL in the Supabase dashboard (no local Docker), or `npm run db:migrate`.

5. **Verify** — `./scripts/audit-security.sh` (checks RLS coverage against `.from('<name>')` calls) and `./scripts/audit-health.sh`.
