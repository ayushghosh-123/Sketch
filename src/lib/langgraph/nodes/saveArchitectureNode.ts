import type { ProjectStateType } from "../state";
import { ArchitectureService } from "@/services/architectureService";

export async function saveArchitectureNode(state: ProjectStateType): Promise<Partial<ProjectStateType>> {
  if (!state.finalArchitecture || !state.projectId) {
    return {
      analysisStatus: "save_skipped",
    };
  }

  try {
    await ArchitectureService.saveGeneratedArchitecture(state.projectId, state.finalArchitecture);
    return {
      analysisStatus: "completed",
    };
  } catch (err: unknown) {
    console.error("Save architecture node error:", err);
    return {
      errors: [err instanceof Error ? err.message : "Failed to save architecture"],
      analysisStatus: "save_failed",
    };
  }
}
