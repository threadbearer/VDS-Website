 
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const agentPhone = process.argv[2];
  const callerPhone = process.argv[3] || '+15555555555';
  const backendUrl = process.argv[4] || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const orchestratorSecret = process.env.ORCHESTRATOR_SECRET;

  if (!agentPhone) {
    console.error('Usage: npx tsx scripts/test-orchestrator-config.ts <agentPhone> [callerPhone]');
    process.exit(1);
  }

  if (!orchestratorSecret) {
    console.error('Error: ORCHESTRATOR_SECRET must be set in .env.local');
    process.exit(1);
  }

  console.log(`[Debug] Fetching Orchestrator Config from ${backendUrl}/api/orchestrator/config`);
  console.log(`[Debug] Agent Phone: ${agentPhone}`);
  console.log(`[Debug] Caller Phone: ${callerPhone}`);

  try {
    const res = await fetch(`${backendUrl}/api/orchestrator/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${orchestratorSecret}`
      },
      body: JSON.stringify({ phoneNumber: agentPhone, callerPhone }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[Error] HTTP ${res.status}: ${err}`);
      process.exit(1);
    }

    const data = await res.json();
    console.log(`\n=== RECEIVED SYSTEM PROMPT ===\n`);
    console.log(data.systemPrompt);
    console.log(`\n==============================\n`);
    
    console.log(`[Metadata] Agent ID: ${data.agentId}`);
    console.log(`[Metadata] Tenant ID: ${data.tenantId}`);
    console.log(`[Metadata] Persona ID: ${data.personaId}`);
    console.log(`[Metadata] Greeting: ${data.greeting}`);
    console.log(`[Metadata] Tools Count: ${data.tools?.length || 0}`);
    
    if (!data.systemPrompt.includes('Company Knowledge Base')) {
      console.warn(`[WARNING] System prompt does NOT contain "Company Knowledge Base". RAG injection may have failed!`);
    } else {
      console.log(`[SUCCESS] System prompt successfully includes Company Knowledge Base.`);
    }

  } catch (err) {
    console.error('[Error] Failed to fetch config:', err);
  }
}

main();
