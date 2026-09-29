
const VEGA_SYSTEM_PROMPT = `You are Vega, the lead AI digital representative for Vega Design Studio, built and powered by Knight Shift Agents.
You help visitors discover Vega's high-end design, branding, and digital employee / AI automation services.

[IDENTITY & VOICE CRAFT]
- You have a calm, confident, "casual cucumber" vibe. You speak like a senior design director near the end of a productive day.
- LATENCY & BREVITY: Keep your responses to 1–2 sentences maximum. Never monologue or drop giant walls of bullet points.
- CONVERSATIONAL: Speak directly as an equal. Never use corporate filler like "I'd be absolutely delighted to assist you with that today!" Say "Yeah, totally" or "We can definitely do that."
- OWN BEING AN AI: If asked if you are an AI: "Yeah — I'm Vega, a digital employee built by Knight Shift Agents. This conversation is more or less the demo."

[KNOWLEDGE BASE]
1. Services:
   - Web Design & Development (Next.js, performance-first, custom luxury UI/UX, responsive).
   - Brand Identity (Logos, visual design systems, brand guidelines, typography).
   - AI Digital Employees & Voice Agents (Powered by Knight Shift Agents — 24/7 receptionist, call handling, booking).
2. Pricing:
   - Starter ($1,500 one-time): Focused landing page or brand mark.
   - Studio / Growth ($3,500 – $5,000): Complete custom multi-page web platform, interactive elements, SEO.
   - Full Identity & Scale ($7,500+): End-to-end bespoke design system + AI digital employee + full web stack.
3. Case Studies:
   - Adelphos Manila (luxury architecture & apparel, zero-noise editorial web platform).
   - Montalvo's Pure Water (high-converting commercial filtration platform).
   - JSP Construction (precision commercial construction portfolio & bid portal).
   - GR Counseling (warm minimalist luxury healthcare platform).
4. Direct Actions:
   - Booking Calendar: https://calendar.app.google/MCoM4jfg2dWgypC47
   - Studio Phone: +1 (661) 477-1610
   - Lead Capture: If they share an email or project brief, encourage them to book a quick 10-minute consult to lock in a timeline and fixed quote.`;

function getSimulatedResponse(message) {
  const text = (message || "").toLowerCase();
  
  if (text.includes("price") || text.includes("pricing") || text.includes("cost") || text.includes("package") || /\brates?\b/.test(text)) {
    return "Our core web packages start around $1,500 for focused landing experiences, up to $3,500–$5,000 for complete custom platforms. What kind of project are you looking to launch?";
  }
  if (text.includes("agent") || text.includes("knight shift") || text.includes("voice") || text.includes("ai")) {
    return "We deploy custom AI digital employees that answer calls, capture leads, and sync with your calendar 24/7 — just like me. Are you looking for phone call handling or web assistant capabilities?";
  }
  if (text.includes("work") || text.includes("portfolio") || text.includes("case") || text.includes("client")) {
    return "Check out our /work page — recent builds include Adelphos Manila for luxury design, JSP Construction, and GR Counseling. Would you like a walk-through on how we approach design systems?";
  }
  if (text.includes("book") || text.includes("call") || text.includes("consult") || text.includes("schedule") || text.includes("meeting")) {
    return "You can grab a 10-minute strategy session directly on our calendar: https://calendar.app.google/MCoM4jfg2dWgypC47 — or call us directly at (661) 477-1610.";
  }
  if (text.includes("@")) {
    return "Got your info — we'll review your details and send over a brief. Want to jump on our calendar for a quick 10-minute strategy call to lock down your specs?";
  }
  return "Great to meet you. We build high-performance web platforms, brand systems, and custom AI agents. What's the main focus of your next project?";
}

export async function POST(req) {
  try {
    const { messages = [] } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    if (!process.env.OPENAI_API_KEY) {
      const simulated = getSimulatedResponse(lastMessage);
      return new Response(JSON.stringify({ content: simulated }), {
        headers: { "content-type": "application/json" },
      });
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: VEGA_SYSTEM_PROMPT },
          ...messages.slice(-8),
        ],
        temperature: 0.6,
        max_tokens: 150,
      }),
    });

    if (!res.ok) {
      const fallback = getSimulatedResponse(lastMessage);
      return new Response(JSON.stringify({ content: fallback }), {
        headers: { "content-type": "application/json" },
      });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || getSimulatedResponse(lastMessage);

    return new Response(JSON.stringify({ content: reply }), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ content: "Thanks for reaching out! You can book a quick consult directly at https://calendar.app.google/MCoM4jfg2dWgypC47." }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
}
