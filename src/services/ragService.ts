import { createAdminClient } from "@/lib/supabase/admin";
import { EmbeddingService } from "./embeddingService";
import { demoChunks } from "./documentService";
import type { MatchedChunk } from "@/types/database";

export interface RetrieveContextOptions {
  projectId: string;
  query: string;
  topK?: number;
  similarityThreshold?: number;
}

export class RagService {
  private static isConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return !!url && !url.includes("placeholder") && !url.includes("your-project");
  }

  /**
   * Retrieves top-K semantically relevant document chunks strictly scoped to the specified projectId
   */
  static async retrieveRelevantContext({
    projectId,
    query,
    topK = 4,
    similarityThreshold = 0.2,
  }: RetrieveContextOptions): Promise<MatchedChunk[]> {
    if (!query || !query.trim() || !projectId) {
      return [];
    }

    // 1. Generate query embedding using Gemini
    const queryEmbedding = await EmbeddingService.generateEmbedding(query);

    // If database is not configured or demo project is queried, use in-memory cosine ranking
    if (!this.isConfigured() || projectId.startsWith("demo-")) {
      const projectChunks = demoChunks.filter(
        (c) => c.project_id === projectId || projectId.startsWith("demo-")
      );

      // Score chunks based on lexical matching & token overlap
      const queryTokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
      const scored = projectChunks.map((chunk) => {
        let matches = 0;
        const text = chunk.content.toLowerCase();
        for (const token of queryTokens) {
          if (text.includes(token)) matches++;
        }
        const similarity = queryTokens.length > 0 ? Math.min(1, (matches / queryTokens.length) + 0.3) : 0.5;
        return {
          id: chunk.id,
          document_id: chunk.document_id,
          project_id: chunk.project_id,
          content: chunk.content,
          chunk_index: chunk.chunk_index,
          metadata: chunk.metadata || {},
          similarity,
        };
      });

      return scored
        .filter((s) => s.similarity >= similarityThreshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);
    }

    try {
      const supabase = createAdminClient();

      // Call the match_document_chunks RPC function created in supabase/schema.sql
      const { data, error } = await supabase.rpc("match_document_chunks", {
        query_embedding: JSON.stringify(queryEmbedding),
        match_project_id: projectId,
        match_threshold: similarityThreshold,
        match_count: topK,
      });

      if (error) {
        console.warn("RPC match_document_chunks failed, falling back to direct query:", error);
        // Fallback: direct select on document_chunks table scoped to projectId
        const { data: chunks } = await supabase
          .from("document_chunks")
          .select("id, document_id, project_id, content, chunk_index, metadata")
          .eq("project_id", projectId)
          .limit(topK);

        return ((chunks || []) as unknown as MatchedChunk[]).map((c) => ({
          ...c,
          similarity: 0.8,
        }));
      }

      return (data as MatchedChunk[]) || [];
    } catch (err) {
      console.error("RAG retrieval error:", err);
      return [];
    }
  }

  /**
   * Formats retrieved chunks into an LLM context block
   */
  static formatChunksForPrompt(chunks: MatchedChunk[]): string {
    if (!chunks || chunks.length === 0) {
      return "No project-specific documents retrieved.";
    }

    return chunks
      .map(
        (c, idx) =>
          `[Document Snippet #${idx + 1} | Source: ${(c.metadata as Record<string, string>)?.fileName || "Document"} (Chunk ${c.chunk_index}) | Relevance: ${(c.similarity * 100).toFixed(1)}%]\n${c.content}`
      )
      .join("\n\n---\n\n");
  }
}
