-- ==========================================
-- VDS Vector Search Function
-- Execute this script in your Supabase SQL Editor
-- ==========================================

-- Function to match knowledge base documents based on vector similarity
CREATE OR REPLACE FUNCTION public.match_knowledge_base (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_client_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  content text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    kb.id,
    kb.content,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_base kb
  WHERE 1 - (kb.embedding <=> query_embedding) > match_threshold
    AND (p_client_id IS NULL OR kb.client_id = p_client_id)
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
$$;
