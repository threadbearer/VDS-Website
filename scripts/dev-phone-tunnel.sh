#!/bin/bash

# dev-phone-tunnel.sh — point the DEV Twilio number at the LOCAL voice stack
# so agent changes are testable by actually phoning the dev number.
#
#   ./scripts/dev-phone-tunnel.sh           # wire phone → local dev stack
#   ./scripts/dev-phone-tunnel.sh --restore # point dev webhook back at a harmless URL
#
# What the default mode does:
#   1. Ensures two cloudflared quick tunnels exist (dev server :3000, orchestrator :8080)
#   2. Reads their public URLs from the cloudflared metrics endpoints
#   3. Updates the DEV Twilio number's voice webhook to the :3000 tunnel
#   4. Prints the env vars the dev server + orchestrator must run with
#
# IMPORTANT: while the webhook points at a tunnel, calls to the dev number
# only work while this machine, both tunnels, the dev server, and the local
# orchestrator are all up.

set -e
cd "$(dirname "$0")/.."

if [ ! -f .env.local ]; then
  echo "❌ .env.local not found"; exit 1
fi

envval() { grep -m 1 "^$1=" .env.local | cut -d '=' -f 2- | tr -d '\r"'"'"; }
TWILIO_ACCOUNT_SID=$(envval TWILIO_ACCOUNT_SID)
TWILIO_AUTH_TOKEN=$(envval TWILIO_AUTH_TOKEN)
TWILIO_DEV_PHONE_NUMBER=$(envval TWILIO_DEV_PHONE_NUMBER)
TWILIO_PHONE_NUMBER=$(envval TWILIO_PHONE_NUMBER)

if [ -z "$TWILIO_ACCOUNT_SID" ] || [ -z "$TWILIO_AUTH_TOKEN" ] || [ -z "$TWILIO_DEV_PHONE_NUMBER" ]; then
  echo "❌ Twilio credentials missing from .env.local (need TWILIO_DEV_PHONE_NUMBER)"; exit 1
fi

# Never let a copy-paste mistake point the PRODUCTION line at a tunnel.
if [ "$TWILIO_DEV_PHONE_NUMBER" == "$TWILIO_PHONE_NUMBER" ]; then
  echo "❌ TWILIO_DEV_PHONE_NUMBER must differ from the production TWILIO_PHONE_NUMBER"; exit 1
fi

# Look up the phone number SID once — needed for the update call either way.
PN_JSON=$(curl -s -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" \
  "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/IncomingPhoneNumbers.json?PhoneNumber=$(python3 -c "import urllib.parse;print(urllib.parse.quote('$TWILIO_DEV_PHONE_NUMBER'))")")
PN_SID=$(echo "$PN_JSON" | python3 -c "import json,sys;print(json.load(sys.stdin)['incoming_phone_numbers'][0]['sid'])")

set_voice_url() {
  curl -s -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" -X POST \
    "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/IncomingPhoneNumbers/$PN_SID.json" \
    --data-urlencode "VoiceUrl=$1" --data-urlencode "VoiceMethod=POST" \
    | python3 -c "import json,sys;d=json.load(sys.stdin);print('✅ voice webhook →', d['voice_url'])"
}

if [ "$1" == "--restore" ]; then
  set_voice_url "https://knightshiftagents.com/api/twilio/voice"
  echo "🎉 Dev number reset to the production webhook URL (the production number was never touched)."
  exit 0
fi

# ── Tunnels ──────────────────────────────────────────────────────────────────
tunnel_host() { curl -s -m 2 "localhost:$1/quicktunnel" | python3 -c "import json,sys;print(json.load(sys.stdin)['hostname'])" 2>/dev/null; }

ensure_tunnel() { # $1=local port  $2=metrics port
  local host
  host=$(tunnel_host "$2")
  if [ -z "$host" ]; then
    echo "  starting cloudflared tunnel for :$1 ..." >&2
    nohup ./scripts/cloudflared tunnel --url "http://localhost:$1" --http-host-header localhost \
      --metrics "localhost:$2" > "/tmp/cloudflared-$1.log" 2>&1 &
    for _ in $(seq 1 20); do
      sleep 1
      host=$(tunnel_host "$2")
      [ -n "$host" ] && break
    done
  fi
  if [ -z "$host" ]; then
    echo "❌ could not start/read tunnel for :$1 (see /tmp/cloudflared-$1.log)" >&2; exit 1
  fi
  echo "$host"
}

echo "🚇 Ensuring tunnels..."
WEB_HOST=$(ensure_tunnel 3000 45001)
ORCH_HOST=$(ensure_tunnel 8080 45002)
echo "  dev server:   https://$WEB_HOST"
echo "  orchestrator: wss://$ORCH_HOST"

set_voice_url "https://$WEB_HOST/api/twilio/voice"

echo ""
echo "Now make sure both processes run with the tunnel URL:"
echo "  ORCHESTRATOR_WS_URL=wss://$ORCH_HOST NEXT_PUBLIC_ORCHESTRATOR_WS_URL=wss://$ORCH_HOST npm run dev"
echo "  npx ts-node services/orchestrator/server.ts"
echo ""
echo "📞 Then call $TWILIO_DEV_PHONE_NUMBER — it rings straight into the local stack."
echo "⚠️  Quick-tunnel URLs rotate on every cloudflared restart: re-run this script"
echo "    after restarting tunnels."
