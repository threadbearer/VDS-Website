'use server';

import { createClient } from '@/lib/supabase-server';
import { supabase as serviceRoleDb } from '@/lib/database';

/**
 * Validates the admin credentials via Supabase Auth and sets a secure httpOnly cookie if correct.
 */
export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

/**
 * Clears the admin auth cookie by signing out of Supabase.
 */
export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

/**
 * Checks if the user is authenticated via Supabase session.
 */
export async function isUserAuthenticated(): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return !error && data?.user != null;
}

export interface ConversationWithLead {
  id: string;
  lead_id: string;
  source: 'web' | 'sms';
  status: 'active' | 'completed';
  is_paused: boolean;
  updated_at: string;
  leads: {
    id: string;
    phone_number: string | null;
    session_id: string | null;
    name: string | null;
    business_name: string | null;
    created_at: string;
  };
  last_message?: {
    content: string;
    role: string;
    created_at: string;
  };
}

/**
 * Fetches all conversations with their associated lead information.
 */
export async function getConversations(): Promise<ConversationWithLead[]> {
  const authenticated = await isUserAuthenticated();
  if (!authenticated) {
    throw new Error('Unauthorized');
  }

  try {
    // Fetch conversations joined with leads
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id,
        lead_id,
        source,
        status,
        is_paused,
        updated_at,
        leads (
          id,
          phone_number,
          session_id,
          name,
          business_name,
          created_at
        )
      `)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    const conversations = data as any[];

    // For each conversation, fetch the most recent message to show as a preview
    const conversationsWithPreviews = await Promise.all(
      conversations.map(async (conv) => {
        const { data: msgData, error: msgError } = await supabase
          .from('messages')
          .select('content, role, created_at')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          ...conv,
          last_message: msgError || !msgData ? undefined : msgData,
        };
      })
    );

    return conversationsWithPreviews;
  } catch (err) {
    console.error('Failed to fetch conversations:', err);
    return [];
  }
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at: string;
}

/**
 * Fetches all messages for a given conversation, ordered chronologically.
 */
export async function getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
  const authenticated = await isUserAuthenticated();
  if (!authenticated) {
    throw new Error('Unauthorized');
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as ChatMessage[];
  } catch (err) {
    console.error('Failed to fetch conversation messages:', err);
    return [];
  }
}

/**
 * Updates the 'is_paused' status of an active conversation to mute the AI assistant.
 */
export async function toggleAIAssistant(conversationId: string, isPaused: boolean): Promise<boolean> {
  const authenticated = await isUserAuthenticated();
  if (!authenticated) {
    throw new Error('Unauthorized');
  }

  try {
    const { error } = await supabase
      .from('conversations')
      .update({ is_paused: isPaused })
      .eq('id', conversationId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to toggle AI Assistant:', err);
    return false;
  }
}
