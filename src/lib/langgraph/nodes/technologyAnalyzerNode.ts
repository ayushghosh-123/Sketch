import type { ProjectStateType } from "../state";

export async function technologyAnalyzerNode(state: ProjectStateType): Promise<Partial<ProjectStateType>> {
  const current = [...(state.technologyRecommendations || [])];
  
  // Ensure we have robust technologies covering all major tiers
  const tierChecks = [
    { name: "PostgreSQL", category: "Database" },
    { name: "Redis", category: "Cache" },
    { name: "Next.js", category: "Frontend" },
    { name: "Node.js / Express", category: "Backend" },
  ];

  for (const t of tierChecks) {
    if (!current.some((c) => c.toLowerCase().includes(t.name.toLowerCase()))) {
      current.push(t.name);
    }
  }

  return {
    technologyRecommendations: current,
    analysisStatus: "tech_analyzed",
  };
}
