export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ComponentType =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'cache'
  | 'queue'
  | 'api'
  | 'authentication'
  | 'storage'
  | 'ai'
  | 'agent'
  | 'external_service'
  | 'devops';

export type ProcessingStatus = 'uploaded' | 'processing' | 'completed' | 'failed';

export type ChatRole = 'user' | 'assistant' | 'system';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  project_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectRequirements {
  id: string;
  project_id: string;
  target_users: string | null;
  functional_requirements: string | null;
  non_functional_requirements: string | null;
  preferred_technologies: string | null;
  scalability_requirements: string | null;
  security_requirements: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentRecord {
  id: string;
  project_id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  processing_status: ProcessingStatus;
  created_at: string;
  updated_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  project_id: string;
  content: string;
  embedding: number[] | null;
  chunk_index: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ArchitectureGraphData {
  nodes: Array<{
    id: string;
    type?: string;
    position: { x: number; y: number };
    data: {
      label: string;
      componentType: ComponentType;
      technology?: string;
      description?: string;
      responsibilities?: string[];
      status?: 'active' | 'changed' | 'affected_direct' | 'affected_indirect';
    };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    label?: string;
    type?: string;
    animated?: boolean;
    style?: Record<string, unknown>;
  }>;
}

export interface ArchitectureRecord {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  architecture_type: string;
  graph_data: ArchitectureGraphData;
  created_at: string;
  updated_at: string;
}

export interface ArchitectureComponent {
  id: string;
  architecture_id: string;
  project_id: string;
  name: string;
  component_type: ComponentType;
  description: string | null;
  technology: string | null;
  configuration: Record<string, unknown>;
  position_x: number;
  position_y: number;
  created_at: string;
  updated_at: string;
}

export interface ComponentDependency {
  id: string;
  project_id: string;
  source_component_id: string;
  target_component_id: string;
  dependency_type: string;
  description: string | null;
  created_at: string;
}

export interface ArchitectureDecision {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  decision: string;
  reasoning: string | null;
  alternatives: string[] | Json;
  status: string;
  created_at: string;
}

export interface ProjectVersion {
  id: string;
  project_id: string;
  version_number: number;
  description: string | null;
  architecture_snapshot: {
    architecture: Partial<ArchitectureRecord>;
    components: ArchitectureComponent[];
    dependencies: ComponentDependency[];
    decisions?: ArchitectureDecision[];
    timestamp: string;
  };
  created_at: string;
}

export interface AnalysisRun {
  id: string;
  project_id: string;
  user_id: string;
  analysis_type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  started_at: string;
  completed_at: string | null;
}

export interface ImpactAnalysisRecord {
  id: string;
  project_id: string;
  changed_component_id: string | null;
  affected_components: {
    direct: string[];
    indirect: string[];
  };
  analysis_result: {
    summary: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    affectedComponents: Array<{
      id: string;
      name: string;
      type: 'direct' | 'indirect';
      impactDescription: string;
    }>;
    recommendations: string[];
  };
  created_at: string;
}

export interface ChatConversation {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface ChatMessageRecord {
  id: string;
  conversation_id: string;
  role: ChatRole;
  content: string;
  created_at: string;
}

export interface MatchedChunk {
  id: string;
  document_id: string;
  project_id: string;
  content: string;
  chunk_index: number;
  metadata: Record<string, unknown>;
  similarity: number;
}
