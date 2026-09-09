import type { ProjectStateType } from "../state";
import { ArchitectureOutputSchema, type ArchitectureOutput } from "@/types/architecture";

export async function validationNode(state: ProjectStateType): Promise<Partial<ProjectStateType>> {
  const candidate: ArchitectureOutput = {
    projectSummary: state.architecturePlan || `${state.userInput.name} system overview`,
    architectureOverview: `Multi-tier ${state.userInput.projectType || "cloud"} architecture with ${state.components.length} components and ${state.dependencies.length} directed inter-service dependencies.`,
    components: state.components,
    dependencies: state.dependencies,
    technologyStack: state.technologyRecommendations || [],
    securityRecommendations: state.securityRecommendations || [],
    scalabilityRecommendations: [
      "Horizontal auto-scaling on stateless API and backend services",
      "Read-replica database pool with connection multiplexing",
      "Redis caching layer for high-read endpoints",
      "Asynchronous message queuing for non-blocking I/O operations",
    ],
  };

  const validation = ArchitectureOutputSchema.safeParse(candidate);

  if (!validation.success) {
    console.error("Architecture validation failed:", validation.error);
    return {
      errors: validation.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
      analysisStatus: "validation_failed",
    };
  }

  return {
    finalArchitecture: validation.data,
    analysisStatus: "architecture_validated",
  };
}
