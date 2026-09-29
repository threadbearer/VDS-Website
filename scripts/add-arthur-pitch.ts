 
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const tenantId = '7bb76919-2ec3-4867-acdf-fa727080b430';

  console.log('Adding "Agent Directive - Pitching AI Employees" to Arthur...');
  
  const content = `Once you have listened to the caller's business needs and discovered what their business does, you MUST pitch them by suggesting that Knight Shift can build them a custom AI-powered employee that can perfectly handle those exact needs. Give them a specific, tailored example of what an AI employee could do for their specific business.`;

  const { error } = await supabase
    .from('knowledge_items')
    .insert({
      tenant_id: tenantId,
      title: 'Agent Directive - Pitching AI Employees',
      content: content
    });

  if (error) {
    console.error('Error inserting item:', error);
  } else {
    console.log('Successfully added new capability training!');
  }
}

run();
