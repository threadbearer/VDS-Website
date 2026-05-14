import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { supabase } from '@/lib/database';

export interface AuditResult {
  score: number;
  visibility: 'good' | 'warning' | 'poor';
  trust: 'good' | 'warning' | 'poor';
  schema: 'good' | 'warning' | 'poor';
  fixes: string[];
  summary: string;
}

export async function POST(req: Request) {
  try {
    const { url, businessName } = await req.json();

    if (!url || !businessName) {
      return new Response(
        JSON.stringify({ error: 'URL and Business Name are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;

    const auditPrompt = `You are an AEO (Answer Engine Optimization) auditor. Research "${businessName}" at ${cleanUrl}.

Evaluate three dimensions:
1. Visibility — Is this brand known to AI models? Consider domain authority, reviews, mentions.
2. Trust — Quality reviews, citations, consistent NAP data, backlinks?
3. Schema — Likely has structured data (JSON-LD, LocalBusiness schema, OpenGraph, FAQ)?

Give each dimension a status label and produce an overall score 0-100.
Provide 3 specific actionable fixes to improve AI citation rate.

Respond ONLY with valid JSON:
{
  "score": <0-100>,
  "visibility": <"good"|"warning"|"poor">,
  "trust": <"good"|"warning"|"poor">,
  "schema": <"good"|"warning"|"poor">,
  "fixes": ["Fix 1","Fix 2","Fix 3"],
  "summary": "<2-sentence explanation>"
}
Status rules: good>=70, warning=40-69, poor<40.`;

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: auditPrompt,
      temperature: 0.4,
    });

    let auditData: AuditResult;
    try {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      auditData = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse LLM JSON:', text);
      return new Response(
        JSON.stringify({ error: 'AI returned unparseable response. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Persist lead to Supabase (non-fatal)
    try {
      await supabase.from('leads').insert([{
        business_name: businessName,
        source: 'aeo-audit',
        session_id: `audit_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      }]);
    } catch (dbErr) {
      console.warn('Supabase lead insert skipped:', dbErr);
    }

    return new Response(JSON.stringify(auditData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Audit API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process audit. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
