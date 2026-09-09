-- AGENTARCHITECT Database Schema
-- Supabase PostgreSQL + pgvector

-- 1. Enable Vector Extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger to create profile upon auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT DEFAULT 'web_application',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Project Requirements Table
CREATE TABLE IF NOT EXISTS project_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
  target_users TEXT,
  functional_requirements TEXT,
  non_functional_requirements TEXT,
  preferred_technologies TEXT,
  scalability_requirements TEXT,
  security_requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  processing_status TEXT NOT NULL DEFAULT 'uploaded' CHECK (processing_status IN ('uploaded', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Document Chunks Table (with Gemini 768-dim embeddings)
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(768),
  chunk_index INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Architectures Table
CREATE TABLE IF NOT EXISTS architectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Main Architecture',
  description TEXT,
  architecture_type TEXT DEFAULT 'cloud_native',
  graph_data JSONB DEFAULT '{"nodes": [], "edges": []}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Architecture Components Table
CREATE TABLE IF NOT EXISTS architecture_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  architecture_id UUID NOT NULL REFERENCES architectures(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  component_type TEXT NOT NULL CHECK (component_type IN (
    'frontend', 'backend', 'database', 'cache', 'queue',
    'api', 'authentication', 'storage', 'ai', 'agent',
    'external_service', 'devops'
  )),
  description TEXT,
  technology TEXT,
  configuration JSONB DEFAULT '{}'::jsonb,
  position_x DOUBLE PRECISION DEFAULT 0 NOT NULL,
  position_y DOUBLE PRECISION DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Component Dependencies Table (Directed Graph Edges)
CREATE TABLE IF NOT EXISTS component_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  source_component_id UUID NOT NULL REFERENCES architecture_components(id) ON DELETE CASCADE,
  target_component_id UUID NOT NULL REFERENCES architecture_components(id) ON DELETE CASCADE,
  dependency_type TEXT DEFAULT 'sync',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT unique_dependency UNIQUE(source_component_id, target_component_id)
);

-- 10. Architecture Decisions Table (ADRs)
CREATE TABLE IF NOT EXISTS architecture_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  decision TEXT NOT NULL,
  reasoning TEXT,
  alternatives JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'proposed',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. Project Versions Table
CREATE TABLE IF NOT EXISTS project_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  description TEXT,
  architecture_snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. Analysis Runs Table
CREATE TABLE IF NOT EXISTS analysis_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  input JSONB DEFAULT '{}'::jsonb,
  output JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMPTZ
);

-- 13. Impact Analysis Table
CREATE TABLE IF NOT EXISTS impact_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  changed_component_id UUID REFERENCES architecture_components(id) ON DELETE SET NULL,
  affected_components JSONB DEFAULT '[]'::jsonb NOT NULL,
  analysis_result JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 14. Chat Conversations Table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Architecture Discussion',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 15. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indices for High Performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_project_requirements_project_id ON project_requirements(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_project_id ON document_chunks(project_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_architectures_project_id ON architectures(project_id);
CREATE INDEX IF NOT EXISTS idx_components_architecture_id ON architecture_components(architecture_id);
CREATE INDEX IF NOT EXISTS idx_components_project_id ON architecture_components(project_id);
CREATE INDEX IF NOT EXISTS idx_dependencies_project_id ON component_dependencies(project_id);
CREATE INDEX IF NOT EXISTS idx_dependencies_source ON component_dependencies(source_component_id);
CREATE INDEX IF NOT EXISTS idx_dependencies_target ON component_dependencies(target_component_id);
CREATE INDEX IF NOT EXISTS idx_adrs_project_id ON architecture_decisions(project_id);
CREATE INDEX IF NOT EXISTS idx_versions_project_id ON project_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_analysis_runs_project_id ON analysis_runs(project_id);
CREATE INDEX IF NOT EXISTS idx_impact_analysis_project_id ON impact_analysis(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_project_id ON chat_conversations(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);

-- Vector Index (HNSW for Cosine Distance on embeddings)
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding 
ON document_chunks 
USING hnsw (embedding vector_cosine_ops);

-- RAG Vector Search RPC Function
CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding VECTOR(768),
  match_project_id UUID,
  match_threshold FLOAT DEFAULT 0.2,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  project_id UUID,
  content TEXT,
  chunk_index INT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.project_id,
    dc.content,
    dc.chunk_index,
    dc.metadata,
    (1 - (dc.embedding <=> query_embedding))::FLOAT AS similarity
  FROM document_chunks dc
  WHERE dc.project_id = match_project_id
    AND dc.embedding IS NOT NULL
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE architectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE architecture_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE architecture_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: user can see/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: user can manage own projects
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Project Requirements: accessible if user owns the project
CREATE POLICY "Users manage project requirements" ON project_requirements FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = project_requirements.project_id AND projects.user_id = auth.uid())
);

-- Documents: accessible if user owns the project
CREATE POLICY "Users manage documents" ON documents FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = documents.project_id AND projects.user_id = auth.uid())
);

-- Document Chunks: accessible if user owns the project
CREATE POLICY "Users manage document chunks" ON document_chunks FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = document_chunks.project_id AND projects.user_id = auth.uid())
);

-- Architectures: accessible if user owns the project
CREATE POLICY "Users manage architectures" ON architectures FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = architectures.project_id AND projects.user_id = auth.uid())
);

-- Architecture Components: accessible if user owns the project
CREATE POLICY "Users manage components" ON architecture_components FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = architecture_components.project_id AND projects.user_id = auth.uid())
);

-- Component Dependencies: accessible if user owns the project
CREATE POLICY "Users manage dependencies" ON component_dependencies FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = component_dependencies.project_id AND projects.user_id = auth.uid())
);

-- Architecture Decisions: accessible if user owns the project
CREATE POLICY "Users manage decisions" ON architecture_decisions FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = architecture_decisions.project_id AND projects.user_id = auth.uid())
);

-- Project Versions: accessible if user owns the project
CREATE POLICY "Users manage versions" ON project_versions FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = project_versions.project_id AND projects.user_id = auth.uid())
);

-- Analysis Runs: accessible if user owns the project
CREATE POLICY "Users manage analysis runs" ON analysis_runs FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = analysis_runs.project_id AND projects.user_id = auth.uid())
);

-- Impact Analysis: accessible if user owns the project
CREATE POLICY "Users manage impact analysis" ON impact_analysis FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = impact_analysis.project_id AND projects.user_id = auth.uid())
);

-- Chat Conversations: accessible if user owns the project
CREATE POLICY "Users manage chat conversations" ON chat_conversations FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = chat_conversations.project_id AND projects.user_id = auth.uid())
);

-- Chat Messages: accessible if user owns the conversation's project
CREATE POLICY "Users manage chat messages" ON chat_messages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM chat_conversations cc
    JOIN projects p ON p.id = cc.project_id
    WHERE cc.id = chat_messages.conversation_id AND p.user_id = auth.uid()
  )
);

-- Storage bucket setup statement (To run in Supabase SQL editor or storage api)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('project-documents', 'project-documents', false) ON CONFLICT (id) DO NOTHING;
