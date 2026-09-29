/* eslint-disable */
const WebSocket = require('ws');
require('dotenv').config({ path: '.env.local' });

const voiceId = 'CwhRBWXzGAHq8TQ4Fs17';
const url = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=eleven_turbo_v2_5&output_format=ulaw_8000`;

const ws = new WebSocket(url, {
  headers: {
    'xi-api-key': process.env.ELEVENLABS_API_KEY,
  }
});

ws.on('open', () => {
  console.log('[ElevenLabs] Connected');
  const initMessage = {
    text: ' ',
    voice_settings: { stability: 0.5, similarity_boost: 0.8 },
    xi_api_key: process.env.ELEVENLABS_API_KEY,
  };
  ws.send(JSON.stringify(initMessage));
  ws.send(JSON.stringify({ text: "Hello world!", try_trigger_generation: true }));
});

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.audio) {
    console.log('[ElevenLabs] Received audio chunk of size', msg.audio.length);
  } else if (msg.isFinal) {
    console.log('[ElevenLabs] Finalized');
  } else if (msg.error || msg.message) {
    console.log('[ElevenLabs] MSG/ERROR:', msg);
  } else {
    console.log('[ElevenLabs] Unknown message:', msg);
  }
});

ws.on('close', (code, reason) => {
  console.log('[ElevenLabs] Closed', code, reason.toString());
});

ws.on('error', (err) => {
  console.error('[ElevenLabs] Error:', err);
});
