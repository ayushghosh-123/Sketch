import { StateGraph, START, END } from "@langchain/langgraph";
import { ProjectStateAnnotation, type ProjectStateType } from "./state";
import { inputValidationNode } from "./nodes/inputValidationNode";
import { projectAnalyzerNode } from "./nodes/projectAnalyzerNode";
import { requirementAnalyzerNode } from "./nodes/requirementAnalyzerNode";
import { ragRetrieverNode } from "./nodes/ragRetrieverNode";
import { architectureDesignerNode } from "./nodes/architectureDesignerNode";
import { technologyAnalyzerNode } from "./nodes/technologyAnalyzerNode";
import { securityAnalyzerNode } from "./nodes/securityAnalyzerNode";
import { dependencyGeneratorNode } from "./nodes/dependencyGeneratorNode";
import { validationNode } from "./nodes/validationNode";
import { saveArchitectureNode } from "./nodes/saveArchitectureNode";

export type StatusListener = (update: {
  nodeName: string;
  status: "running" | "completed" | "failed";
  message?: string;
  timestamp: string;
}) => void;

/**
 * Builds the LangGraph.js execution graph
 */
export function buildArchitectureWorkflow(listener?: StatusListener) {
  // Wrap node with event notification
  const wrapWithTelemetry = (
    nodeName: string,
    nodeFn: (state: ProjectStateType) => Promise<Partial<ProjectStateType>>
  ) => {
    return async (state: ProjectStateType) => {
      if (listener) {
        listener({
          nodeName,
          status: "running",
          message: `Executing ${nodeName}...`,
          timestamp: new Date().toISOString(),
        });
      }

      try {
        const result = await nodeFn(state);

        if (listener) {
          listener({
            nodeName,
            status: "completed",
            message: `Completed ${nodeName}`,
            timestamp: new Date().toISOString(),
          });
        }

        return result;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Node execution failed";
        if (listener) {
          listener({
            nodeName,
            status: "failed",
            message: msg,
            timestamp: new Date().toISOString(),
          });
        }
        throw err;
      }
    };
  };

  const workflow = new StateGraph(ProjectStateAnnotation)
    .addNode("input_validation", wrapWithTelemetry("Input Validation", inputValidationNode))
    .addNode("project_analyzer", wrapWithTelemetry("Project Analyzer", projectAnalyzerNode))
    .addNode("requirement_analyzer", wrapWithTelemetry("Requirement Analyzer", requirementAnalyzerNode))
    .addNode("rag_retriever", wrapWithTelemetry("RAG Retriever", ragRetrieverNode))
    .addNode("architecture_designer", wrapWithTelemetry("Architecture Designer", architectureDesignerNode))
    .addNode("technology_analyzer", wrapWithTelemetry("Technology Analyzer", technologyAnalyzerNode))
    .addNode("security_analyzer", wrapWithTelemetry("Security Analyzer", securityAnalyzerNode))
    .addNode("dependency_generator", wrapWithTelemetry("Dependency Generator", dependencyGeneratorNode))
    .addNode("validation_node", wrapWithTelemetry("Validation Node", validationNode))
    .addNode("save_architecture", wrapWithTelemetry("Save Architecture", saveArchitectureNode))

    // Define edges
    .addEdge(START, "input_validation")
    .addEdge("input_validation", "project_analyzer")
    .addEdge("project_analyzer", "requirement_analyzer")
    .addEdge("requirement_analyzer", "rag_retriever")
    .addEdge("rag_retriever", "architecture_designer")
    .addEdge("architecture_designer", "technology_analyzer")
    .addEdge("technology_analyzer", "security_analyzer")
    .addEdge("security_analyzer", "dependency_generator")
    .addEdge("dependency_generator", "validation_node")
    .addEdge("validation_node", "save_architecture")
    .addEdge("save_architecture", END);

  return workflow.compile();
}

/**
 * Runner function for the architecture workflow
 */
export async function runArchitectureWorkflow(
  initialState: Partial<ProjectStateType>,
  listener?: StatusListener
) {
  const app = buildArchitectureWorkflow(listener);
  const result = await app.invoke(initialState);
  return result;
}
