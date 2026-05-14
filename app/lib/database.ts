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

export interface CreateLeadParams {
  sessionId: string;
  businessName: string;
  phoneNumber: string;
  industry: string;
}

/**
 * Creates or updates a lead record with detailed information from the sandbox modal.
 */
export async function createLead({
  sessionId,
  businessName,
  phoneNumber,
  industry,
}: CreateLeadParams) {
  if (!supabaseUrl || !supabaseServiceRoleKey || supabaseUrl.includes('your_project_id')) {
    console.warn('Database lead creation skipped: Missing valid Supabase credentials.');
    return { id: 'mock_lead_id', success: true };
  }

  try {
    // 1. Check for existing lead by session
    const { data: existingLead, error: lookupError } = await supabase
      .from('leads')
      .select('id')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (lookupError) throw lookupError;

    if (existingLead) {
      // Update existing record
      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update({
          business_name: businessName,
          phone_number: phoneNumber,
          industry: industry,
          source: 'sandbox-modal',
        })
        .eq('id', existingLead.id)
        .select()
        .single();

      if (updateError) {
        console.warn('Retrying lead update without potential missing columns:', updateError.message);
        // Fallback in case 'industry' column doesn't exist in schema
        const { data: fallbackLead, error: fallbackError } = await supabase
          .from('leads')
          .update({
            business_name: `${businessName} (${industry})`,
            phone_number: phoneNumber,
          })
          .eq('id', existingLead.id)
          .select()
          .single();
        
        if (fallbackError) throw fallbackError;
        return fallbackLead;
      }
      return updatedLead;
    } else {
      // Insert new record
      const { data: newLead, error: insertError } = await supabase
        .from('leads')
        .insert([
          {
            session_id: sessionId,
            business_name: businessName,
            phone_number: phoneNumber,
            industry: industry,
            source: 'sandbox-modal',
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.warn('Retrying lead insert without potential missing columns:', insertError.message);
        // Fallback in case 'industry' column doesn't exist in schema
        const { data: fallbackLead, error: fallbackError } = await supabase
          .from('leads')
          .insert([
            {
              session_id: sessionId,
              business_name: `${businessName} (${industry})`,
              phone_number: phoneNumber,
            },
          ])
          .select()
          .single();

        if (fallbackError) throw fallbackError;
        return fallbackLead;
      }
      return newLead;
    }
  } catch (error) {
    console.error('Error in createLead helper:', error);
    throw error;
  }
}

