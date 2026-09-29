---
name: ship
description: Run the full verification gauntlet, then commit and open a PR.
disable-model-invocation: true
---

Take the current changes from "done" to shipped. Stop and fix at the first failure — don't push red.

1. **Type check:** `npx tsc --noEmit` (or `./scripts/build-check.sh` for a full build).
2. **Health:** `./scripts/audit-health.sh` — fix errors; resolve warnings (undocumented routes/tables, drift) rather than reporting them.
3. **Security:** `./scripts/audit-security.sh` — review every flag; fix real issues, justify any accepted ones.
4. **Smoke:** `npx tsx scripts/tests/smoke-tests.ts`.
5. **Docs:** confirm CONTEXT.md reflects any new routes/tables/env vars/patterns.
6. **Commit & PR:** if on `main`, branch first. Write a descriptive commit message; open a PR with `gh`. (Only commit/push when the user has asked you to ship.)

These mirror `.husky/pre-commit` and `.github/workflows/ci.yml`, so passing here means the commit hook and CI should pass too.
