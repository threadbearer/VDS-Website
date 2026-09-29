/**
 * simulate-call.ts — drive the local orchestrator exactly like Twilio does.
 *
 *   npx tsx --env-file=.env.local scripts/simulate-call.ts
 *
 * Synthesizes caller utterances with ElevenLabs (μ-law 8kHz, the real PSTN
 * format), connects to the orchestrator websocket, sends a Twilio-shaped
 * `start` frame with the same customParameters the voice webhook sends, then
 * streams the audio in 20ms frames and measures whether the agent answers.
 *
 * This reproduces the full production voice path — audio mixer, μ-law codec,
 * Gemini Live session, tool bridge — without needing a phone. A turn that
 * ends with "NO AGENT AUDIO" is the agent going silent on a real call.
 *
 * Requires the orchestrator (:8080) and Next.js (:3000) to be running.
 */
// Uses Node's built-in WebSocket client (Node 18+) — no `ws` dependency, so
// this stays runnable from the repo root's tsconfig.
import { decodeMuLaw, encodeMuLaw } from "../services/orchestrator/lib/audio-mixer";

const ORCH_URL = process.env.SIM_ORCH_URL || "ws://localhost:8080";

/**
 * SIM_ATTENUATE=0.07 makes the synthetic caller as quiet as a real one on
 * speakerphone. TTS audio is far louder than a live phone line, which is
 * exactly how a "the agent can't hear quiet callers" bug hides from this
 * harness — always test a quiet pass before trusting a green run.
 */
const ATTENUATE = process.env.SIM_ATTENUATE ? Number(process.env.SIM_ATTENUATE) : 1;

function attenuate(ulaw: Buffer, factor: number): Buffer {
  if (factor >= 1) return ulaw;
  const pcm = decodeMuLaw(ulaw);
  for (let i = 0; i < pcm.length / 2; i++) {
    pcm.writeInt16LE(Math.round(pcm.readInt16LE(i * 2) * factor), i * 2);
  }
  return encodeMuLaw(pcm);
}
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel — the simulated caller
const FRAME_MS = 20;
const FRAME_BYTES = 160; // 8kHz μ-law, 20ms

const CALLER_PHONE = process.env.SIM_CALLER_PHONE || "+15558675309";
const AGENT_PHONE = process.env.SIM_AGENT_PHONE || "+16614492210";

// Override with SIM_TURNS="first utterance|second utterance|..." to script a
// different scenario (e.g. one that forces a tool call).
const TURNS = process.env.SIM_TURNS
  ? process.env.SIM_TURNS.split("|").map((t) => t.trim())
  : [
      "Hi, I want to get some information about getting AI agents for my business.",
      "I make tools for local businesses.",
      "Nobody. Nobody answers the calls right now.",
      "How much does it cost?",
      "Okay, that sounds good. Let's do it.",
    ];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function synth(text: string): Promise<Buffer> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=ulaw_8000`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, model_id: "eleven_flash_v2_5" }),
    },
  );
  if (!res.ok) {
    throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  }
  return attenuate(Buffer.from(await res.arrayBuffer()), ATTENUATE);
}

async function main() {
  console.log(`[sim] synthesizing ${TURNS.length} caller utterances...`);
  const audio: Buffer[] = [];
  for (const t of TURNS) {
    audio.push(await synth(t));
    process.stdout.write(".");
  }
  console.log(" done");

  const ws = new WebSocket(ORCH_URL);
  let agentFrames = 0;
  let totalAgentFrames = 0;
  let closed = false;
  let closeInfo = "";

  ws.onclose = (ev) => {
    closed = true;
    closeInfo = `code=${ev.code} reason=${ev.reason || "(none)"}`;
    console.log(`\n[sim] 🔌 orchestrator closed the socket: ${closeInfo}`);
  };
  ws.onerror = () => console.log(`\n[sim] ❌ websocket error`);
  ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(String(ev.data));
      if (msg.event === "media") {
        agentFrames++;
        totalAgentFrames++;
      } else if (msg.event === "clear") {
        console.log("[sim]   (agent buffer cleared — barge-in)");
      }
    } catch {
      /* ignore */
    }
  };

  await new Promise<void>((resolve, reject) => {
    ws.onopen = () => resolve();
    const priorError = ws.onerror;
    ws.onerror = (e) => {
      if (priorError) priorError.call(ws, e as Event);
      reject(new Error("failed to connect to orchestrator"));
    };
  });
  console.log("[sim] connected to orchestrator");

  const streamSid = `MZ${Date.now()}`;
  ws.send(JSON.stringify({ event: "connected", protocol: "Call", version: "1.0.0" }));
  ws.send(
    JSON.stringify({
      event: "start",
      sequenceNumber: "1",
      streamSid,
      start: {
        streamSid,
        callSid: `CA${Date.now()}`,
        tracks: ["inbound"],
        mediaFormat: { encoding: "audio/x-mulaw", sampleRate: 8000, channels: 1 },
        // Mirrors src/app/api/twilio/voice/route.ts <Parameter> tags.
        customParameters: {
          conversationId: "",
          agentId: "9b800454-7e9b-4e74-8a0b-d9e00f1f00c4",
          tenantId: "7bb76919-2ec3-4867-acdf-fa727080b430",
          personaId: "commander",
          callerPhone: CALLER_PHONE,
          calledPhone: AGENT_PHONE,
        },
      },
    }),
  );

  // Let the agent deliver its greeting.
  console.log("\n[sim] >>> waiting for greeting...");
  await sleep(9000);
  console.log(`[sim] <<< greeting audio frames: ${agentFrames}`);

  for (let i = 0; i < TURNS.length; i++) {
    if (closed) {
      console.log(`\n[sim] 💥 SOCKET DIED before turn ${i + 1} (${closeInfo})`);
      process.exit(1);
    }

    console.log(`\n[sim] >>> TURN ${i + 1}: "${TURNS[i]}"`);
    agentFrames = 0;

    const buf = audio[i]!;
    for (let off = 0; off < buf.length; off += FRAME_BYTES) {
      if (closed) break;
      const chunk = buf.subarray(off, Math.min(off + FRAME_BYTES, buf.length));
      ws.send(
        JSON.stringify({
          event: "media",
          streamSid,
          media: { payload: chunk.toString("base64") },
        }),
      );
      await sleep(FRAME_MS);
    }

    // Trailing silence so the model detects end-of-turn, then time to answer.
    const silence = Buffer.alloc(FRAME_BYTES, 0xff);
    for (let s = 0; s < 40 && !closed; s++) {
      ws.send(
        JSON.stringify({
          event: "media",
          streamSid,
          media: { payload: silence.toString("base64") },
        }),
      );
      await sleep(FRAME_MS);
    }
    await sleep(9000);

    console.log(
      agentFrames > 0
        ? `[sim] <<< agent replied (${agentFrames} audio frames)`
        : `[sim] <<< ⚠️  NO AGENT AUDIO — the agent went silent on this turn`,
    );
  }

  console.log(
    `\n[sim] finished. socket ${closed ? `CLOSED (${closeInfo})` : "still open"}, total agent frames: ${totalAgentFrames}`,
  );
  if (!closed) {
    ws.send(JSON.stringify({ event: "stop", streamSid }));
    await sleep(1500);
    ws.close();
  }
  process.exit(0);
}

main().catch((e) => {
  console.error("[sim] fatal:", e);
  process.exit(1);
});
