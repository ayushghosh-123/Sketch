import type { ProjectStateType } from "../state";

export async function inputValidationNode(state: ProjectStateType): Promise<Partial<ProjectStateType>> {
  const errors: string[] = [];

  if (!state.userInput?.name || state.userInput.name.trim().length === 0) {
    errors.push("Project name is missing or empty.");
  }

  if (errors.length > 0) {
    return {
      errors,
      analysisStatus: "validation_failed",
    };
  }

  return {
    analysisStatus: "input_validated",
  };
}
