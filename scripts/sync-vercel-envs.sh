#!/bin/bash

# sync-vercel-envs.sh
# Safely synchronizes critical Voice Pipeline environment variables from .env.local
# to Vercel production without accidentally injecting newlines or full file contents.

set -e

echo "🚀 Starting Vercel Environment Sync..."

if [ ! -f .env.local ]; then
  echo "❌ Error: .env.local file not found in the root directory."
  exit 1
fi

# Ensure Vercel CLI is available
if ! command -v npx vercel &> /dev/null; then
  echo "❌ Error: Vercel CLI is not available. Please install it or run 'npm install'."
  exit 1
fi

echo "📦 Extracting required variables..."

# Extract values specifically avoiding newlines or exporting the whole file wrongly
WS_URL=$(grep "^ORCHESTRATOR_WS_URL=" .env.local | cut -d '=' -f 2-)
NEXT_PUB_WS_URL=$(grep "^NEXT_PUBLIC_ORCHESTRATOR_WS_URL=" .env.local | cut -d '=' -f 2-)
SECRET=$(grep "^ORCHESTRATOR_SECRET=" .env.local | cut -d '=' -f 2-)

if [ -z "$WS_URL" ] || [ -z "$SECRET" ]; then
  echo "❌ Error: Missing ORCHESTRATOR_WS_URL or ORCHESTRATOR_SECRET in .env.local!"
  exit 1
fi

echo "⚡ Pushing ORCHESTRATOR_SECRET to Vercel..."
echo -n "$SECRET" | npx vercel env add ORCHESTRATOR_SECRET production

echo "⚡ Pushing ORCHESTRATOR_WS_URL to Vercel..."
echo -n "$WS_URL" | npx vercel env add ORCHESTRATOR_WS_URL production

if [ ! -z "$NEXT_PUB_WS_URL" ]; then
  echo "⚡ Pushing NEXT_PUBLIC_ORCHESTRATOR_WS_URL to Vercel..."
  echo -n "$NEXT_PUB_WS_URL" | npx vercel env add NEXT_PUBLIC_ORCHESTRATOR_WS_URL production
fi

echo "🎉 Variables synced successfully!"
echo "⚠️  IMPORTANT: You must redeploy your Next.js application for these changes to take effect."
echo "Run: npx vercel --prod"
