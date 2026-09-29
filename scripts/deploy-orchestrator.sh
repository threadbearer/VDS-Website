#!/bin/bash

# deploy-orchestrator.sh
# Automates the deployment of the Knight Shift Orchestrator to Google Cloud Run
# while ensuring all required environment variables are parsed and injected.

set -e

echo "🚀 Starting Orchestrator Deployment Pipeline..."

# 1. Verify .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ Error: .env.local file not found in the root directory."
  exit 1
fi

# 2. Extract values safely
GEMINI_API_KEY=$(grep -m 1 "^GEMINI_API_KEY=" .env.local | cut -d '=' -f 2- | tr -d '\r' | tr -d '"' | tr -d "'")
ELEVENLABS_API_KEY=$(grep -m 1 "^ELEVENLABS_API_KEY=" .env.local | cut -d '=' -f 2- | tr -d '\r' | tr -d '"' | tr -d "'")
ELEVENLABS_VOICE_ID_ES=$(grep -m 1 "^ELEVENLABS_VOICE_ID_ES=" .env.local | cut -d '=' -f 2- | tr -d '\r' | tr -d '"' | tr -d "'")
DEEPGRAM_API_KEY=$(grep -m 1 "^DEEPGRAM_API_KEY=" .env.local | cut -d '=' -f 2- | tr -d '\r' | tr -d '"' | tr -d "'")
ORCHESTRATOR_SECRET=$(grep -m 1 "^ORCHESTRATOR_SECRET=" .env.local | cut -d '=' -f 2- | tr -d '\r' | tr -d '"' | tr -d "'")
NEXT_PUBLIC_SITE_URL=$(grep -m 1 "^NEXT_PUBLIC_SITE_URL=" .env.local | cut -d '=' -f 2- | tr -d '\r' | tr -d '"' | tr -d "'")

# 3. Validate required variables
REQUIRED_VARS=("GEMINI_API_KEY" "ELEVENLABS_API_KEY" "DEEPGRAM_API_KEY" "ORCHESTRATOR_SECRET")

for VAR in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    echo "❌ Error: Required environment variable $VAR is missing or empty in .env.local!"
    exit 1
  fi
done

# Production domain (custom domain on the Vercel project)
BACKEND_URL="https://knightshiftagents.com"

# Format the comma-separated env vars string for gcloud
ENV_VARS="GEMINI_API_KEY=${GEMINI_API_KEY},ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY},DEEPGRAM_API_KEY=${DEEPGRAM_API_KEY},ORCHESTRATOR_SECRET=${ORCHESTRATOR_SECRET},NEXTJS_BACKEND_URL=${BACKEND_URL}"
# Optional: native Spanish TTS voice (G2). Without it Spanish is spoken in the default voice.
if [ -n "$ELEVENLABS_VOICE_ID_ES" ]; then
  ENV_VARS="${ENV_VARS},ELEVENLABS_VOICE_ID_ES=${ELEVENLABS_VOICE_ID_ES}"
fi

# Optional voice-engine flags (see services/orchestrator/server.ts):
#   ENABLE_GEMINI_LIVE=true  → Gemini Live speech-to-speech instead of the cascade
#   GEMINI_LIVE_MODEL=...    → override the Live API model id
ENABLE_GEMINI_LIVE=$(grep -m 1 "^ENABLE_GEMINI_LIVE=" .env.local | cut -d '=' -f 2- | tr -d '\r' | tr -d '"' | tr -d "'")
GEMINI_LIVE_MODEL=$(grep -m 1 "^GEMINI_LIVE_MODEL=" .env.local | cut -d '=' -f 2- | tr -d '\r' | tr -d '"' | tr -d "'")
if [ -n "$ENABLE_GEMINI_LIVE" ]; then
  ENV_VARS="${ENV_VARS},ENABLE_GEMINI_LIVE=${ENABLE_GEMINI_LIVE}"
fi
if [ -n "$GEMINI_LIVE_MODEL" ]; then
  ENV_VARS="${ENV_VARS},GEMINI_LIVE_MODEL=${GEMINI_LIVE_MODEL}"
fi

echo "✅ Environment variables validated successfully."
echo "🚢 Deploying to Google Cloud Run (us-central1)..."

# --timeout: Cloud Run applies the request timeout to WebSockets, so this is the
#   hard cap on a phone call's length. The 300s default hung up every call at
#   5 minutes; 3600 is the maximum.
# Region: us-central1 sits between Twilio's US1 media region + the AI vendors
#   (east) and Supabase/Vercel functions (us-west-2 / pdx1). Per-turn audio hops
#   outnumber backend hops, so don't move it west without measuring first.
gcloud run deploy knight-shift-orchestrator \
  --source services/orchestrator \
  --region us-central1 \
  --timeout 3600 \
  --allow-unauthenticated \
  --set-env-vars="${ENV_VARS}"

echo "🎉 Deployment complete! The Orchestrator is now securely connected to the AI engines."
