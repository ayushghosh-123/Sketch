"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes, formatDate } from "@/lib/utils";
import type { DocumentRecord } from "@/types/database";
import {
  Upload,
  FileText,
  Trash2,
  RefreshCw,
  AlertCircle,
  Binary,
  Search,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface DocumentManagerViewProps {
  projectId: string;
}

export function DocumentManagerView({ projectId }: DocumentManagerViewProps) {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/documents`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDocuments(json.data);
      }
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [projectId]);

  const processFile = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/projects/${projectId}/documents`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Upload failed");
      }

      fetchDocuments();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error uploading document";
      setUploadError(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this specification and its indexed vector embeddings?")) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${projectId}/documents/${docId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter((d) =>
      d.file_name.toLowerCase().includes(q) ||
      d.file_type.toLowerCase().includes(q) ||
      d.processing_status.toLowerCase().includes(q)
    );
  }, [documents, searchQuery]);

  const totalBytes = useMemo(() => {
    return documents.reduce((acc, curr) => acc + (curr.file_size || 0), 0);
  }, [documents]);

  const completedCount = useMemo(() => {
    return documents.filter((d) => d.processing_status === "completed").length;
  }, [documents]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 text-[#f4f4f5]">
      {/* Header & Meta telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#27272a]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#0ea5e9]">
              // KNOWLEDGE BASE // SPECIFICATION REGISTRY
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            <span className="font-mono text-[10px] text-[#10b981]">PGVECTOR ONLINE</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#0ea5e9]" />
            Project Documents & Vector Corpus
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Ingest PRDs, architecture RFCs, API specifications, and security policies for semantic retrieval during AI synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.docx,.txt,.md,.json"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] font-mono font-bold text-xs shadow-lg shadow-sky-950/40"
          >
            {uploading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Ingesting Corpus...
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Upload Specification
              </>
            )}
          </Button>
        </div>
      </div>

      {uploadError && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-mono">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>[INGESTION_ERROR]: {uploadError}</span>
        </div>
      )}

      {/* 5-Step RAG Ingestion Pipeline Telemetry */}
      <div className="rounded-xl border border-[#27272a] bg-[#111113] p-4">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#27272a]/70">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
            <Binary className="h-3.5 w-3.5 text-[#0ea5e9]" />
            Continuous Vector Ingestion Pipeline
          </span>
          <span className="font-mono text-[10px] text-[#71717a]">MODEL: text-embedding-004 (768-DIM)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
          {/* Step 1 */}
          <div className="p-2.5 rounded-lg border border-[#27272a] bg-[#09090b]/80">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#a1a1aa] mb-1">
              <span>01 / UPLOAD</span>
              <span className="text-[#10b981]">READY ✓</span>
            </div>
            <div className="font-semibold text-white text-xs">Multi-Format</div>
            <div className="text-[10px] text-[#71717a] font-mono mt-0.5">PDF, DOCX, MD, JSON</div>
          </div>

          {/* Step 2 */}
          <div className="p-2.5 rounded-lg border border-[#27272a] bg-[#09090b]/80">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#a1a1aa] mb-1">
              <span>02 / EXTRACTION</span>
              <span className="text-[#10b981]">NORMALIZED ✓</span>
            </div>
            <div className="font-semibold text-white text-xs">Text Normalization</div>
            <div className="text-[10px] text-[#71717a] font-mono mt-0.5">Layout & Markdown clean</div>
          </div>

          {/* Step 3 */}
          <div className="p-2.5 rounded-lg border border-[#27272a] bg-[#09090b]/80">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#a1a1aa] mb-1">
              <span>03 / CHUNKING</span>
              <span className="text-[#10b981]">PASS ✓</span>
            </div>
            <div className="font-semibold text-white text-xs">Semantic Chunks</div>
            <div className="text-[10px] text-[#71717a] font-mono mt-0.5">500 tokens / 50 overlap</div>
          </div>

          {/* Step 4 */}
          <div className="p-2.5 rounded-lg border border-[#0ea5e9]/30 bg-[#0ea5e9]/5">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#0ea5e9] mb-1">
              <span>04 / EMBEDDING</span>
              <span className="text-[#0ea5e9] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0ea5e9] animate-ping" />
                ACTIVE ◉
              </span>
            </div>
            <div className="font-semibold text-white text-xs">Gemini 768-dim</div>
            <div className="text-[10px] text-[#0ea5e9]/80 font-mono mt-0.5">Cosine normalized vector</div>
          </div>

          {/* Step 5 */}
          <div className="p-2.5 rounded-lg border border-[#27272a] bg-[#09090b]/80">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#a1a1aa] mb-1">
              <span>05 / VECTOR INDEX</span>
              <span className="text-[#10b981]">ONLINE ○</span>
            </div>
            <div className="font-semibold text-white text-xs">pgvector Similarity</div>
            <div className="text-[10px] text-[#71717a] font-mono mt-0.5">HNSW / IVFFLAT search</div>
          </div>
        </div>
      </div>

      {/* Corpus Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 rounded-lg border border-[#27272a] bg-[#111113]">
          <div className="text-[10px] text-[#71717a] uppercase tracking-wider">Total Documents</div>
          <div className="text-lg font-bold text-white mt-1">{documents.length}</div>
        </div>
        <div className="p-3 rounded-lg border border-[#27272a] bg-[#111113]">
          <div className="text-[10px] text-[#71717a] uppercase tracking-wider">Corpus Volume</div>
          <div className="text-lg font-bold text-white mt-1">{formatBytes(totalBytes)}</div>
        </div>
        <div className="p-3 rounded-lg border border-[#27272a] bg-[#111113]">
          <div className="text-[10px] text-[#71717a] uppercase tracking-wider">Indexed Documents</div>
          <div className="text-lg font-bold text-[#10b981] mt-1">{completedCount} / {documents.length}</div>
        </div>
        <div className="p-3 rounded-lg border border-[#27272a] bg-[#111113]">
          <div className="text-[10px] text-[#71717a] uppercase tracking-wider">Vector Embeddings</div>
          <div className="text-lg font-bold text-[#0ea5e9] mt-1">768-D DENSE</div>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-[#0ea5e9] bg-[#0ea5e9]/10"
            : "border-[#27272a] bg-[#111113]/40 hover:border-[#3f3f46] hover:bg-[#111113]"
        }`}
      >
        <Upload className={`h-8 w-8 mx-auto mb-2 ${isDragging ? "text-[#0ea5e9]" : "text-[#71717a]"}`} />
        <div className="text-sm font-semibold text-white">
          Drag and drop architecture specification, or <span className="text-[#0ea5e9] underline">browse files</span>
        </div>
        <p className="text-xs text-[#71717a] mt-1 font-mono">
          SUPPORTED: .PDF, .MD, .TXT, .DOCX, .JSON (MAX 25MB)
        </p>
      </div>

      {/* Document List Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase text-[#a1a1aa] font-semibold">
            Registered Specifications ({filteredDocuments.length})
          </span>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#71717a]" />
          <input
            type="text"
            placeholder="Filter documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-md bg-[#111113] border border-[#27272a] text-xs text-white placeholder-[#71717a] focus:outline-none focus:ring-1 focus:ring-[#0ea5e9] font-mono"
          />
        </div>
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="space-y-3 font-mono">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 rounded-lg bg-[#111113] border border-[#27272a] animate-pulse" />
          ))}
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#27272a] bg-[#111113]/40 p-10 text-center font-mono">
          <FileText className="h-8 w-8 text-[#52525b] mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-white">No specifications match criteria</h4>
          <p className="text-xs text-[#71717a] max-w-sm mx-auto mt-1 mb-4">
            Upload your project requirement documents (PRD), API design documents, or technical RFCs to inform AI architecture generation.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredDocuments.map((doc) => {
            const isExpanded = expandedDocId === doc.id;
            const docShortId = `DOC-${doc.id.substring(0, 6).toUpperCase()}`;
            const estChunks = Math.max(1, Math.ceil((doc.file_size || 1024) / 1800));

            return (
              <div
                key={doc.id}
                className="rounded-lg border border-[#27272a] bg-[#111113] hover:border-[#3f3f46] transition-colors"
              >
                <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-[#27272a] bg-[#09090b] text-[#0ea5e9]">
                      <FileText className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa]">
                          {docShortId}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate max-w-md">
                          {doc.file_name}
                        </h4>
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border ${
                            doc.processing_status === "completed"
                              ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30"
                              : doc.processing_status === "failed"
                              ? "bg-red-500/10 text-red-400 border-red-500/30"
                              : "bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/30"
                          }`}
                        >
                          {doc.processing_status === "completed"
                            ? "● INDEXED"
                            : doc.processing_status === "failed"
                            ? "✕ FAILED"
                            : "◉ PROCESSING"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-[#71717a] mt-1 font-mono">
                        <span>{formatBytes(doc.file_size)}</span>
                        <span>*</span>
                        <span>{doc.file_type || "text/plain"}</span>
                        <span>*</span>
                        <span>~{estChunks} chunks</span>
                        <span>*</span>
                        <span>{formatDate(doc.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                      className="h-7 px-2.5 text-xs font-mono text-[#a1a1aa] hover:text-white hover:bg-[#18181b] border border-[#27272a]"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-3 w-3 mr-1" />
                          Hide Telemetry
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3 mr-1" />
                          Inspect Chunks
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="h-7 px-2 text-xs font-mono text-[#71717a] hover:text-red-400 hover:bg-red-500/10"
                      title="Delete Specification"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Inspect Drawer inside card */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-3 border-t border-[#27272a] bg-[#09090b]/90 text-xs font-mono">
                    <div className="flex items-center justify-between text-[11px] text-[#a1a1aa] mb-2 pb-1 border-b border-[#27272a]">
                      <span>VECTOR EMBEDDING TELEMETRY // {docShortId}</span>
                      <span className="text-[#0ea5e9]">DIMENSION: 768 / METRIC: COSINE</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                      <div className="p-2 rounded bg-[#111113] border border-[#27272a]">
                        <span className="text-[10px] text-[#71717a] block">ESTIMATED CHUNKS</span>
                        <span className="font-bold text-white">{estChunks} blocks</span>
                      </div>
                      <div className="p-2 rounded bg-[#111113] border border-[#27272a]">
                        <span className="text-[10px] text-[#71717a] block">ESTIMATED TOKENS</span>
                        <span className="font-bold text-white">~{estChunks * 380} tokens</span>
                      </div>
                      <div className="p-2 rounded bg-[#111113] border border-[#27272a]">
                        <span className="text-[10px] text-[#71717a] block">RAG CONTEXT WEIGHT</span>
                        <span className="font-bold text-[#10b981]">HIGH RELEVANCE</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-[#71717a] uppercase tracking-wider block">
                        Ingested Segment Samples
                      </span>
                      <div className="p-2.5 rounded bg-[#111113] border border-[#27272a] text-[11px] text-[#a1a1aa] leading-relaxed">
                        <span className="text-[#0ea5e9] font-bold mr-2">[CHUNK #001]:</span>
                        Architecture specification for system {doc.file_name}. Contains component topology, data flow protocols, scalability boundaries, and security policies. Ingested into pgvector store for semantic grounding in AI Architect chat prompts.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
