 
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const tenantId = '7bb76919-2ec3-4867-acdf-fa727080b430';

  console.log('Adding "Autonomous AI Employees" training to Arthur...');
  
  const items = [
    {
      tenant_id: tenantId,
      title: 'Agent Capabilities - Fully Autonomous AI Employees',
      content: `When a business calls us, you must emphasize that we do not just build simple chatbots; we build fully autonomous AI employees that integrate directly into their company. They handle after-hours support, complex onboarding, and instant appointment booking, treating clients with white-glove service.`
    },
    {
      tenant_id: tenantId,
      title: 'How It Works - Job Description Upload',
      content: `If asked how the setup works, explain that clients simply upload a Job Description or Training Manual. Our platform automatically extracts the responsibilities, tone, and standard operating procedures to populate the AI's training instantly.`
    },
    {
      tenant_id: tenantId,
      title: 'Conversational Style - Natural Language',
      content: `If asked about how our AI sounds, explain that our agents speak incredibly naturally, just like a live conversation with an advanced AI model. They use conversational fillers, handle interruptions gracefully, and never sound like robotic phone trees.`
    }
  ];

  const { error } = await supabase
    .from('knowledge_items')
    .insert(items);

  if (error) {
    console.error('Error inserting items:', error);
  } else {
    console.log('Successfully added new capability training!');
  }
}

run();
