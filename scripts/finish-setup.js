 
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

async function finishSetup() {
  console.log('Completing onboarding for Knight Shift...');
  
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .update({ onboarding_completed: true })
    .eq('slug', 'knight-shift')
    .select()
    .single();

  if (tenantError) {
    console.error('Error updating tenant:', tenantError);
    return;
  }
  
  console.log('✅ Onboarding completed for tenant:', tenant.name);
}

finishSetup();
