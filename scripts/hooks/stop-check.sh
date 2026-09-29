#!/bin/bash
# ==========================================================================
# Stop hook — fast, quiet-on-success verification gate.
# Blocks the turn from ending ONLY if the files changed in this working tree
# introduce a genuine leak that must never ship:
#   1. createServiceClient() in a component/page (leaks service role to browser)
#   2. tenant_id sourced from the request body (must come from apiCtx.tenantId)
# Scoped to CHANGED files (vs HEAD) so pre-existing debt never traps you.
# The slow, exhaustive checks (tsc, full route/table audit) stay in
# scripts/audit-health.sh via pre-commit + CI. Fail-open outside a git repo.
#
# Exit 0 = let the turn end (silent). Exit 2 = block + feed reason back to Claude.
# ==========================================================================
set -uo pipefail

changed=$( { git diff HEAD --name-only 2>/dev/null; git diff --name-only 2>/dev/null; } || true )
changed=$(printf '%s\n' "$changed" | sort -u | grep -E '\.(ts|tsx)$' || true)
[ -z "$changed" ] && exit 0

problems=""
while IFS= read -r f; do
  [ -n "$f" ] || continue
  [ -f "$f" ] || continue

  # 1. service-role client leaking into a component or page (API routes are OK)
  case "$f" in
    */route.ts) : ;;
    *src/components/*|*src/app/*)
      if grep -q "createServiceClient" "$f" 2>/dev/null; then
        problems="${problems}
  - ${f}: imports createServiceClient() outside an API route. This leaks the service-role key to the browser. Use the SSR/browser client here, or move the logic into an API route wrapped in withApiAuth."
      fi
      ;;
  esac

  # 2. tenant_id read from the request body
  case "$f" in
    *src/app/api/*)
      if grep -qE 'body\.(tenant_id|tenantId)' "$f" 2>/dev/null; then
        problems="${problems}
  - ${f}: reads tenant_id from the request body. It MUST come from apiCtx.tenantId (server-enforced), never client input."
      fi
      ;;
  esac
done <<< "$changed"

if [ -n "$problems" ]; then
  printf 'Crucible Stop-guard blocked the turn — fix these in your changed files first:%s\n' "$problems" >&2
  exit 2
fi

exit 0
