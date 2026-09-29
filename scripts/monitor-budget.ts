 
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function monitor() {
  const campaignId = '745456d6-6b18-4bb5-ae37-a5a5567f5718';

  const { data: campaign, error } = await supabase
    .from('ad_campaigns')
    .select('spend_cents, name, status')
    .eq('id', campaignId)
    .single();

  if (error) {
    console.error('Failed to fetch campaign:', error);
    process.exit(1);
  }

  // NOTE: For a real Meta/Google Ads sync, you would call syncCampaignMetrics() here first.
  // We'll simulate fetching the latest spend by just looking at the DB which would be updated by cron.
  // The spend_cents should be updated by the ad manager syncing logic.
  
  if (campaign.spend_cents > 500) {
    console.log(`ALERT: Campaign "${campaign.name}" has surpassed $5.00 in spend today (Current: $${(campaign.spend_cents / 100).toFixed(2)}).`);
    // Output specific string to trigger LLM notification
    console.log('__THRESHOLD_EXCEEDED__');
  } else {
    console.log(`Campaign "${campaign.name}" spend is under $5.00. Current: $${(campaign.spend_cents / 100).toFixed(2)}`);
  }
}

monitor().catch(console.error);
