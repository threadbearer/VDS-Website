-- ==========================================
-- VDS Multi-Tenant Infrastructure Upgrade
-- Execute this script in your Supabase SQL Editor
-- ==========================================

-- 1. Create the Clients Table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    api_key TEXT UNIQUE,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Knowledge Base Table (with pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Upgrade Existing Tables to be Multi-Tenant
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;

ALTER TABLE public.conversations
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;

-- Note: In a live production database with existing data, you would want to create a 
-- "default" client first and backfill the `client_id` before enforcing NOT NULL constraints.

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- 5. Define Basic RLS Policies
-- For now, we assume the Admin Dashboard uses the Service Role key (which bypasses RLS) 
-- or a specific Admin user. If clients log in via Supabase Auth, they can only view their own data.

-- Clients
CREATE POLICY "Clients can view their own data" 
ON public.clients FOR SELECT 
USING (auth.uid() = id);

-- Leads
CREATE POLICY "Clients can view their own leads" 
ON public.leads FOR SELECT 
USING (client_id = auth.uid());

-- Conversations
CREATE POLICY "Clients can view their own conversations" 
ON public.conversations FOR SELECT 
USING (client_id = auth.uid());

-- Messages
CREATE POLICY "Clients can view messages for their conversations" 
ON public.messages FOR SELECT 
USING (
    conversation_id IN (
        SELECT id FROM public.conversations WHERE client_id = auth.uid()
    )
);

-- Knowledge Base
CREATE POLICY "Clients can view and edit their own knowledge base" 
ON public.knowledge_base FOR ALL 
USING (client_id = auth.uid());
