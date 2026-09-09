import type { ProjectStateType } from "../state";
import { RagService } from "@/services/ragService";

export async function ragRetrieverNode(state: ProjectStateType): Promise<Partial<ProjectStateType>> {
  if (!state.projectId) {
    return { retrievedDocuments: [], analysisStatus: "rag_skipped" };
  }

  const query = `${state.userInput.name} ${state.userInput.description || ""} ${state.projectRequirements?.functional_requirements || ""}`;
  
  try {
    const docs = await RagService.retrieveRelevantContext({
      projectId: state.projectId,
      query,
      topK: 4,
    });

    return {
      retrievedDocuments: docs,
      analysisStatus: "rag_retrieved",
    };
  } catch (err) {
    console.warn("RAG retrieval failed in LangGraph node:", err);
    return {
      retrievedDocuments: [],
      analysisStatus: "rag_failed",
    };
  }
}
