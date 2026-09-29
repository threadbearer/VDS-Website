 
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedConversations() {
  console.log('Seeding past conversations...');

  // Get tenant
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', 'knight-shift')
    .single();

  if (!tenant) {
    console.error('Tenant not found');
    return;
  }

  // Get agent
  const { data: agents } = await supabase
    .from('agents')
    .select('id')
    .eq('tenant_id', tenant.id)
    .limit(1);
    
  const agent = agents?.[0];

  if (!agent) {
    console.error('Agent not found');
    return;
  }

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const mockConversations = [
    {
      tenant_id: tenant.id,
      agent_id: agent.id,
      channel: 'voice',
      contact_name: 'Alice Johnson',
      contact_phone: '+15551234567',
      started_at: twoDaysAgo,
      ended_at: new Date(new Date(twoDaysAgo).getTime() + 120000).toISOString(),
      status: 'completed',
      outcome: 'booked_appointment',
      sentiment: 'positive',
      lead_score: 85,
      analysis: { summary: 'Customer was interested in the pricing and booked an appointment.' }
    },
    {
      tenant_id: tenant.id,
      agent_id: agent.id,
      channel: 'sms',
      contact_name: 'Bob Smith',
      contact_phone: '+15559876543',
      started_at: yesterday,
      ended_at: new Date(new Date(yesterday).getTime() + 300000).toISOString(),
      status: 'completed',
      outcome: 'needs_follow_up',
      sentiment: 'neutral',
      lead_score: 40,
      analysis: { summary: 'Asked about business hours, mentioned they will call later.' }
    }
  ];

  const { data: insertedConvs, error: convErr } = await supabase
    .from('conversations')
    .insert(mockConversations)
    .select();

  if (convErr) {
    console.error('Error inserting conversations:', convErr);
    return;
  }

  console.log(`Inserted ${insertedConvs.length} conversations.`);

  // Insert mock messages
  const mockMessages = [];
  
  if (insertedConvs[0]) {
    mockMessages.push({
      conversation_id: insertedConvs[0].id,
      role: 'agent',
      content: 'Hello, Knight Shift Agents, how can I help you?',
      channel: 'voice'
    });
    mockMessages.push({
      conversation_id: insertedConvs[0].id,
      role: 'customer',
      content: 'I want to know about your services.',
      channel: 'voice'
    });
  }

  if (insertedConvs[1]) {
    mockMessages.push({
      conversation_id: insertedConvs[1].id,
      role: 'customer',
      content: 'Are you open on weekends?',
      channel: 'sms'
    });
    mockMessages.push({
      conversation_id: insertedConvs[1].id,
      role: 'agent',
      content: 'We are open 24/7! How can I assist you?',
      channel: 'sms'
    });
  }

  const { error: msgErr } = await supabase
    .from('messages')
    .insert(mockMessages);

  if (msgErr) {
    console.error('Error inserting messages:', msgErr);
    return;
  }

  console.log(`Inserted ${mockMessages.length} messages.`);
  console.log('✅ Migration of past conversations completed successfully!');
}

seedConversations();
