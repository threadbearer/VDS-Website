import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn(
    'Supabase environment variables are missing. Database persistence for chat messages will fail.'
  );
}

// Initialize Supabase client with service role key for server-side admin capabilities
export const supabase = createClient(
  supabaseUrl || '',
  supabaseServiceRoleKey || ''
);

export interface SaveMessageParams {
  phone?: string;
  sessionId?: string;
  content: string;
  role: string;
  source: 'web' | 'sms';
}

/**
 * Saves a chat message to Supabase.
 * Performs a lookup/upsert for the lead, maintains an active conversation,
 * and appends the new message to the database.
 */
export async function saveMessage({
  phone,
  sessionId,
  content,
  role,
  source,
}: SaveMessageParams) {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Database persistence skipped: Missing Supabase credentials.');
    return null;
  }

  try {
    let leadId = null;

    // 1. Find or create lead
    if (source === 'sms' && phone) {
      // Lookup by phone number
      const { data: lead, error } = await supabase
        .from('leads')
        .select('id')
        .eq('phone_number', phone)
        .maybeSingle();

      if (error) throw error;

      if (lead) {
        leadId = lead.id;
      } else {
        const { data: newLead, error: insertError } = await supabase
          .from('leads')
          .insert([{ phone_number: phone }])
          .select('id')
          .single();
        
        if (insertError) throw insertError;
        leadId = newLead.id;
      }
    } else if (source === 'web' && sessionId) {
      // Lookup by web session ID
      const { data: lead, error } = await supabase
        .from('leads')
        .select('id')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error) throw error;

      if (lead) {
        leadId = lead.id;
      } else {
        const { data: newLead, error: insertError } = await supabase
          .from('leads')
          .insert([{ session_id: sessionId }])
          .select('id')
          .single();
        
        if (insertError) throw insertError;
        leadId = newLead.id;
      }
    } else {
      throw new Error('Cannot save message: No valid identifier (phone or sessionId) provided.');
    }

    // 2. Find or create active conversation for this lead & source
    let conversationId = null;
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('lead_id', leadId)
      .eq('source', source)
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (convError) throw convError;

    if (conv) {
      conversationId = conv.id;
      // Optional: update updated_at explicitly if trigger isn't functioning
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    } else {
      const { data: newConv, error: createConvError } = await supabase
        .from('conversations')
        .insert([{ lead_id: leadId, source, status: 'active' }])
        .select('id')
        .single();

      if (createConvError) throw createConvError;
      conversationId = newConv.id;
    }

    // 3. Insert the message
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          role,
          content,
        },
      ])
      .select()
      .single();

    if (msgError) throw msgError;

    return { leadId, conversationId, message };
  } catch (error) {
    console.error('Error in saveMessage helper:', error);
    return null;
  }
}
