/* eslint-disable */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data: tenants, error: tErr } = await supabase.from('tenants').select('id, name, slug');
  console.log('Tenants:', tenants);

  const { data: convs, error: cErr } = await supabase.from('conversations').select('id, tenant_id, title');
  console.log(`Found ${convs?.length || 0} conversations`);
  if (convs?.length) {
    const tenantIds = [...new Set(convs.map(c => c.tenant_id))];
    console.log('Unique tenant IDs in conversations:', tenantIds);
  }

  const { data: agents, error: aErr } = await supabase.from('agents').select('id, tenant_id, name');
  console.log(`Found ${agents?.length || 0} agents`);
  if (agents?.length) {
    const agentTenantIds = [...new Set(agents.map(a => a.tenant_id))];
    console.log('Unique tenant IDs in agents:', agentTenantIds);
  }
}

checkData();
