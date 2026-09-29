#!/bin/bash
# ==========================================================================
# Knight Shift Agents — Route Scaffolding Generator
# ==========================================================================
# Instantly generates a fully secure, withApiAuth-wrapped API route.
# Usage: ./scripts/make-route.sh api/feature
# ==========================================================================

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "❌ Error: Please provide a route path."
  echo "Usage: ./scripts/make-route.sh api/payments"
  exit 1
fi

ROUTE_PATH="$1"
# Strip leading slashes if any
ROUTE_PATH="${ROUTE_PATH#/}"

# Ensure it starts with api/ if we are scaffolding APIs
if [[ "$ROUTE_PATH" != api/* ]]; then
  echo "⚠️  Warning: Route path does not start with 'api/'. Generating anyway..."
fi

FULL_DIR="src/app/$ROUTE_PATH"
FULL_FILE="$FULL_DIR/route.ts"

if [ -f "$FULL_FILE" ]; then
  echo "❌ Error: Route already exists at $FULL_FILE"
  exit 1
fi

echo "Creating directory: $FULL_DIR"
mkdir -p "$FULL_DIR"

echo "Scaffolding secure route: $FULL_FILE"

cat > "$FULL_FILE" << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api-handler';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * GET Handler
 * Protected route wrapper. apiCtx contains the authenticated tenant payload.
 */
export const GET = withApiAuth(async (request: NextRequest, apiCtx) => {
  const supabase = createServiceClient();
  
  // Example query using forced tenant isolation
  // const { data, error } = await supabase
  //   .from('table_name')
  //   .select('*')
  //   .eq('tenant_id', apiCtx.tenantId);

  return NextResponse.json({
    success: true,
    message: "Secure route operational",
    tenantId: apiCtx.tenantId
  });
});

/**
 * POST Handler
 */
export const POST = withApiAuth(async (request: NextRequest, apiCtx) => {
  const supabase = createServiceClient();
  const body = await request.json();

  return NextResponse.json({
    success: true,
    message: "Data received safely"
  });
});
EOF

echo "✅ Success! Secure route generated at $FULL_FILE"
echo "⚠️  Don't forget to document this route in CONTEXT.md!"
