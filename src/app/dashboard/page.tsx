"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/database";
import type { UserPreferences } from "@/agents/types";
import {
  ArrowRight,
  Sparkles,
  Paperclip,
  X,
  FileText,
  Sliders,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Layers,
  Clock,
  Trash2,
  Maximize2,
  UploadCloud,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

interface UploadedItem {
  id: string;
  name: string;
  type: string;
  size: number;
  status: "ready" | "reading";
  isImage: boolean;
  previewUrl?: string;
  file: File;
}

export default function DashboardPage() {
  const router = useRouter();

  // Core Idea Input
  const [idea, setIdea] = useState("");
  const [projectName, setProjectName] = useState("");

  // Multimodal Attachments (Images & Documents)
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activePreviewImage, setActivePreviewImage] = useState<string | null>(null);

  // Advanced Preferences (collapsed by default)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredFrontend: "",
    preferredBackend: "",
    preferredDatabase: "",
    preferredCloud: "",
    budgetPriority: "medium",
    securityPriority: "standard",
    scalabilityPriority: "standard",
    performancePriority: "standard",
  });

  // Recent Sketches
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // AI Generation Modal State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      uploadedItems.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [uploadedItems]);

  // Fetch recent projects
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Process incoming files (images + documents)
  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newItems: UploadedItem[] = fileArray.map((f) => {
      const isImg = f.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg)$/i.test(f.name);
      return {
        id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: f.name,
        type: f.type || (f.name.split(".").pop() || "file"),
        size: f.size,
        status: "ready",
        isImage: isImg,
        previewUrl: isImg ? URL.createObjectURL(f) : undefined,
        file: f,
      };
    });

    setUploadedItems((prev) => [...prev, ...newItems]);
  }, []);

  // File picker changes
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  };

  // Remove attachment
  const handleRemoveItem = (id: string, previewUrl?: string) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setUploadedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Clipboard Paste listener (paste screenshots or copied images like ChatGPT)
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            const timestampName = `screenshot-${new Date().toISOString().replace(/[:.]/g, "-")}.${file.type.split("/")[1] || "png"}`;
            const renamedFile = new File([file], timestampName, { type: file.type });
            pastedFiles.push(renamedFile);
          }
        }
      }

      if (pastedFiles.length > 0) {
        processFiles(pastedFiles);
      }
    },
    [processFiles]
  );

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Human-readable task progression
  const hasImages = uploadedItems.some((i) => i.isImage);
  const hasDocs = uploadedItems.some((i) => !i.isImage);

  const currentTasks = [
    "Understanding your concept & requirements",
    ...(hasImages ? ["Analyzing visual diagrams with multimodal vision", "Extracting system topology & component relationships"] : []),
    ...(hasDocs ? ["Indexing reference documents & technical specs", "Extracting domain constraints via RAG"] : []),
    "Evaluating architecture patterns & scale trade-offs",
    "Selecting technologies & framework dependencies",
    "Designing interactive system topology canvas",
  ];

  // Launch "Sketch it →"
  const handleSketchIt = async () => {
    if (!idea.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationStep(0);
    setGenerationError(null);

    try {
      // 1. Create project record
      const pName =
        projectName.trim() ||
        idea.slice(0, 35).replace(/[^a-zA-Z0-9\s]/g, "").trim() ||
        "New System Sketch";

      const createRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pName,
          description: idea.trim(),
          project_type: "cloud_native",
          target_users: "Platform users & engineers",
          preferred_technologies: [
            preferences.preferredFrontend,
            preferences.preferredBackend,
            preferences.preferredDatabase,
          ]
            .filter(Boolean)
            .join(", "),
        }),
      });

      const createData = await createRes.json();
      if (!createData.success || !createData.data) {
        throw new Error(createData.error || "Failed to create project");
      }

      const createdProject = createData.data;

      // 2. Upload any selected images or documents to the project ingestion endpoint
      if (uploadedItems.length > 0) {
        setGenerationStep(1);
        for (const item of uploadedItems) {
          if (item.file) {
            const formData = new FormData();
            formData.append("file", item.file);
            try {
              await fetch(`/api/projects/${createdProject.id}/documents`, {
                method: "POST",
                body: formData,
              });
            } catch (uploadErr) {
              console.warn("Attachment upload notice:", uploadErr);
            }
          }
        }
      }

      // 3. Connect to generation stream
      const genRes = await fetch(`/api/projects/${createdProject.id}/architecture/generate`, {
        method: "POST",
      });

      if (!genRes.body) {
        throw new Error("Generation stream unavailable");
      }

      const reader = genRes.body.getReader();
      const decoder = new TextDecoder();
      let streamBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        streamBuffer += decoder.decode(value, { stream: true });
        const lines = streamBuffer.split("\n\n");
        streamBuffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const raw = line.replace("data: ", "").trim();
            if (!raw) continue;

            try {
              const event = JSON.parse(raw);

              if (event.type === "node_status") {
                setGenerationStep((prev) => Math.min(prev + 1, currentTasks.length - 1));
              } else if (event.type === "complete") {
                setGenerationStep(currentTasks.length);
                setTimeout(() => {
                  router.push(`/workspace/${createdProject.id}`);
                }, 700);
                return;
              } else if (event.type === "error") {
                setGenerationError(event.error);
              }
            } catch {
              // ignore parse hiccups
            }
          }
        }
      }

      setTimeout(() => {
        router.push(`/workspace/${createdProject.id}`);
      }, 1000);
    } catch (err: unknown) {
      console.error("Sketch generation error:", err);
      setGenerationError(err instanceof Error ? err.message : "Failed to sketch architecture");
      setIsGenerating(false);
    }
  };

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to Sketch
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSketchIt();
    }
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this Sketch?")) return;
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="flex-1 bg-[#09090b] text-[#f4f4f5] min-h-[calc(100vh-68px)] flex flex-col items-center px-4 py-8 sm:py-14 max-w-5xl mx-auto w-full font-sans relative selection:bg-orange-500/20 selection:text-orange-200">
      {/* Human-centric Natural Ambient Lighting (subtle warm undertone, no harsh neon streaks) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[360px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(249,115,22,0.08),rgba(255,255,255,0))] pointer-events-none -z-10" />

      {/* ====================================================================
          HERO HEADER
          ==================================================================== */}
      <div className="w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Architecture Studio</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-400">Multimodal AI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
            What are you designing today?
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Describe your idea, attach architecture diagrams, or paste whiteboard sketches.
            Sketch extracts components, protocols, and data flows to synthesize your blueprint.
          </p>
        </div>

        {/* ====================================================================
            MULTIMODAL CHATGPT-STYLE INPUT CONTAINER
            ==================================================================== */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative w-full rounded-2xl border transition-all duration-200 bg-[#121215] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] ${
            isDragging
              ? "border-orange-500/80 ring-2 ring-orange-500/20 bg-[#17171c]"
              : "border-neutral-800/90 hover:border-neutral-700/80 focus-within:border-neutral-600 focus-within:ring-1 focus-within:ring-neutral-700/50"
          }`}
        >
          {/* Drag Overlay */}
          {isDragging && (
            <div className="absolute inset-0 z-20 rounded-2xl bg-[#121215]/95 backdrop-blur-sm border-2 border-dashed border-orange-500/60 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
              <UploadCloud className="h-10 w-10 text-orange-400 mb-2 animate-bounce" />
              <p className="text-sm font-medium text-white">Drop images or documents here</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Diagrams, sketches, PRDs, and specs will be analyzed automatically
              </p>
            </div>
          )}

          <div className="p-4 sm:p-5 space-y-3">
            {/* Optional System Title */}
            <div className="border-b border-neutral-800/80 pb-2.5">
              <input
                type="text"
                placeholder="System name (optional, e.g. Payment Gateway or Distributed Vector Cache)"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-transparent text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none w-full font-mono"
              />
            </div>

            {/* Idea Textarea with Clipboard Paste Support */}
            <textarea
              rows={4}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Describe your system architecture, requirements, or user flow... (You can also paste screenshots directly with Ctrl+V)"
              className="w-full bg-transparent text-sm sm:text-base text-neutral-100 placeholder:text-neutral-500 focus:outline-none resize-none leading-relaxed"
            />

            {/* ====================================================================
                ATTACHMENT PREVIEW ROW (Images & Documents)
                ==================================================================== */}
            {uploadedItems.length > 0 && (
              <div className="pt-2 border-t border-neutral-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-neutral-400">
                    Attachments ({uploadedItems.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      uploadedItems.forEach((i) => i.previewUrl && URL.revokeObjectURL(i.previewUrl));
                      setUploadedItems([]);
                    }}
                    className="text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    Clear all
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto pr-1 py-1">
                  {uploadedItems.map((item) => (
                    <div
                      key={item.id}
                      className="group relative flex items-center gap-2.5 rounded-xl border border-neutral-800 bg-[#18181c] p-1.5 pr-2.5 hover:border-neutral-700 transition-colors"
                    >
                      {item.isImage && item.previewUrl ? (
                        /* Image Thumbnail */
                        <div
                          onClick={() => setActivePreviewImage(item.previewUrl!)}
                          className="relative h-12 w-12 rounded-lg overflow-hidden bg-black/60 cursor-pointer flex-shrink-0 border border-neutral-700/50 group/thumb"
                        >
                          <img
                            src={item.previewUrl}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform group-hover/thumb:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="h-3.5 w-3.5 text-white" />
                          </div>
                        </div>
                      ) : (
                        /* Document Icon */
                        <div className="h-10 w-10 rounded-lg bg-neutral-800/80 border border-neutral-700/50 flex items-center justify-center text-orange-400 flex-shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                      )}

                      {/* File Metadata */}
                      <div className="min-w-0 max-w-[140px] sm:max-w-[180px]">
                        <p className="text-xs font-medium text-neutral-200 truncate" title={item.name}>
                          {item.name}
                        </p>
                        <p className="text-[10px] text-neutral-500">
                          {(item.size / 1024).toFixed(0)} KB • {item.isImage ? "Image (Vision)" : "Document (RAG)"}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id, item.previewUrl)}
                        className="ml-1 rounded-full p-1 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
                        title="Remove attachment"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ====================================================================
                ACTION TOOLBAR (Both Images & Documents + Submit)
                ==================================================================== */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800/80">
              {/* Left Action Buttons: Images + Documents */}
              <div className="flex items-center gap-2">
                {/* 1. Image Upload Trigger */}
                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif"
                  onChange={handleFileSelection}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800/90 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="Upload architecture diagrams, wireframes, screenshots, or whiteboard photos"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-orange-400" />
                  <span>Attach image</span>
                </button>

                {/* 2. Document Upload Trigger */}
                <input
                  ref={docInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt,.md,.markdown,.json"
                  onChange={handleFileSelection}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => docInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800/90 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="Upload PDF, DOCX, Markdown, or JSON specifications"
                >
                  <Paperclip className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Attach doc</span>
                </button>

                <span className="hidden sm:inline text-[11px] text-neutral-500 font-mono pl-1">
                  (or paste with Ctrl+V)
                </span>
              </div>

              {/* Right: Sketch It Button */}
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-[11px] text-neutral-500 font-mono">
                  Ctrl ↵
                </span>
                <Button
                  onClick={handleSketchIt}
                  disabled={!idea.trim() || isGenerating}
                  className="bg-orange-500 hover:bg-orange-600 text-black font-semibold text-xs h-9 px-5 rounded-lg transition-all flex items-center gap-2 shadow-sm disabled:opacity-40 cursor-pointer"
                >
                  <span>Sketch system</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            ADVANCED PREFERENCES (Clean Accordion)
            ==================================================================== */}
        <div className="rounded-xl border border-neutral-800/80 bg-[#121215] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full p-4 flex items-center justify-between text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sliders className="h-3.5 w-3.5 text-orange-400" />
              <span>Technology & Cloud Preferences (Optional)</span>
            </div>
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showAdvanced && (
            <div className="p-4 pt-0 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs mt-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Preferred Frontend</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, React, Svelte"
                  value={preferences.preferredFrontend}
                  onChange={(e) => setPreferences({ ...preferences, preferredFrontend: e.target.value })}
                  className="w-full bg-[#18181c] border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-neutral-600 font-mono placeholder:text-neutral-600"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Preferred Backend</label>
                <input
                  type="text"
                  placeholder="e.g. Node.js, Go, FastAPI"
                  value={preferences.preferredBackend}
                  onChange={(e) => setPreferences({ ...preferences, preferredBackend: e.target.value })}
                  className="w-full bg-[#18181c] border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-neutral-600 font-mono placeholder:text-neutral-600"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Preferred Database</label>
                <input
                  type="text"
                  placeholder="e.g. Supabase, PostgreSQL"
                  value={preferences.preferredDatabase}
                  onChange={(e) => setPreferences({ ...preferences, preferredDatabase: e.target.value })}
                  className="w-full bg-[#18181c] border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-neutral-600 font-mono placeholder:text-neutral-600"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Target Cloud</label>
                <input
                  type="text"
                  placeholder="e.g. Vercel, AWS, GCP"
                  value={preferences.preferredCloud}
                  onChange={(e) => setPreferences({ ...preferences, preferredCloud: e.target.value })}
                  className="w-full bg-[#18181c] border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-neutral-600 font-mono placeholder:text-neutral-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* ====================================================================
            RECENT SYSTEMS & ARCHITECTURES
            ==================================================================== */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-orange-400" />
              <h2 className="text-sm font-semibold text-neutral-200">
                Recent Sketches ({projects.length})
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loadingProjects ? (
            <div className="p-8 text-center border border-neutral-800/80 bg-[#121215] rounded-xl text-xs text-neutral-500 animate-pulse">
              Loading recent systems...
            </div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-neutral-800 bg-[#121215]/50 rounded-xl space-y-2">
              <p className="text-xs text-neutral-400">No architecture sketches yet.</p>
              <p className="text-[11px] text-neutral-500">
                Type your system concept or upload diagrams above to create your first visual architecture.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {projects.slice(0, 6).map((project) => (
                <div
                  key={project.id}
                  className="group relative rounded-xl border border-neutral-800/80 bg-[#121215] p-4 hover:border-neutral-700 hover:bg-[#151519] transition-all flex flex-col justify-between"
                >
                  <Link href={`/workspace/${project.id}`} className="space-y-2 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      <ExternalLink className="h-3.5 w-3.5 text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {project.description || "System architecture topology and component graph."}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-800/60 text-[11px] text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="text-neutral-500 hover:text-red-400 p-1 rounded transition-colors"
                      title="Delete sketch"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ====================================================================
          IMAGE PREVIEW MODAL / LIGHTBOX
          ==================================================================== */}
      {activePreviewImage && (
        <div
          onClick={() => setActivePreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-neutral-800 bg-[#111114] shadow-2xl p-2 cursor-default"
          >
            <button
              type="button"
              onClick={() => setActivePreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={activePreviewImage}
              alt="Diagram Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* ====================================================================
          GENERATION PROGRESS MODAL
          ==================================================================== */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#121215] p-6 shadow-2xl space-y-5">
            <div className="text-center space-y-1.5">
              <span className="text-xs uppercase tracking-wider text-orange-400 font-semibold">
                Synthesizing Architecture
              </span>
              <h2 className="text-lg font-bold text-white">Sketching your system</h2>
              <p className="text-xs text-neutral-400">
                {hasImages || hasDocs
                  ? "Analyzing your prompt, visual diagrams, and reference context..."
                  : "Evaluating architectural trade-offs and building component topologies..."}
              </p>
            </div>

            {/* Task Checklist */}
            <div className="space-y-2.5 p-3.5 rounded-xl border border-neutral-800/80 bg-neutral-900/50 text-xs font-mono">
              {currentTasks.map((task, idx) => {
                const isCompleted = idx < generationStep;
                const isRunning = idx === generationStep;
                const isPending = idx > generationStep;

                return (
                  <div
                    key={task}
                    className={`flex items-center gap-2.5 transition-opacity ${
                      isPending ? "opacity-35 text-neutral-500" : "text-neutral-200"
                    }`}
                  >
                    {isCompleted && <span className="text-emerald-400 font-bold text-xs">✓</span>}
                    {isRunning && <span className="text-orange-400 animate-pulse text-xs">◉</span>}
                    {isPending && <span className="text-neutral-600 text-xs">○</span>}
                    <span className={isRunning ? "font-semibold text-orange-400" : ""}>
                      {task}
                    </span>
                  </div>
                );
              })}
            </div>

            {generationError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-400">
                {generationError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
