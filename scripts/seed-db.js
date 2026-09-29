 
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load .env.local
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Create Tenant (Knight Shift)
  const { data: tenant, error: tError } = await supabase
    .from('tenants')
    .insert({
      name: 'Knight Shift Agents',
      slug: 'knight-shift',
      industry: 'Software / AI',
      owner_name: 'Jacob',
      subscription_tier: 'enterprise',
      settings: {
        phone: '+16614492210',
      }
    })
    .select()
    .single();

  if (tError) {
    console.error('Error creating tenant:', tError);
    return;
  }
  console.log('✅ Created Tenant:', tenant.name);

  // 2. Create Agent
  const { data: agent, error: aError } = await supabase
    .from('agents')
    .insert({
      tenant_id: tenant.id,
      name: 'Knight Shift Demo Agent',
      type: 'cra',
      status: 'active',
      channels: ['voice', 'sms'],
      config: {
        phone_number: '+16614492210'
      }
    })
    .select()
    .single();

  if (aError) {
    console.error('Error creating agent:', aError);
    return;
  }
  console.log('✅ Created Agent:', agent.name);

  // 3. Create Knowledge Base Items
  const knowledgeItems = [
    {
      tenant_id: tenant.id,
      category: 'faq',
      title: 'Pricing',
      content: 'We have three plans: Starter ($497/mo) for 500 minutes, Growth ($997/mo) for 1,500 minutes, and Scale ($1,997/mo) for 5,000 minutes. We also do custom Enterprise plans.'
    },
    {
      tenant_id: tenant.id,
      category: 'service',
      title: 'What we do',
      content: 'We provide AI phone agents for local businesses. The agents work 24/7, answering calls, responding to texts, qualifying leads, and booking appointments.'
    },
    {
      tenant_id: tenant.id,
      category: 'script',
      title: 'Greeting',
      content: 'Thanks for calling Knight Shift Agents. I am the AI assistant. How can I help you transform your business today?'
    }
  ];

  const { error: kError } = await supabase
    .from('knowledge_items')
    .insert(knowledgeItems);

  if (kError) {
    console.error('Error creating knowledge items:', kError);
    return;
  }
  console.log('✅ Created Knowledge Base Items');

  console.log('🎉 Seeding complete! Check your dashboard.');
}

seed();
