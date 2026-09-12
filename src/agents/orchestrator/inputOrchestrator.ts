import type { UserPreferences } from "../types";

export interface InputOrchestratorInput {
  projectId: string;
  userId: string;
  idea: string;
  projectName?: string;
  uploadedFiles?: Array<{
    fileName: string;
    fileType: string;
    fileSize: number;
    url?: string;
  }>;
  hasDocuments?: boolean;
  userPreferences?: UserPreferences;
  projectRequirements?: Record<string, unknown>;
}

export interface InputOrchestratorOutput {
  projectId: string;
  userId: string;
  sanitizedIdea: string;
  projectName: string;
  hasDocuments: boolean;
  fileCount: number;
  userPreferences: UserPreferences;
  workflowRoute: "RAG_AGENT" | "RESEARCH_AGENT";
  initialContext: string;
}

/**
 * INPUT ORCHESTRATOR
 * 
 * Logic:
 * IF documents exist:
 *   Route to RAG Agent -> then send Idea + RAG context to Research Agent.
 * IF documents do not exist:
 *   Route directly to Research Agent with Idea only.
 */
export async function runInputOrchestrator(
  input: InputOrchestratorInput
): Promise<InputOrchestratorOutput> {
  const sanitizedIdea = input.idea.trim();
  const fileCount = input.uploadedFiles?.length || 0;
  const hasDocuments = Boolean(input.hasDocuments || fileCount > 0);

  const fallbackName = sanitizedIdea.slice(0, 40).replace(/[^a-zA-Z0-9\s]/g, "").trim() || "New Software System";
  const projectName = input.projectName || fallbackName;

  const workflowRoute: "RAG_AGENT" | "RESEARCH_AGENT" = hasDocuments ? "RAG_AGENT" : "RESEARCH_AGENT";

  const initialContext = `Project: ${projectName}\nUser Idea: ${sanitizedIdea}\nUploaded Documents: ${fileCount} files\nRoute: ${workflowRoute}`;

  return {
    projectId: input.projectId,
    userId: input.userId,
    sanitizedIdea,
    projectName,
    hasDocuments,
    fileCount,
    userPreferences: input.userPreferences || {},
    workflowRoute,
    initialContext,
  };
}
