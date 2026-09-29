/* eslint-disable */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('agents')
    .update({
      persona_config: {
        archetypeId: "commander",
        role: "Tech Lead Consultant",
        custom_greeting: ""
      }
    })
    .eq('id', '9b800454-7e9b-4e74-8a0b-d9e00f1f00c4');

  if (error) {
    console.error('Error updating:', error);
  } else {
    console.log('Successfully updated Arthur persona!');
  }
}

run();
