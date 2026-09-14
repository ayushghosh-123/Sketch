import { StateGraph, START, END } from "@langchain/langgraph";
import { ProjectStateAnnotation, type ProjectStateType } from "./state";
import { runInputOrchestrator } from "@/agents/orchestrator/inputOrchestrator";
import { runRagAgent } from "@/agents/rag/ragAgent";
import { runResearchAgent } from "@/agents/research/researchAgent";
import { runDecisionAgent } from "@/agents/decision/decisionAgent";
import { runValidationStep } from "@/agents/validation/validationStep";
import { runCanvasAgent } from "@/agents/canvas/canvasAgent";
import { ArchitectureService } from "@/services/architectureService";
import { DocumentService } from "@/services/documentService";
import { AgentLogger } from "@/lib/logger/agentLogger";
import type { GeneratedComponent, GeneratedDependency, ArchitectureOutput } from "@/types/architecture";

export type StatusListener = (update: {
  nodeName: string;
  status: "running" | "completed" | "failed";
  message?: string;
  timestamp: string;
  hasDocuments?: boolean;
}) => void;

/**
 * Builds the Sketch LangGraph.js execution graph conforming to:
 * 
 *                 START
 *                   │
 *                   ▼
 *          INPUT ORCHESTRATOR
 *                   │
 *                   ▼
 *          DOCUMENTS EXIST?
 *             /          \
 *           YES          NO
 *            │            │
 *            ▼            │
 *        RAG AGENT        │
 *            │            │
 *            └──────┬─────┘
 *                   ▼
 *            RESEARCH AGENT
 *                   │
 *                   ▼
 *            DECISION AGENT
 *                   │
 *                   ▼
 *              VALIDATION
 *                   │
 *             VALID?
 *              /    \
 *            YES    NO
 *             │      │
 *             ▼      ▼
 *       CANVAS AGENT DECISION AGENT
 *             │
 *             ▼
 *        SAVE PROJECT
 *             │
 *             ▼
 *             END
 */
export function buildArchitectureWorkflow(listener?: StatusListener) {
  const wrapWithTelemetry = (
    nodeName: string,
    nodeFn: (state: ProjectStateType) => Promise<Partial<ProjectStateType>>
  ) => {
    return async (state: ProjectStateType) => {
      const startTime = Date.now();
      
      // Log node start to console with active state inputs
      AgentLogger.nodeStart(nodeName, {
        projectId: state.projectId,
        projectName: state.userInput?.name,
        hasDocuments: state.hasDocuments,
        analysisStatus: state.analysisStatus,
        ragContextAvailable: Boolean(state.ragContext),
        researchAvailable: Boolean(state.researchFindings),
        architectureSpecAvailable: Boolean(state.architectureSpec),
        validationRetryCount: state.validationRetryCount || 0,
      });

      if (listener) {
        listener({
          nodeName,
          status: "running",
          message: `Executing ${nodeName}...`,
          timestamp: new Date().toISOString(),
          hasDocuments: state.hasDocuments,
        });
      }

      try {
        const result = await nodeFn(state);
        const duration = Date.now() - startTime;

        // Log node completion and output state
        AgentLogger.nodeEnd(nodeName, duration, result);

        if (listener) {
          listener({
            nodeName,
            status: "completed",
            message: `Completed ${nodeName}`,
            timestamp: new Date().toISOString(),
            hasDocuments: state.hasDocuments,
          });
        }

        return result;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Node execution failed";
        AgentLogger.agentAction(nodeName, "FAILED", { error: msg });

        if (listener) {
          listener({
            nodeName,
            status: "failed",
            message: msg,
            timestamp: new Date().toISOString(),
            hasDocuments: state.hasDocuments,
          });
        }
        throw err;
      }
    };
  };

  // 1. INPUT ORCHESTRATOR
  const inputOrchestratorNode = async (state: ProjectStateType): Promise<Partial<ProjectStateType>> => {
    let hasDocs = state.hasDocuments;
    if (!hasDocs && state.projectId) {
      try {
        const docs = await DocumentService.getDocuments(state.projectId);
        hasDocs = docs.length > 0;
      } catch {
        // fallback
      }
    }

    const orch = await runInputOrchestrator({
      projectId: state.projectId,
      userId: state.userId,
      idea: state.userInput.description || state.userInput.name,
      projectName: state.userInput.name,
      hasDocuments: hasDocs,
      userPreferences: state.userPreferences,
      projectRequirements: state.projectRequirements,
    });

    return {
      hasDocuments: orch.hasDocuments,
      analysisStatus: `Orchestrated workflow: ${orch.workflowRoute}`,
    };
  };

  // 2. RAG AGENT (runs only if documents exist)
  const ragAgentNode = async (state: ProjectStateType): Promise<Partial<ProjectStateType>> => {
    const ragContext = await runRagAgent({
      projectId: state.projectId,
      idea: state.userInput.description || state.userInput.name,
      projectName: state.userInput.name,
    });

    return {
      ragContext,
      analysisStatus: "Extracted project context from uploaded research",
    };
  };

  // 3. RESEARCH AGENT (always runs)
  const researchAgentNode = async (state: ProjectStateType): Promise<Partial<ProjectStateType>> => {
    const findings = await runResearchAgent({
      idea: state.userInput.description || state.userInput.name,
      projectName: state.userInput.name,
      ragContext: state.ragContext,
      userPreferences: state.userPreferences,
    });

    return {
      researchFindings: findings,
      technologyRecommendations: Object.values(findings.recommendedStack),
      analysisStatus: "Synthesized architectural research and technology comparisons",
    };
  };

  // 4. DECISION AGENT (decides architecture specification)
  const decisionAgentNode = async (state: ProjectStateType): Promise<Partial<ProjectStateType>> => {
    if (!state.researchFindings) {
      throw new Error("Cannot execute Decision Agent without research findings.");
    }

    const spec = await runDecisionAgent({
      idea: state.userInput.description || state.userInput.name,
      projectName: state.userInput.name,
      ragContext: state.ragContext,
      researchFindings: state.researchFindings,
      userPreferences: state.userPreferences,
      validationFeedback: state.validationResult,
    });

    return {
      architectureSpec: spec,
      architecturePlan: spec.overview,
      analysisStatus: "Formulated architecture layers, components, and connections",
    };
  };

  // 5. VALIDATION STEP
  const validationStepNode = async (state: ProjectStateType): Promise<Partial<ProjectStateType>> => {
    if (!state.architectureSpec) {
      throw new Error("No architecture specification found to validate.");
    }

    const validation = runValidationStep(state.architectureSpec);

    return {
      validationResult: validation,
      validationRetryCount: (state.validationRetryCount || 0) + 1,
      analysisStatus: validation.isValid
        ? "Architecture validation passed (Score: 100/100)"
        : `Validation required adjustments: ${validation.missingComponents.join(", ")}`,
    };
  };

  // 6. CANVAS AGENT (turns plan into visual React Flow layout)
  const canvasAgentNode = async (state: ProjectStateType): Promise<Partial<ProjectStateType>> => {
    if (!state.architectureSpec) {
      throw new Error("Canvas Agent requires an Architecture Specification.");
    }

    const canvasOutput = runCanvasAgent(state.architectureSpec);

    // Map to GeneratedComponent and GeneratedDependency
    const components: GeneratedComponent[] = state.architectureSpec.components.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.category,
      description: c.description,
      technology: c.technology,
      responsibilities: c.responsibilities || [],
    }));

    const dependencies: GeneratedDependency[] = state.architectureSpec.connections.map((d) => ({
      source: d.source,
      target: d.target,
      type: d.type,
      description: d.label,
    }));

    const finalArchitecture: ArchitectureOutput = {
      projectSummary: state.architectureSpec.projectName,
      architectureOverview: state.architectureSpec.overview,
      components,
      dependencies,
      technologyStack: Object.values(state.architectureSpec.technologyStack).map((t) => t.name),
      securityRecommendations: [
        "Enforce Row-Level Security (RLS) on all database tables",
        "Sign and verify JWT tokens at the API gateway layer",
        "Use encrypted environment variables and secret stores",
      ],
      scalabilityRecommendations: [
        "Distribute high-frequency read endpoints behind Redis cache",
        "Implement horizontal autoscaling on API service instances",
      ],
    };

    return {
      canvasOutput,
      components,
      dependencies,
      finalArchitecture,
      analysisStatus: "Generated visual React Flow topology with Dagre hierarchical layout",
    };
  };

  // 7. SAVE PROJECT NODE
  const saveProjectNode = async (state: ProjectStateType): Promise<Partial<ProjectStateType>> => {
    if (state.finalArchitecture && state.projectId) {
      try {
        await ArchitectureService.saveGeneratedArchitecture(
          state.projectId,
          state.finalArchitecture
        );
      } catch (err) {
        console.warn("Save architecture notice:", err);
      }
    }

    return {
      analysisStatus: "Architecture saved and versioned successfully",
    };
  };

  const workflow = new StateGraph(ProjectStateAnnotation)
    .addNode("input_orchestrator", wrapWithTelemetry("Input Orchestrator", inputOrchestratorNode))
    .addNode("rag_agent", wrapWithTelemetry("RAG Agent", ragAgentNode))
    .addNode("research_agent", wrapWithTelemetry("Research Agent", researchAgentNode))
    .addNode("decision_agent", wrapWithTelemetry("Decision Agent", decisionAgentNode))
    .addNode("validation_step", wrapWithTelemetry("Validation Step", validationStepNode))
    .addNode("canvas_agent", wrapWithTelemetry("Canvas Agent", canvasAgentNode))
    .addNode("save_project", wrapWithTelemetry("Save Project", saveProjectNode))

    // Edges
    .addEdge(START, "input_orchestrator")
    
    // Conditional edge based on document presence
    .addConditionalEdges(
      "input_orchestrator",
      (state) => {
        const route = state.hasDocuments ? "rag_agent" : "research_agent";
        AgentLogger.routing(
          "Input Orchestrator",
          route,
          state.hasDocuments
            ? "Documents found in project corpus -> Extracting RAG context first"
            : "No documents uploaded -> Proceeding directly to first-principles research"
        );
        return route;
      }
    )
    .addEdge("rag_agent", "research_agent")
    .addEdge("research_agent", "decision_agent")
    .addEdge("decision_agent", "validation_step")

    // Conditional edge: If valid or max retries reached -> canvas_agent; else loop back to decision_agent
    .addConditionalEdges(
      "validation_step",
      (state) => {
        const isValid = state.validationResult?.isValid ?? true;
        const retries = state.validationRetryCount ?? 0;
        if (isValid || retries >= 2) {
          const next = "canvas_agent";
          AgentLogger.routing(
            "Validation Step",
            next,
            isValid
              ? `Validation score: ${state.validationResult?.score ?? 100}/100 (PASSED) -> Generating canvas layout`
              : `Max retries reached (${retries}) -> Proceeding to canvas generation with current specification`
          );
          return next;
        }
        const next = "decision_agent";
        AgentLogger.routing(
          "Validation Step",
          next,
          `Validation failed (Score: ${state.validationResult?.score}/100) -> Looping back to Decision Agent with feedback`,
          {
            missingComponents: state.validationResult?.missingComponents,
            brokenRelationships: state.validationResult?.brokenRelationships,
          }
        );
        return next;
      }
    )
    .addEdge("canvas_agent", "save_project")
    .addEdge("save_project", END);

  return workflow.compile();
}

/**
 * Runner function for the architecture workflow
 */
export async function runArchitectureWorkflow(
  initialState: Partial<ProjectStateType>,
  listener?: StatusListener
) {
  AgentLogger.banner("LangGraph Multi-Agent Workflow Launching", {
    projectId: initialState.projectId,
    projectName: initialState.userInput?.name,
    hasDocuments: initialState.hasDocuments,
  });

  const app = buildArchitectureWorkflow(listener);
  const result = await app.invoke(initialState);

  AgentLogger.banner("LangGraph Multi-Agent Workflow Finished", {
    projectId: initialState.projectId,
    totalComponents: result.components?.length || 0,
    totalDependencies: result.dependencies?.length || 0,
    finalStatus: result.analysisStatus,
  });

  return result;
}
