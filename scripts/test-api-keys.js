/* eslint-disable */
require('dotenv').config({ path: '.env.local' });
async function test() {
  const deepgramKey = process.env.DEEPGRAM_API_KEY;
  console.log("Deepgram Key exists:", !!deepgramKey);
  if (deepgramKey) {
    const projRes = await fetch("https://api.deepgram.com/v1/projects", {
      headers: { "Authorization": `Token ${deepgramKey}` }
    });
    console.log("Deepgram Projects Status:", projRes.status);
    if (projRes.ok) {
      const projData = await projRes.json();
      const projectId = projData.projects?.[0]?.project_id;
      if (projectId) {
        const balRes = await fetch(`https://api.deepgram.com/v1/projects/${projectId}/balances`, {
          headers: { "Authorization": `Token ${deepgramKey}` }
        });
        console.log("Deepgram Balances Status:", balRes.status);
        if (balRes.ok) {
          const balData = await balRes.json();
          console.log("Deepgram Balances Data:", balData);
        } else {
          console.log("Deepgram Balances Error:", await balRes.text());
        }
      }
    } else {
      console.log("Deepgram Projects Error:", await projRes.text());
    }
  }

  const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
  console.log("ElevenLabs Key exists:", !!elevenLabsKey);
  if (elevenLabsKey) {
    const elRes = await fetch("https://api.elevenlabs.io/v1/user/subscription", {
      headers: { "xi-api-key": elevenLabsKey }
    });
    console.log("ElevenLabs Status:", elRes.status);
    if (elRes.ok) {
      const elData = await elRes.json();
      console.log("ElevenLabs Data:", elData);
    } else {
      console.log("ElevenLabs Error:", await elRes.text());
    }
  }
}
test();
