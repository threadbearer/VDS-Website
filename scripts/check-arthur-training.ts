 
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('knowledge_items')
    .select('id, title, content')
    .eq('tenant_id', '7bb76919-2ec3-4867-acdf-fa727080b430');

  if (error) {
    console.error('Error fetching training:', error);
    return;
  }

  console.log(`Found ${data.length} training items for Arthur:`);
  data.forEach((item, i) => {
    console.log(`\n[${i+1}] ${item.title}`);
    console.log(`Content: ${item.content}`);
  });
}

run();
