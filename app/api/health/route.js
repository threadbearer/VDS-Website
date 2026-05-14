export const runtime = "edge";
export async function GET() {
  const ok = !!process.env.OPENAI_API_KEY;
  return new Response(JSON.stringify({ ok }), { headers: { "content-type": "application/json" } });
}
