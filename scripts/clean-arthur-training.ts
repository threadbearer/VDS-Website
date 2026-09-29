 
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const tenantId = '7bb76919-2ec3-4867-acdf-fa727080b430';

  console.log('1. Deleting redundant items...');
  const { error: deleteErr } = await supabase
    .from('knowledge_items')
    .delete()
    .in('title', ['Greeting', 'Agent Core Persona: Arthur', 'Pricing', 'What we do'])
    .eq('tenant_id', tenantId);

  if (deleteErr) {
    console.error('Delete error:', deleteErr);
    return;
  }
  console.log('Deleted successfully.');

  console.log('2. Updating "Our Packages and Pricing"...');
  const packagesContent = `We offer three main packages:
- Starter ($497/mo): 1 phone/SMS agent, 500 call minutes.
- Growth ($997/mo): 1 Voice Agent + 1 Marketing Agent, 1,500 minutes. (This is our most popular package).
- Scale ($1,997/mo): Custom integrations and 5,000 call minutes. Custom Enterprise plans are also available.`;

  const { error: update1Err } = await supabase
    .from('knowledge_items')
    .update({ content: packagesContent })
    .eq('title', 'Our Packages and Pricing')
    .eq('tenant_id', tenantId);

  if (update1Err) {
    console.error('Update 1 error:', update1Err);
  } else {
    console.log('Updated Packages successfully.');
  }

  console.log('3. Updating "Agent Inbound Call Handling"...');
  const handlingContent = `[IF ASKED IF ROBOT]
"Guilty as charged! I'm the AI rep for Knight Shift. What can I help you with?"

[IF TOO EXPENSIVE]
"I hear you. 62% of local business calls go unanswered though. Just one saved lead a month usually pays for the agent. Want to start with the $497 plan?"

[CLOSING]
Summarize takeaways, confirm next steps, and end warmly.`;

  const { error: update2Err } = await supabase
    .from('knowledge_items')
    .update({ content: handlingContent })
    .eq('title', 'Agent Inbound Call Handling')
    .eq('tenant_id', tenantId);

  if (update2Err) {
    console.error('Update 2 error:', update2Err);
  } else {
    console.log('Updated Handling successfully.');
  }

  console.log('Cleanup complete!');
}

run();
