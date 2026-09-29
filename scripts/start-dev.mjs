/* eslint-disable */
// start-dev.mjs — one-command local voice stack.
//
//   node scripts/start-dev.mjs
//
// Starts two cloudflared quick tunnels (:3000 web, :8080 orchestrator WS),
// points the TWILIO_DEV_PHONE_NUMBER voice webhook at the web tunnel, then runs
// Next.js + the orchestrator with the tunnel URLs in env. Self-healing: if a
// tunnel process dies it respawns, and when a quick-tunnel URL rotates the
// Twilio webhook is re-updated (web) or the child servers are restarted with
// fresh env (WS — Next bakes ORCHESTRATOR_WS_URL into the TwiML it serves).
import { spawn, execSync } from 'child_process';
import http from 'http';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

console.log('🚀 Starting local development environment...');

let webUrl = '';
let wsUrl = '';
let started = false;
let isCleaningUp = false;
let childProcesses = [];
const tunnels = [];

// ── Tunnels ──────────────────────────────────────────────────────────────────

function startTunnel(port, metricsPort, onUrl) {
  const state = { proc: null, port };
  let knownUrl = '';

  // Quick tunnels are rate-limited per-IP (429 / Cloudflare error 1015). A flat
  // retry keeps the limit alive forever, so back off exponentially and say why.
  let attempt = 0;
  const BASE_DELAY = 2000;
  const MAX_DELAY = 5 * 60 * 1000;

  const respawn = () => {
    if (isCleaningUp) return;
    state.proc = spawn('./scripts/cloudflared', [
      'tunnel',
      '--url', `http://localhost:${port}`,
      '--http-host-header', 'localhost',
      '--metrics', `localhost:${metricsPort}`
    ]);

    // Keep the last few stderr lines so a death can be explained, and flag the
    // rate-limit case explicitly since it needs a wait, not a retry.
    let recent = [];
    let rateLimited = false;
    state.proc.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      if (/\b429\b|error code: 1015|Too Many Requests/.test(text)) rateLimited = true;
      recent = recent.concat(text.split('\n').filter(Boolean)).slice(-5);
    });

    state.proc.on('exit', () => {
      if (isCleaningUp) return;

      // A tunnel that ran long enough to serve traffic is a fresh failure, not
      // part of a retry storm — reset the backoff.
      attempt = knownUrl ? 0 : attempt + 1;
      const delay = Math.min(BASE_DELAY * 2 ** (attempt - 1), MAX_DELAY);
      const secs = Math.round(delay / 1000);

      if (rateLimited) {
        console.warn(
          `⚠️  Tunnel :${port} rejected by Cloudflare (rate limited — error 1015).\n` +
          `   trycloudflare.com is throttling quick tunnels from this IP.\n` +
          `   Retrying in ${secs}s. If this persists, wait it out, or run\n` +
          `   'npm run dev' alone if you don't need inbound Twilio calls.`
        );
      } else {
        console.warn(`⚠️  Tunnel :${port} died — respawning in ${secs}s...`);
        for (const line of recent) console.warn(`   ${line}`);
      }

      setTimeout(respawn, delay);
    });
  };
  respawn();

  // Poll the metrics endpoint forever: catches both the first URL and any
  // rotation after a respawn (quick-tunnel URLs change on every restart).
  setInterval(() => {
    http.get(`http://127.0.0.1:${metricsPort}/quicktunnel`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.hostname) {
            const url = `https://${json.hostname}`;
            if (url !== knownUrl) {
              const prev = knownUrl;
              knownUrl = url;
              onUrl(url, prev);
            }
          }
        } catch (e) { }
      });
    }).on('error', () => { /* not ready */ });
  }, 2000);

  tunnels.push(state);
}

// ── Twilio webhook ───────────────────────────────────────────────────────────

const devNumber = process.env.TWILIO_DEV_PHONE_NUMBER;

function pointTwilioAt(url) {
  if (!devNumber) {
    console.warn('⚠️  No TWILIO_DEV_PHONE_NUMBER set in .env.local; phone testing disabled.');
    return;
  }
  console.log(`📞 Updating Twilio webhook for dev number ${devNumber} → ${url} ...`);
  try {
    execSync(`node scripts/update-twilio.mjs ${url}`, { stdio: 'inherit' });
    console.log('✅ Twilio updated.\n');
  } catch (err) {
    console.error('❌ Failed to update Twilio webhook.', err.message);
  }
}

// ── Child servers ────────────────────────────────────────────────────────────

function startChildren() {
  const env = Object.assign({}, process.env, {
    ORCHESTRATOR_WS_URL: wsUrl.replace('https://', 'wss://')
  });

  console.log('🌐 Starting Next.js local server...');
  const nextjs = spawn('npm', ['run', 'dev'], { stdio: 'inherit', env });

  console.log('💻 Starting orchestrator...');
  const orchestrator = spawn('npx', ['--yes', 'ts-node', 'services/orchestrator/server.ts'], { stdio: 'inherit', env });
  orchestrator.on('close', (code) => {
    if (!isCleaningUp) console.log(`Orchestrator exited with code ${code}`);
  });

  childProcesses = [nextjs, orchestrator];
}

function restartChildren(reason) {
  console.warn(`♻️  ${reason} — restarting Next.js + orchestrator with fresh env...`);
  for (const p of childProcesses) {
    try { p.kill(); } catch (e) { }
  }
  // Give the ports a moment to free up before rebinding.
  setTimeout(startChildren, 3000);
}

// ── Wiring ───────────────────────────────────────────────────────────────────

function onReadyCheck() {
  if (webUrl && wsUrl && !started) {
    started = true;
    console.log(`\n🔗 Web tunnel: ${webUrl}`);
    console.log(`🔗 WS tunnel:  ${wsUrl}`);
    pointTwilioAt(webUrl);
    startChildren();
  }
}

startTunnel(3000, 45001, (url, prev) => {
  webUrl = url;
  if (!started) return onReadyCheck();
  // Rotated after start: only Twilio holds this URL — re-point it.
  console.warn(`♻️  Web tunnel URL rotated (${prev} → ${url})`);
  pointTwilioAt(url);
});

startTunnel(8080, 45002, (url, prev) => {
  wsUrl = url;
  if (!started) return onReadyCheck();
  // Rotated after start: Next serves this URL in TwiML from env, so the
  // children must restart to pick it up.
  restartChildren(`WS tunnel URL rotated (${prev} → ${url})`);
});

// ── Shutdown ─────────────────────────────────────────────────────────────────

function cleanup() {
  if (isCleaningUp) return;
  isCleaningUp = true;
  console.log('\n🛑 Shutting down local development environment...');

  for (const p of childProcesses) {
    try { p.kill(); } catch (e) { }
  }
  for (const t of tunnels) {
    try { t.proc?.kill(); } catch (e) { }
  }

  // We no longer restore the production Twilio webhook because development
  // only modifies the TWILIO_DEV_PHONE_NUMBER. The dev number's webhook
  // is left pointing at the dead tunnel.

  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('SIGHUP', cleanup);
