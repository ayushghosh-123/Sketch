import type { ProjectStateType } from "../state";
import { GeminiService } from "@/lib/gemini/model";

export async function projectAnalyzerNode(state: ProjectStateType): Promise<Partial<ProjectStateType>> {
  const prompt = `
Analyze the following software project idea:
Project Name: ${state.userInput.name}
Description: ${state.userInput.description || "N/A"}
Type: ${state.userInput.projectType || "General System"}

Extract key architectural domains, major capabilities, and system boundaries. Return a 2-3 sentence strategic overview.
`;

  const fallbackSummary = `${state.userInput.name} is a ${state.userInput.projectType || "cloud-native"} system architected for modularity, resilience, and high scalability across its core services.`;

  const analysis = await GeminiService.generateContent(
    prompt,
    "You are a Principal Software Architect analyzing system scope."
  );

  return {
    architecturePlan: analysis && analysis.trim().length > 0 ? analysis : fallbackSummary,
    analysisStatus: "project_analyzed",
  };
}
