#!/bin/bash
# ==========================================================================
# Knight Shift Agents — Development Health Scanner
# ==========================================================================
# Companion to audit-security.sh. This script catches architectural drift,
# documentation staleness, and pattern violations BEFORE they become
# expensive problems.
#
# Run this after making structural changes (new routes, tables, files).
# The security scanner catches vulnerabilities; this catches tech debt.
#
# Usage: ./scripts/audit-health.sh
# ==========================================================================

set -euo pipefail

ERRORS=0
WARNINGS=0

error() { echo "[ERROR] $1"; ERRORS=$((ERRORS+1)); }
warn()  { echo "[WARNING] $1"; WARNINGS=$((WARNINGS+1)); }
pass()  { echo "  ✓ $1"; }
section() { echo ""; echo "── $1 ──"; }

echo "=========================================="
echo "🏗️  Knight Shift Dev Health Scanner v1.0  🏗️"
echo "=========================================="
echo "Scan time: $(date -Iseconds)"

# ==========================================================================
# 1. CONTEXT.md — Route documentation freshness
# ==========================================================================
section "1. Checking CONTEXT.md documents all API routes"

API_DIRS=()
[ -d "app/api" ] && API_DIRS+=("app/api")
[ -d "src/app/api" ] && API_DIRS+=("src/app/api")

find "${API_DIRS[@]}" -type f \( -name "route.ts" -o -name "route.js" \) 2>/dev/null | sort | while IFS= read -r file; do
  # Extract the route path (e.g., "agents", "campaigns/generate")
  route_path=$(echo "$file" | sed -E 's#^(src/)?app/api/##; s#/route\.(ts|js)$##' | sed -E 's|/\([^)]+\)||g; s|^\([^)]+\)/||g')
  # Check if route is mentioned anywhere in CONTEXT.md
  if ! grep -Fq "$route_path" CONTEXT.md 2>/dev/null; then
    warn "API route '$route_path' exists in code but is NOT documented in CONTEXT.md"
    echo "       File: $file"
  else
    pass "Route '$route_path' is documented"
  fi
done

# ==========================================================================
# 2. CONTEXT.md — Database table registry freshness
# ==========================================================================
section "2. Checking CONTEXT.md documents all database tables"

SEARCH_DIRS="app"
[ -d "src" ] && SEARCH_DIRS="app src"

TABLES_IN_CODE=$(grep -rohE "\.from\(['\"]([a-z_]+)['\"]\)" $SEARCH_DIRS 2>/dev/null | sed "s/\.from(['\"]//;s/['\"])//" | sort -u || true)
for table in $TABLES_IN_CODE; do
  [ -z "$table" ] && continue
  if ! grep -q "\`$table\`" CONTEXT.md 2>/dev/null; then
    error "Table '$table' is used in code but NOT in CONTEXT.md Database Table Registry"
  else
    pass "Table '$table' is in the registry"
  fi
done

# ==========================================================================
# 3. SUPABASE CLIENT MISUSE — Wrong client in wrong context
# ==========================================================================
section "3. Checking for Supabase client misuse"

API_DIRS="app/api"
[ -d "src/app/api" ] && API_DIRS="app/api src/app/api"

# API routes should use createServiceClient, NOT the SSR createClient for data queries
find $API_DIRS -type f \( -name "route.ts" -o -name "route.js" \) 2>/dev/null | while IFS= read -r file; do
  route_path=$(echo "$file" | sed -E 's#^(src/)?app/api/##; s#/route\.(ts|js)$##' | sed -E 's|/\([^)]+\)||g; s|^\([^)]+\)/||g')

  # Check if an API route imports the SSR client for non-auth purposes
  if grep -q "from '@/utils/supabase/server'" "$file" 2>/dev/null; then
    # auth.ts wrapper is OK (it uses SSR client for session), but direct data queries aren't
    if grep -qE '\.from\(' "$file" 2>/dev/null; then
      warn "'$route_path' imports SSR client AND queries tables — should use createServiceClient + withApiAuth"
      echo "       File: $file"
    fi
  fi
done

# Browser components should NEVER import createServiceClient
CLIENT_SEARCH="app"
[ -d "components" ] && CLIENT_SEARCH="$CLIENT_SEARCH components"
[ -d "src" ] && CLIENT_SEARCH="$CLIENT_SEARCH src"
SVC_IN_CLIENT=$(find $CLIENT_SEARCH -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) 2>/dev/null | grep -v "/route\." | grep -v "node_modules" | xargs grep -rn "createServiceClient" 2>/dev/null || true)
if [ -n "$SVC_IN_CLIENT" ]; then
  error "createServiceClient() used in a client component or page (leaks service role to browser!):"
  echo "$SVC_IN_CLIENT"
else
  pass "No createServiceClient() in components or pages"
fi

# ==========================================================================
# 4. RAW SVG CHECK — Prevent SVG token bloat
# ==========================================================================
section "4. Checking for raw SVGs outside of icons.tsx"

RAW_SVGS=$(grep -rn "<svg" $SEARCH_DIRS 2>/dev/null | grep -v "components/icons.tsx" | grep -v "components/ui/" | grep -v "Chart.tsx" | grep -v "hire/page.tsx" | grep -v "pricing/page.tsx" | grep -v "VerifyWidgetButton.tsx" | grep -v "onboarding/page.tsx" | grep -v "signup/page.tsx" | grep -v "StatsCard.tsx" | grep -v "Navbar.tsx" | grep -v "Sidebar.tsx" || true)
if [ -n "$RAW_SVGS" ]; then
  error "Raw <svg> tags found. Extract these to src/components/icons.tsx to save tokens:"
  echo "$RAW_SVGS" | head -n 10
  if [ $(echo "$RAW_SVGS" | wc -l) -gt 10 ]; then
    echo "  ...and $(($(echo "$RAW_SVGS" | wc -l) - 10)) more"
  fi
else
  pass "No raw SVGs found outside icons.tsx"
fi

# ==========================================================================
# 5. ARCHITECTURE DRIFT — Pattern violations
# ==========================================================================
section "5. Checking for architecture pattern violations"

# Check for inline auth patterns (manual getUser + tenant lookup) in API routes
# These should have been refactored to use withApiAuth
INLINE_AUTH_COUNT=0
while IFS= read -r file; do
  route_path=$(echo "$file" | sed -E 's#^(src/)?app/api/##; s#/route\.(ts|js)$##' | sed -E 's|/\([^)]+\)||g; s|^\([^)]+\)/||g')
  if grep -q "auth.getUser" "$file" 2>/dev/null; then
    # Skip auth routes that legitimately need direct auth access
    if echo "$file" | grep -q "auth/"; then
      continue
    fi
    warn "'$route_path' uses inline auth.getUser() — should use withApiAuth wrapper"
    echo "       File: $file"
    INLINE_AUTH_COUNT=$((INLINE_AUTH_COUNT+1))
  fi
done < <(find $API_DIRS -type f \( -name "route.ts" -o -name "route.js" \) 2>/dev/null)
if [ $INLINE_AUTH_COUNT -eq 0 ]; then
  pass "No inline auth patterns found — all using withApiAuth or exempt auth"
fi

# Check for direct tenant_id from request body (should come from apiCtx)
TENANT_FROM_BODY=$(grep -rn "body\.tenant_id\|body\.tenantId\|req\.body\.tenant" $API_DIRS 2>/dev/null || true)
if [ -n "$TENANT_FROM_BODY" ]; then
  error "Found tenant_id read from request body (must come from apiCtx.tenantId):"
  echo "$TENANT_FROM_BODY"
else
  pass "No tenant_id from request body — all server-enforced"
fi

# ==========================================================================
# 6. ORPHANED FILES — Test/debug scripts in project root
# ==========================================================================
section "6. Checking for orphaned test/debug files in project root"

ORPHANS=$(find . -maxdepth 1 -name "test-*.js" -o -name "test-*.ts" -o -name "check-*.ts" -o -name "close-*.js" -o -name "execute-*.ts" -o -name "run-*.js" 2>/dev/null || true)
if [ -n "$ORPHANS" ]; then
  warn "Found orphaned test/debug scripts in project root (should be in scripts/ or deleted):"
  echo "$ORPHANS" | while read -r f; do echo "    $f"; done
else
  pass "No orphaned test scripts in project root"
fi

# ==========================================================================
# 7. PROXY.TS — Public routes match reality
# ==========================================================================
section "7. Cross-referencing proxy.ts public routes with actual API routes"

# Find routes listed as public in proxy.ts but not actually existing
if [ -f "src/proxy.ts" ] || [ -f "proxy.ts" ]; then
  PROXY_FILE="src/proxy.ts"
  [ -f "proxy.ts" ] && PROXY_FILE="proxy.ts"
  grep -oE '"/api/[^"]+' "$PROXY_FILE" 2>/dev/null | sed 's/"//g' | while read -r route; do
    # Convert proxy route to filesystem path
    fs_path="app${route}/route.js"
    [ -f "src/app${route}/route.ts" ] && fs_path="src/app${route}/route.ts"
    dir_path="app${route}"
    [ -d "src/app${route}" ] && dir_path="src/app${route}"
    if [ ! -f "$fs_path" ] && [ ! -d "$dir_path" ]; then
      warn "Proxy lists '$route' as public but no matching route exists"
    fi
  done
else
  pass "No proxy.ts (stateless / serverless routing)"
fi

# ==========================================================================
# 8. BUILD READINESS — Quick build/type check
# ==========================================================================
section "8. Quick build readiness check"

if [ -f "tsconfig.json" ]; then
  TSC_OUT=$(npx tsc --noEmit 2>&1 | head -20 || true)
  if echo "$TSC_OUT" | grep -q "error TS"; then
    error "TypeScript errors detected:"
    echo "$TSC_OUT" | head -10
  else
    pass "No TypeScript errors"
  fi
else
  if ./scripts/build-check.sh >/dev/null 2>&1; then
    pass "Production build check passed"
  else
    error "Production build check failed"
  fi
fi

# ==========================================================================
# SUMMARY
# ==========================================================================
echo ""
echo "=========================================="
echo "Health Scan Complete"
echo "  Errors:   $ERRORS (must fix)"
echo "  Warnings: $WARNINGS (AI should review)"
echo "=========================================="

if [ $ERRORS -gt 0 ]; then
  echo "❌ UNHEALTHY — $ERRORS error(s) require attention"
  exit 1
else
  echo "✅ HEALTHY — no critical issues found"
  exit 0
fi
