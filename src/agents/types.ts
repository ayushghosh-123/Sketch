import type { ComponentType } from "@/types/database";

// User Preferences for architecture generation
export interface UserPreferences {
  preferredFrontend?: string;
  preferredBackend?: string;
  preferredDatabase?: string;
  preferredCloud?: string;
  budgetPriority?: "low" | "medium" | "high";
  securityPriority?: "standard" | "high" | "critical";
  scalabilityPriority?: "standard" | "high" | "extreme";
  performancePriority?: "standard" | "low-latency" | "ultra-low-latency";
}

// RAG Agent Output
export interface RagProjectContext {
  productName: string;
  targetUsers: string[];
  coreRequirements: string[];
  existingResearch: string[];
  technicalConstraints: string[];
  identifiedTechnologies: string[];
  summary: string;
}

// Research Agent Output
export interface TechnologyOption {
  name: string;
  category: string;
  recommended: boolean;
  reason: string;
  pros: string[];
  cons: string[];
}

export interface ResearchFindings {
  projectType: string;
  complexityAssessment: "low" | "medium" | "high" | "enterprise";
  frontendOptions: TechnologyOption[];
  backendOptions: TechnologyOption[];
  databaseOptions: TechnologyOption[];
  aiOrchestration: TechnologyOption[];
  storageOptions: TechnologyOption[];
  recommendedStack: {
    frontend: string;
    backend: string;
    database: string;
    ai: string;
    orchestration: string;
    storage: string;
    deployment: string;
  };
  keyArchitecturalPatterns: string[];
  scalabilityApproach: string;
  securityApproach: string;
}

// Decision Agent Output
export interface ArchitectureLayerSpec {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface ArchitectureComponentSpec {
  id: string;
  name: string;
  technology: string;
  category: ComponentType;
  layerId: string;
  description: string;
  responsibilities: string[];
  configuration?: Record<string, unknown>;
}

export interface ArchitectureConnectionSpec {
  id?: string;
  source: string;
  target: string;
  label: string;
  type: "sync" | "async" | "auth" | "data_stream";
  description?: string;
}

export interface ArchitectureDecisionSpec {
  id: string;
  title: string;
  category: string;
  chosen: string;
  why: string;
  whySimple: string;
  alternatives: string[];
  tradeoffs: string;
  status: "accepted" | "proposed" | "deprecated";
}

export interface ArchitectureSpecification {
  projectName: string;
  overview: string;
  overviewSimple: string;
  architecturePattern: string;
  layers: ArchitectureLayerSpec[];
  components: ArchitectureComponentSpec[];
  connections: ArchitectureConnectionSpec[];
  technologyStack: Record<string, { name: string; reason: string; simpleReason: string }>;
  decisions: ArchitectureDecisionSpec[];
  aiRequestsFlow: string[];
  documentFlow: string[];
}

// Validation Step Output
export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  missingComponents: string[];
  invalidCombinations: string[];
  brokenRelationships: string[];
  securityConcerns: string[];
  scalabilityConcerns: string[];
  feedbackForDecisionAgent?: string;
}

// Proposed AI Change for manual or conversational editing
export interface ProposedArchitectureChange {
  command: string;
  summary: string;
  riskLevel: "low" | "medium" | "high";
  add: Array<{
    name: string;
    category: ComponentType;
    technology: string;
    description: string;
    layerId: string;
  }>;
  modify: Array<{
    componentId: string;
    name: string;
    changes: string;
  }>;
  remove: Array<{
    componentId: string;
    name: string;
  }>;
  newConnections: Array<{
    source: string;
    target: string;
    label: string;
  }>;
}
