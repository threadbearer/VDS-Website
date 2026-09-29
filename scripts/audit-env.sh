#!/bin/bash
# ==========================================================================
# Knight Shift Agents — Environment Variable Drift Scanner
# ==========================================================================
# Compares actual process.env usage in the codebase against CONTEXT.md 
# and .env.example to ensure we don't end up with undocumented, required
# environment variables that break deployment or local setup.
#
# Usage: ./scripts/audit-env.sh
# ==========================================================================

set -euo pipefail

ERRORS=0
WARNINGS=0

error() { echo "[ERROR] $1"; ERRORS=$((ERRORS+1)); }
warn()  { echo "[WARNING] $1"; WARNINGS=$((WARNINGS+1)); }
pass()  { echo "  ✓ $1"; }
section() { echo ""; echo "── $1 ──"; }

echo "=========================================="
echo "🔐  Knight Shift Env Guard v1.0  🔐"
echo "=========================================="
echo "Scan time: $(date -Iseconds)"

if [ ! -f "CONTEXT.md" ]; then
  error "CONTEXT.md not found. Run from project root."
  exit 1
fi

if [ ! -f ".env.example" ]; then
  error ".env.example not found."
  exit 1
fi

# Extract all environment variables used in code
# Ignore NODE_ENV, npm_*, NEXT_RUNTIME, VERCEL_URL etc. standard vars
section "1. Scanning source code for process.env usage"
USED_VARS=$(grep -roE 'process\.env\.[A-Z0-9_]+' src/ src/proxy.ts 2>/dev/null | grep -vE 'NODE_ENV|NEXT_RUNTIME|VERCEL_URL' | awk -F'process.env.' '{print $2}' | sort -u || true)

# Check if they exist in CONTEXT.md and .env.example
for var in $USED_VARS; do
  FOUND_IN_CONTEXT=false
  FOUND_IN_EXAMPLE=false

  if grep -q "\b$var\b" CONTEXT.md; then
    FOUND_IN_CONTEXT=true
  fi

  if grep -qE "^#? *$var=" .env.example; then
    FOUND_IN_EXAMPLE=true
  fi

  if [ "$FOUND_IN_CONTEXT" = false ] && [ "$FOUND_IN_EXAMPLE" = false ]; then
    error "Variable '$var' is used in code but missing from BOTH CONTEXT.md and .env.example"
  elif [ "$FOUND_IN_CONTEXT" = false ]; then
    warn "Variable '$var' is used in code but not documented in CONTEXT.md Env Vars section"
  elif [ "$FOUND_IN_EXAMPLE" = false ]; then
    warn "Variable '$var' is used in code but missing from .env.example template"
  else
    pass "'$var' is fully documented"
  fi
done

# Check for Vercel-specific lock-in variables
section "2. Checking for Cloud-Agnostic Compliance"
if grep -rnoE 'process\.env\.VERCEL_URL' src/ src/proxy.ts 2>/dev/null; then
  error "Usage of 'VERCEL_URL' detected. Use 'NEXT_PUBLIC_SITE_URL' to ensure the app can be hosted outside Vercel."
else
  pass "No proprietary VERCEL_URL usage found"
fi

# ==========================================================================
# SUMMARY
# ==========================================================================
echo ""
echo "=========================================="
echo "Env Scan Complete"
echo "  Errors:   $ERRORS (must fix before commit)"
echo "  Warnings: $WARNINGS (should fix)"
echo "=========================================="

if [ $ERRORS -gt 0 ]; then
  echo "❌ UNHEALTHY — $ERRORS undocumented variable(s) found"
  exit 1
else
  echo "✅ HEALTHY — all variables properly documented"
  exit 0
fi
