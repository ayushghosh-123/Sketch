import type { ProjectStateType } from "../state";

export async function requirementAnalyzerNode(state: ProjectStateType): Promise<Partial<ProjectStateType>> {
  const reqs = state.projectRequirements;
  const techStack: string[] = [];

  if (reqs?.preferred_technologies) {
    const split = reqs.preferred_technologies
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    techStack.push(...split);
  }

  // Default baseline technologies if none specified
  if (techStack.length === 0) {
    techStack.push("Next.js / React", "Node.js / TypeScript", "PostgreSQL", "Redis", "Docker & Kubernetes");
  }

  return {
    technologyRecommendations: techStack,
    analysisStatus: "requirements_analyzed",
  };
}
