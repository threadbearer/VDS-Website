import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { supabase } from './database';

export async function findRelevantKnowledge(query: string, clientId?: string): Promise<string> {
  try {
    // 1. Generate an embedding for the user's query
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: query,
    });

    // 2. Query Supabase via our custom RPC function
    const { data, error } = await supabase.rpc('match_knowledge_base', {
      query_embedding: embedding,
      match_threshold: 0.75, // Adjust based on strictness required
      match_count: 3,
      p_client_id: clientId || null,
    });

    if (error) {
      console.error('Error fetching knowledge from vector db:', error);
      return '';
    }

    if (!data || data.length === 0) {
      return '';
    }

    // 3. Combine retrieved context
    return data.map((doc: any) => doc.content).join('\n\n');
  } catch (err) {
    console.error('Failed to execute RAG retrieval:', err);
    return '';
  }
}
