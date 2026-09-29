 
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const tenantId = '7bb76919-2ec3-4867-acdf-fa727080b430';

  console.log('Adding "Fully Automated Reps" to Arthur...');
  
  const content = `We don't just build answering machines; we build fully automated AI reps that can do absolutely anything a regular human employee can do. Our agents can execute complex multi-step workflows, manage your CRM, conduct outbound calling campaigns, and serve as complete operational managers. We push the boundaries of AI to replace entire departments.`;

  const { error } = await supabase
    .from('knowledge_items')
    .insert({
      tenant_id: tenantId,
      title: 'Agent Capabilities - Fully Automated Reps',
      content: content
    });

  if (error) {
    console.error('Error inserting item:', error);
  } else {
    console.log('Successfully added new capability training!');
  }
}

run();
