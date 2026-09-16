import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeFileName } from "@/lib/security/sanitizer";
import { DocumentParser } from "./documentParser";
import { ChunkingService } from "./chunkingService";
import { EmbeddingService } from "./embeddingService";
import type { DocumentRecord, DocumentChunk } from "@/types/database";

// In-memory store for fallback demo mode
const demoDocuments: DocumentRecord[] = [
  {
    id: "demo-doc-1",
    project_id: "demo-project-e-commerce",
    user_id: "demo-user",
    file_name: "OmniStore-PRD-v2.md",
    file_path: "project-documents/demo-project-e-commerce/OmniStore-PRD-v2.md",
    file_type: "text/markdown",
    file_size: 14200,
    processing_status: "completed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const demoChunks: DocumentChunk[] = [
  {
    id: "chunk-1",
    document_id: "demo-doc-1",
    project_id: "demo-project-e-commerce",
    content: "OmniStore handles checkout, inventory, and payment microservices. Checkout service calls Inventory reservation service via gRPC before delegating transaction authorization to Stripe payment gateway.",
    embedding: null,
    chunk_index: 0,
    metadata: { fileName: "OmniStore-PRD-v2.md" },
    created_at: new Date().toISOString(),
  },
  {
    id: "chunk-2",
    document_id: "demo-doc-1",
    project_id: "demo-project-e-commerce",
    content: "All product catalog items are stored in PostgreSQL and cached in Redis with a 15-minute TTL. Search queries route through an Elasticsearch cluster with embedding-based semantic re-ranking.",
    embedding: null,
    chunk_index: 1,
    metadata: { fileName: "OmniStore-PRD-v2.md" },
    created_at: new Date().toISOString(),
  },
  {
    id: "chunk-3",
    document_id: "demo-doc-1",
    project_id: "demo-project-e-commerce",
    content: "Security constraints: High-severity events and billing credentials require mTLS communication, tokenized credit cards, and strict Row-Level Security on tenant databases.",
    embedding: null,
    chunk_index: 2,
    metadata: { fileName: "OmniStore-PRD-v2.md" },
    created_at: new Date().toISOString(),
  }
];

export class DocumentService {
  private static STORAGE_BUCKET = "project-documents";

  private static isConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return !!url && !url.includes("placeholder") && !url.includes("your-project");
  }

  static async getDocuments(projectId: string): Promise<DocumentRecord[]> {
    if (!this.isConfigured() || projectId.startsWith("demo-")) {
      return demoDocuments.filter((d) => d.project_id === projectId || projectId.startsWith("demo-"));
    }

    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as DocumentRecord[]) || [];
    } catch (err) {
      console.warn("Falling back to demo documents:", err);
      return demoDocuments;
    }
  }

  static async processAndStoreDocument({
    projectId,
    userId,
    fileName,
    fileBuffer,
    fileType,
    fileSize,
  }: {
    projectId: string;
    userId: string;
    fileName: string;
    fileBuffer: Buffer;
    fileType: string;
    fileSize: number;
  }): Promise<DocumentRecord> {
    const cleanFileName = sanitizeFileName(fileName);
    const filePath = `${projectId}/${Date.now()}-${cleanFileName}`;

    if (!this.isConfigured() || projectId.startsWith("demo-")) {
      // Demo processing
      const docId = `doc-${Date.now()}`;
      const docRecord: DocumentRecord = {
        id: docId,
        project_id: projectId,
        user_id: userId,
        file_name: cleanFileName,
        file_path: filePath,
        file_type: fileType,
        file_size: fileSize,
        processing_status: "processing",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      demoDocuments.unshift(docRecord);

      // Extract & chunk
      const text = await DocumentParser.extractText(fileBuffer, fileName, fileType);
      const textChunks = ChunkingService.chunkText(text);

      for (const item of textChunks) {
        demoChunks.push({
          id: `chunk-${Date.now()}-${item.chunkIndex}`,
          document_id: docId,
          project_id: projectId,
          content: item.content,
          embedding: null,
          chunk_index: item.chunkIndex,
          metadata: { fileName, fileSize },
          created_at: new Date().toISOString(),
        });
      }

      docRecord.processing_status = "completed";
      return docRecord;
    }

    const supabase = createAdminClient();

    // 1. Upload to Supabase Storage
    try {
      await supabase.storage
        .from(this.STORAGE_BUCKET)
        .upload(filePath, fileBuffer, {
          contentType: fileType,
          upsert: true,
        });
    } catch (storageErr) {
      console.warn("Storage upload notice (continuing DB ingestion):", storageErr);
    }

    // 2. Insert DB record with status 'processing'
    const { data: doc, error: insertError } = await supabase
      .from("documents")
      .insert({
        project_id: projectId,
        user_id: userId,
        file_name: cleanFileName,
        file_path: filePath,
        file_type: fileType,
        file_size: fileSize,
        processing_status: "processing",
      })
      .select()
      .single();

    if (insertError || !doc) {
      throw new Error(`Failed to create document record: ${insertError?.message}`);
    }

    const documentRecord = doc as DocumentRecord;

    // 3. Process text extraction & chunking
    try {
      const extractedText = await DocumentParser.extractText(fileBuffer, fileName, fileType);
      const chunks = ChunkingService.chunkText(extractedText);

      // 4. Generate embeddings and store in pgvector
      const chunkInserts = [];
      for (const chunk of chunks) {
        const embedding = await EmbeddingService.generateEmbedding(chunk.content);
        chunkInserts.push({
          document_id: documentRecord.id,
          project_id: projectId,
          content: chunk.content,
          embedding: JSON.stringify(embedding),
          chunk_index: chunk.chunkIndex,
          metadata: {
            fileName,
            fileSize,
            charCount: chunk.content.length,
          },
        });
      }

      if (chunkInserts.length > 0) {
        const { error: chunkError } = await supabase
          .from("document_chunks")
          .insert(chunkInserts);

        if (chunkError) {
          throw chunkError;
        }
      }

      // 5. Update document status to completed
      await supabase
        .from("documents")
        .update({ processing_status: "completed", updated_at: new Date().toISOString() })
        .eq("id", documentRecord.id);

      documentRecord.processing_status = "completed";
      return documentRecord;
    } catch (processErr: unknown) {
      console.error("Document processing failed:", processErr);
      await supabase
        .from("documents")
        .update({ processing_status: "failed", updated_at: new Date().toISOString() })
        .eq("id", documentRecord.id);
      documentRecord.processing_status = "failed";
      return documentRecord;
    }
  }

  static async deleteDocument(documentId: string): Promise<boolean> {
    if (!this.isConfigured() || documentId.startsWith("doc-") || documentId.startsWith("demo-")) {
      const idx = demoDocuments.findIndex((d) => d.id === documentId);
      if (idx !== -1) demoDocuments.splice(idx, 1);
      return true;
    }

    const supabase = createAdminClient();
    const { data: doc } = await supabase
      .from("documents")
      .select("file_path")
      .eq("id", documentId)
      .single();

    if (doc?.file_path) {
      try {
        await supabase.storage.from(this.STORAGE_BUCKET).remove([doc.file_path]);
      } catch (e) {
        console.warn("Storage deletion warning:", e);
      }
    }

    const { error } = await supabase.from("documents").delete().eq("id", documentId);
    return !error;
  }
}
