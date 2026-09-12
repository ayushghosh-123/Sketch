import { Annotation } from "@langchain/langgraph";
import type { GeneratedComponent, GeneratedDependency, ArchitectureOutput } from "@/types/architecture";
import type { MatchedChunk } from "@/types/database";
import type {
  RagProjectContext,
  ResearchFindings,
  ArchitectureSpecification,
  ValidationResult,
  UserPreferences,
} from "@/agents/types";
import type { CanvasAgentOutput } from "@/agents/canvas/canvasAgent";

export const ProjectStateAnnotation = Annotation.Root({
  projectId: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "",
  }),
  userId: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "",
  }),
  userInput: Annotation<{
    name: string;
    description?: string;
    projectType?: string;
  }>({
    reducer: (_, next) => next,
    default: () => ({ name: "" }),
  }),
  hasDocuments: Annotation<boolean>({
    reducer: (_, next) => next,
    default: () => false,
  }),
  userPreferences: Annotation<UserPreferences>({
    reducer: (_, next) => ({ ..._, ...next }),
    default: () => ({}),
  }),
  projectRequirements: Annotation<{
    target_users?: string | null;
    functional_requirements?: string | null;
    non_functional_requirements?: string | null;
    preferred_technologies?: string | null;
    scalability_requirements?: string | null;
    security_requirements?: string | null;
  }>({
    reducer: (_, next) => ({ ..._, ...next }),
    default: () => ({}),
  }),
  retrievedDocuments: Annotation<MatchedChunk[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  ragContext: Annotation<RagProjectContext | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  researchFindings: Annotation<ResearchFindings | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  architectureSpec: Annotation<ArchitectureSpecification | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  validationResult: Annotation<ValidationResult | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  validationRetryCount: Annotation<number>({
    reducer: (curr, next) => (next !== undefined ? next : curr + 1),
    default: () => 0,
  }),
  canvasOutput: Annotation<CanvasAgentOutput | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  architecturePlan: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "",
  }),
  technologyRecommendations: Annotation<string[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  securityRecommendations: Annotation<string[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  components: Annotation<GeneratedComponent[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  dependencies: Annotation<GeneratedDependency[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  finalArchitecture: Annotation<ArchitectureOutput | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  errors: Annotation<string[]>({
    reducer: (curr, next) => [...curr, ...next],
    default: () => [],
  }),
  analysisStatus: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "initialized",
  }),
});

export type ProjectStateType = typeof ProjectStateAnnotation.State;
