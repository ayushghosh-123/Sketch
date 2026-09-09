import { getGeminiClient, isGeminiConfigured } from "@/lib/gemini/client";

export class EmbeddingService {
  private static EMBEDDING_MODEL = "text-embedding-004";
  public static VECTOR_DIMENSION = 768;

  /**
   * Generates a 768-dimensional vector embedding for the input text using Gemini
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    if (!text || text.trim().length === 0) {
      return new Array(this.VECTOR_DIMENSION).fill(0);
    }

    if (!isGeminiConfigured()) {
      return this.generateSyntheticEmbedding(text);
    }

    try {
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ model: this.EMBEDDING_MODEL });
      const result = await model.embedContent(text);
      const values = result.embedding?.values;

      if (values && values.length === this.VECTOR_DIMENSION) {
        return values;
      }

      // If dimensions differ or values missing, normalize to 768
      if (values && values.length > 0) {
        return this.resizeVector(values, this.VECTOR_DIMENSION);
      }

      return this.generateSyntheticEmbedding(text);
    } catch (err) {
      console.warn("Gemini embedding API call failed, falling back to synthetic vector:", err);
      return this.generateSyntheticEmbedding(text);
    }
  }

  /**
   * Batch generates embeddings for multiple chunks
   */
  static async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    for (const text of texts) {
      const emb = await this.generateEmbedding(text);
      embeddings.push(emb);
    }
    return embeddings;
  }

  /**
   * Resizes an embedding vector to target length
   */
  private static resizeVector(values: number[], targetDim: number): number[] {
    if (values.length === targetDim) return values;
    const result = new Array(targetDim).fill(0);
    for (let i = 0; i < targetDim; i++) {
      result[i] = values[i % values.length] || 0;
    }
    // Normalize
    const norm = Math.sqrt(result.reduce((sum, v) => sum + v * v, 0)) || 1;
    return result.map((v) => v / norm);
  }

  /**
   * Deterministic pseudo-embedding for testing/fallback when offline
   */
  private static generateSyntheticEmbedding(text: string): number[] {
    const vector = new Array(this.VECTOR_DIMENSION).fill(0);
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    for (let i = 0; i < this.VECTOR_DIMENSION; i++) {
      const pseudoVal = Math.sin(hash + i) * Math.cos(hash * 0.5 + i);
      vector[i] = pseudoVal;
    }

    // Unit normalize vector
    const norm = Math.sqrt(vector.reduce((acc, val) => acc + val * val, 0)) || 1;
    return vector.map((val) => val / norm);
  }
}
