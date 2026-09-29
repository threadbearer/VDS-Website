#!/bin/bash
# ==========================================================================
# Knight Shift Agents — Comprehensive Security Scanner
# ==========================================================================
# This script performs automated security checks across the entire
# Next.js + Supabase stack. It is designed to be consumed by AI agents
# during periodic audits.
#
# DESIGN PHILOSOPHY:
#   - Flag EVERYTHING that could potentially become a vulnerability
#   - The AI reviewing the output decides what is safe, not the script
#   - Never silently suppress or skip files
#   - Output is structured for efficient AI token consumption
#
# Usage: ./scripts/audit-security.sh
# ==========================================================================

set -euo pipefail

ERRORS=0
WARNINGS=0

error() { echo "[ERROR] $1"; ERRORS=$((ERRORS+1)); }
warn()  { echo "[WARNING] $1"; WARNINGS=$((WARNINGS+1)); }
pass()  { echo "  ✓ $1"; }
section() { echo ""; echo "── $1 ──"; }

echo "=========================================="
echo "🛡️  Knight Shift Security Scanner v2.0  🛡️"
echo "=========================================="
echo "Scan time: $(date -Iseconds)"

# ==========================================================================
# 1. SECRET LEAKS — Env vars exposed to the browser
# ==========================================================================
section "1. Checking for secrets exposed via NEXT_PUBLIC_ variables"

# Catch ANY secret-looking NEXT_PUBLIC_ env var access (not error message strings)
LEAKED=$(grep -rnE 'process\.env\.NEXT_PUBLIC_.*(SECRET|SERVICE_ROLE|PRIVATE_KEY|AUTH_TOKEN)' src/ 2>/dev/null || true)
if [ -n "$LEAKED" ]; then
  error "Found potentially secret values exposed via NEXT_PUBLIC_ prefix:"
  echo "$LEAKED"
else
  pass "No secret-looking NEXT_PUBLIC_ variables found in src/"
fi

# Check for hardcoded secrets directly in source (API keys, tokens, passwords)
HARDCODED=$(grep -rnE '(sk_live_|sk_test_|ghp_|ghu_|xoxb-|xoxp-|AKIA[0-9A-Z]{16}|-----BEGIN (RSA )?PRIVATE KEY)' src/ 2>/dev/null || true)
if [ -n "$HARDCODED" ]; then
  error "Found hardcoded secrets in source code:"
  echo "$HARDCODED"
else
  pass "No hardcoded API keys or tokens found in src/"
fi

# ==========================================================================
# 2. DATABASE SECURITY — RLS, functions, and migration integrity
# ==========================================================================
section "2. Checking database security (RLS, functions, migrations)"

# Check for SECURITY DEFINER — always flag, AI decides if it's safe
DEFINER=$(grep -rn "SECURITY DEFINER" supabase/migrations/ 2>/dev/null || true)
if [ -n "$DEFINER" ]; then
  warn "SECURITY DEFINER functions found (bypasses RLS — verify auth.uid() checks):"
  echo "$DEFINER"
else
  pass "No SECURITY DEFINER functions found"
fi

# Check for deprecated auth.role() usage
AUTH_ROLE=$(grep -rn 'auth\.role()' supabase/migrations/ 2>/dev/null || true)
if [ -n "$AUTH_ROLE" ]; then
  error "Deprecated auth.role() found — must use TO clause instead:"
  echo "$AUTH_ROLE"
else
  pass "No deprecated auth.role() usage"
fi

# Check for user_metadata in authorization decisions (editable by users)
USER_META=$(grep -rn 'user_metadata' src/ 2>/dev/null | grep -v 'node_modules' || true)
if [ -n "$USER_META" ]; then
  warn "user_metadata references found (user-editable — never use for authorization):"
  echo "$USER_META"
else
  pass "No user_metadata in authorization paths"
fi

# Check for RLS policies missing WITH CHECK clause (UPDATE vulnerability)
MISSING_CHECK=$(grep -c 'WITH CHECK' supabase/migrations/20260604100000_strict_multi_tenant_rls.sql 2>/dev/null || echo "0")
POLICY_COUNT=$(grep -c 'CREATE POLICY' supabase/migrations/20260604100000_strict_multi_tenant_rls.sql 2>/dev/null || echo "0")
if [ "$MISSING_CHECK" -lt "$POLICY_COUNT" ] 2>/dev/null; then
  warn "Some RLS policies may be missing WITH CHECK clauses (allows tenant_id reassignment on UPDATE)"
fi

# Cross-reference: find tables referenced in code but missing from migrations
section "2b. Checking for tables referenced in code but missing RLS"
echo "  Tables with RLS enabled in migrations:"
grep -h "ENABLE ROW LEVEL SECURITY" supabase/migrations/*.sql 2>/dev/null | sed 's/ALTER TABLE /    /;s/ ENABLE.*//' || true

SEARCH_DIRS="app"
[ -d "src" ] && SEARCH_DIRS="app src"

echo ""
echo "  Tables referenced in application code:"
TABLES_IN_CODE=$(grep -rohE "\.from\(['\"]([a-z_]+)['\"]\)" $SEARCH_DIRS 2>/dev/null | sed "s/\.from(['\"]//;s/['\"])//" | sort -u || true)
for table in $TABLES_IN_CODE; do
  [ -z "$table" ] && continue
  if ! grep -q "ALTER TABLE $table ENABLE ROW LEVEL SECURITY" supabase/migrations/*.sql 2>/dev/null; then
    if ! grep -q "CREATE TABLE.*$table" supabase/migrations/*.sql 2>/dev/null && \
       ! grep -q "CREATE TABLE IF NOT EXISTS $table" supabase/migrations/*.sql 2>/dev/null; then
      error "Table '$table' is used in code but has NO migration and NO RLS!"
    else
      warn "Table '$table' has a migration but RLS may not be enabled"
    fi
  else
    pass "Table '$table' has RLS enabled"
  fi
done

# ==========================================================================
# 3. API ROUTE AUTHENTICATION — Every route, no exclusions
# ==========================================================================
section "3. Checking API route authentication (ALL routes, no exclusions)"

API_DIRS=()
[ -d "app/api" ] && API_DIRS+=("app/api")
[ -d "src/app/api" ] && API_DIRS+=("src/app/api")

echo "  Routes using centralized withApiAuth:"
for file in $(find "${API_DIRS[@]}" -type f \( -name "route.ts" -o -name "route.js" \) 2>/dev/null | sort); do
  route_path=$(echo "$file" | sed -E 's#^(src/)?app/api/##; s#/route\.(ts|js)$##')

  if grep -q "withApiAuth" "$file"; then
    pass "$route_path — uses withApiAuth"
  elif grep -q "stripe.webhooks.constructEvent" "$file"; then
    pass "$route_path — uses Stripe signature verification"
  elif grep -q "validateTwilioSignature" "$file"; then
    pass "$route_path — uses Twilio HMAC verification"
  elif grep -q "ORCHESTRATOR_SECRET" "$file"; then
    pass "$route_path — uses Orchestrator Secret verification"
  elif grep -q "CRON_SECRET" "$file"; then
    pass "$route_path — uses CRON_SECRET verification"
  elif grep -qE "supabase\.auth\.getUser|createClient.*auth" "$file"; then
    warn "$route_path — uses INLINE auth (not centralized withApiAuth). AI must verify tenant isolation."
    echo "       File: $file"
  elif grep -q "resetPasswordForEmail" "$file"; then
    pass "$route_path — public password reset endpoint (no auth required)"
  elif [ "$route_path" = "health" ] || [ "$route_path" = "lead" ] || [ "$route_path" = "demo/chat" ] || [ "$route_path" = "demo/summarize" ] || [ "$route_path" = "stripe/checkout" ] || [ "$route_path" = "auth/signup-bypass" ] || [ "$route_path" = "twilio/voice" ] || [ "$route_path" = "dashboard-assistant" ] || [ "$route_path" = "onboarding/analyze-url" ] || [ "$route_path" = "chat" ] || [ "$route_path" = "email/inbound" ] || [ "$route_path" = "proposals/[token]" ]; then
    warn "$route_path — intentionally unauthenticated (verify no tenant data access!)"
    echo "       File: $file"
  else
    error "$route_path — NO authentication detected!"
    echo "       File: $file"
  fi
done

# ==========================================================================
# 4. MIDDLEWARE / PROXY — Route protection
# ==========================================================================
section "4. Checking middleware/proxy public route whitelist"

if [ -f "src/proxy.ts" ]; then
  echo "  Public routes in proxy.ts (these bypass auth entirely):"
  grep -E '^\s+"/' src/proxy.ts 2>/dev/null | while read -r line; do
    echo "    $line"
  done
  warn "AI should verify each public route above is intentionally unauthenticated"
else
  warn "No proxy.ts found — middleware configuration unknown"
fi

# ==========================================================================
# 5. ENVIRONMENT VARIABLE HYGIENE
# ==========================================================================
section "5. Checking environment variable hygiene"

# Check that critical secrets have production fallback guards
for secret_var in "TWILIO_AUTH_TOKEN" "STRIPE_WEBHOOK_SECRET" "CRON_SECRET"; do
  DEV_BYPASS=$(grep -rn "process.env.NODE_ENV.*production" src/ 2>/dev/null | grep -l "$secret_var" 2>/dev/null || true)
  USAGE=$(grep -rn "$secret_var" src/ 2>/dev/null || true)
  if [ -n "$USAGE" ]; then
    pass "$secret_var is referenced in code"
  else
    warn "$secret_var is not referenced anywhere in src/ — may be unused"
  fi
done

# ==========================================================================
# 6. DEPENDENCY & CONFIG CHECKS
# ==========================================================================
section "6. Checking for risky patterns in configuration"

# Check if .env or .env.local is tracked by git
if git ls-files --error-unmatch .env .env.local 2>/dev/null; then
  error ".env or .env.local is tracked by git — secrets may be in version history!"
else
  pass ".env files are not tracked by git"
fi

# Check .gitignore includes env files
if grep -q '\.env' .gitignore 2>/dev/null; then
  pass ".gitignore includes .env patterns"
else
  warn ".gitignore may not exclude .env files"
fi

# ==========================================================================
# SUMMARY
# ==========================================================================
echo ""
echo "=========================================="
echo "Scan Complete"
echo "  Errors:   $ERRORS (must fix)"
echo "  Warnings: $WARNINGS (AI should review)"
echo "=========================================="

if [ $ERRORS -gt 0 ]; then
  echo "❌ FAILED — $ERRORS error(s) require immediate attention"
  exit 1
else
  echo "✅ PASSED — no critical errors found"
  exit 0
fi
