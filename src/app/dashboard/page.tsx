"use client";

import { useEffect, useState, useRef } from "react";
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
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sliders,
  Layers,
  Network,
  Clock,
  Trash2
} from "lucide-react";

interface UploadedFileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  status: "uploaded" | "reading" | "ready";
  file?: File;
}

export default function DashboardPage() {
  const router = useRouter();

  // Core Idea Input
  const [idea, setIdea] = useState("");
  const [projectName, setProjectName] = useState("");

  // Optional Documents
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles: UploadedFileItem[] = Array.from(e.target.files).map((f) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: f.name,
      type: f.type || f.name.split(".").pop() || "doc",
      size: f.size,
      status: "ready",
      file: f,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // High-Level Tasks definition based on uploaded documents
  const hasUploadedDocs = uploadedFiles.length > 0;

  const tasksWithDocs = [
    "Understanding your idea",
    "Reading your documents",
    "Understanding your research",
    "Researching missing information",
    "Comparing possible solutions",
    "Deciding your architecture",
    "Selecting your technology stack",
    "Creating your visual system",
  ];

  const tasksWithoutDocs = [
    "Understanding your idea",
    "Researching the best solutions",
    "Comparing technologies",
    "Planning your system",
    "Deciding your architecture",
    "Selecting your technology stack",
    "Creating your visual system",
  ];

  const currentTasks = hasUploadedDocs ? tasksWithDocs : tasksWithoutDocs;

  // Launch "Sketch it →"
  const handleSketchIt = async () => {
    if (!idea.trim()) return;

    setIsGenerating(true);
    setGenerationStep(0);
    setGenerationError(null);

    try {
      // 1. Create project record
      const pName = projectName.trim() || idea.slice(0, 35).replace(/[^a-zA-Z0-9\s]/g, "").trim() || "New Sketch";
      const createRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pName,
          description: idea.trim(),
          project_type: "cloud_native",
          target_users: "Platform users",
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

      // 2. Upload any selected files to the project documents endpoint
      if (uploadedFiles.length > 0) {
        setGenerationStep(1);
        for (const item of uploadedFiles) {
          if (item.file) {
            const formData = new FormData();
            formData.append("file", item.file);
            try {
              await fetch(`/api/projects/${createdProject.id}/documents`, {
                method: "POST",
                body: formData,
              });
            } catch (docErr) {
              console.warn("Document upload notice:", docErr);
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
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const raw = line.replace("data: ", "").trim();
            if (!raw) continue;

            try {
              const event = JSON.parse(raw);

              if (event.type === "node_status") {
                // Step increment progression
                setGenerationStep((prev) => Math.min(prev + 1, currentTasks.length - 1));
              } else if (event.type === "complete") {
                setGenerationStep(currentTasks.length);
                setTimeout(() => {
                  router.push(`/workspace/${createdProject.id}`);
                }, 800);
                return;
              } else if (event.type === "error") {
                setGenerationError(event.error);
              }
            } catch {
              // ignore json parse hiccups
            }
          }
        }
      }

      // If stream ended without explicit complete, redirect
      setTimeout(() => {
        router.push(`/workspace/${createdProject.id}`);
      }, 1000);
    } catch (err: unknown) {
      console.error("Sketch generation error:", err);
      setGenerationError(err instanceof Error ? err.message : "Failed to sketch architecture");
      setIsGenerating(false);
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
    <div className="flex-1 bg-[#09090b] text-[#f4f4f5] min-h-[calc(100vh-68px)] flex flex-col items-center px-4 py-8 sm:py-12 max-w-5xl mx-auto w-full font-sans">
      {/* ====================================================================
          CORE IDEA INPUT EXPERIENCE
          ==================================================================== */}
      <div className="w-full space-y-6">
        {/* Main Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f4f4f5]">
            What do you want to build?
          </h1>
          <p className="text-sm sm:text-base text-[#a1a1aa] max-w-xl mx-auto">
            Describe your idea. If you already have research, requirements, or documents,
            you can add them too.
          </p>
        </div>

        {/* Large AI Input Area */}
        <div className="w-full rounded-2xl border border-[#27272a] bg-[#111113] p-4 sm:p-6 shadow-2xl focus-within:border-[#0ea5e9]/70 focus-within:ring-1 focus-within:ring-[#0ea5e9]/40 transition-all space-y-4">
          {/* Optional Project Name field */}
          <div className="flex items-center justify-between border-b border-[#27272a]/60 pb-3">
            <input
              type="text"
              placeholder="System or Product Name (optional)"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-transparent text-sm font-semibold text-[#f4f4f5] placeholder:text-[#71717a] focus:outline-none w-full font-mono"
            />
          </div>

          {/* Main Idea Textarea */}
          <textarea
            rows={4}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe what you want to build... (e.g. I want to build an AI-powered platform where students can learn programming and receive personalized help)"
            className="w-full bg-transparent text-base sm:text-lg text-[#f4f4f5] placeholder:text-[#71717a] focus:outline-none resize-none leading-relaxed"
          />

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#27272a]/60">
            {/* File Upload Trigger */}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.txt,.md,.markdown,.json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-xs font-mono text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors"
              >
                <Paperclip className="h-3.5 w-3.5 text-[#0ea5e9]" />
                <span>+ Add context ({uploadedFiles.length})</span>
              </button>
            </div>

            {/* Sketch It Button */}
            <Button
              onClick={handleSketchIt}
              disabled={!idea.trim() || isGenerating}
              className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] font-mono font-semibold text-xs h-10 px-5 rounded-lg transition-colors flex items-center gap-2 shadow-none disabled:opacity-50"
            >
              <span>Sketch it</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* ====================================================================
            OPTIONAL CONTEXT SECTION: ADD WHAT YOU ALREADY KNOW
            ==================================================================== */}
        <div className="rounded-xl border border-[#27272a] bg-[#111113] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-[#f4f4f5]">
                ADD WHAT YOU ALREADY KNOW
              </h2>
              <p className="text-xs text-[#a1a1aa] mt-0.5">
                You don&apos;t need documents to start. But if you already have research, requirements, or notes, Sketch can use them.
              </p>
            </div>

            {/* Prominent UX Reassurance Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#18181b] border border-[#27272a] text-[11px] font-mono text-[#10b981] self-start sm:self-auto">
              <span>NO DOCUMENTS? NO PROBLEM.</span>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 ? (
            <div className="space-y-2 pt-2">
              {uploadedFiles.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[#27272a] bg-[#18181b] text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5 truncate max-w-md">
                    <FileText className="h-4 w-4 text-[#0ea5e9] shrink-0" />
                    <span className="text-[#f4f4f5] truncate font-medium">{f.name}</span>
                    <span className="text-[10px] text-[#71717a] uppercase">({(f.size / 1024).toFixed(1)} KB)</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-[#10b981] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Ready
                    </span>
                    <button
                      onClick={() => handleRemoveFile(f.id)}
                      className="text-[#71717a] hover:text-[#f43f5e] p-1"
                      title="Remove file"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-[#27272a] rounded-lg p-6 text-center cursor-pointer hover:border-[#3f3f46] transition-colors"
            >
              <Paperclip className="h-5 w-5 text-[#71717a] mx-auto mb-1.5" />
              <div className="text-xs font-mono text-[#a1a1aa]">
                Click to attach PDFs, DOCX, TXT, or Markdown files
              </div>
              <div className="text-[11px] text-[#71717a] mt-0.5">
                Research documents, product requirements, technical notes, reference files
              </div>
            </div>
          )}
        </div>

        {/* ====================================================================
            ADVANCED PREFERENCES (COLLAPSED BY DEFAULT)
            ==================================================================== */}
        <div className="rounded-xl border border-[#27272a] bg-[#111113] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full p-4 flex items-center justify-between text-xs font-mono text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sliders className="h-3.5 w-3.5 text-[#0ea5e9]" />
              <span>Advanced Preferences (Optional)</span>
            </div>
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showAdvanced && (
            <div className="p-4 pt-0 border-t border-[#27272a]/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs mt-3">
              <div>
                <label className="text-[10px] text-[#71717a] uppercase block mb-1">Preferred Frontend</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, React"
                  value={preferences.preferredFrontend}
                  onChange={(e) => setPreferences({ ...preferences, preferredFrontend: e.target.value })}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded p-2 text-xs text-[#f4f4f5] focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] uppercase block mb-1">Preferred Backend</label>
                <input
                  type="text"
                  placeholder="e.g. Node.js, Go, Python"
                  value={preferences.preferredBackend}
                  onChange={(e) => setPreferences({ ...preferences, preferredBackend: e.target.value })}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded p-2 text-xs text-[#f4f4f5] focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] uppercase block mb-1">Preferred Database</label>
                <input
                  type="text"
                  placeholder="e.g. Supabase, PostgreSQL"
                  value={preferences.preferredDatabase}
                  onChange={(e) => setPreferences({ ...preferences, preferredDatabase: e.target.value })}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded p-2 text-xs text-[#f4f4f5] focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] uppercase block mb-1">Preferred Cloud</label>
                <input
                  type="text"
                  placeholder="e.g. Vercel, AWS"
                  value={preferences.preferredCloud}
                  onChange={(e) => setPreferences({ ...preferences, preferredCloud: e.target.value })}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded p-2 text-xs text-[#f4f4f5] focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>
            </div>
          )}
        </div>

        {/* ====================================================================
            RECENT SKETCHES
            ==================================================================== */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#a1a1aa] uppercase tracking-wider font-semibold">
              Recent Sketches ({projects.length})
            </span>
            <Link href="/projects" className="text-[#71717a] hover:text-[#f4f4f5]">
              View all →
            </Link>
          </div>

          {loadingProjects ? (
            <div className="p-8 text-center border border-[#27272a] bg-[#111113] rounded-lg text-xs font-mono text-[#71717a] animate-pulse">
              Scanning recent sketches...
            </div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center border border-[#27272a] bg-[#111113] rounded-lg font-mono space-y-2">
              <Layers className="h-6 w-6 text-[#71717a] mx-auto" />
              <div className="text-xs font-semibold text-[#f4f4f5]">No sketches yet</div>
              <p className="text-[11px] text-[#71717a]">
                Type your idea above and click &ldquo;Sketch it →&rdquo; to create your first architecture.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 6).map((project) => (
                <Link
                  key={project.id}
                  href={`/workspace/${project.id}`}
                  className="group p-4 rounded-xl border border-[#27272a] bg-[#111113] hover:border-[#0ea5e9]/60 hover:bg-[#18181b] transition-all font-mono text-xs flex flex-col justify-between min-h-[120px] shadow-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#0ea5e9] uppercase font-bold truncate">
                        ◈ {project.project_type?.replace(/_/g, " ")}
                      </span>
                      <button
                        onClick={(e) => handleDeleteProject(project.id, e)}
                        className="text-[#71717a] hover:text-[#f43f5e] p-1"
                        title="Delete sketch"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-[#f4f4f5] group-hover:text-[#0ea5e9] transition-colors truncate">
                      {project.name}
                    </h3>
                    <p className="text-[11px] text-[#71717a] line-clamp-2 leading-relaxed">
                      {project.description || "Interactive software architecture."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#27272a]/50 flex items-center justify-between text-[10px] text-[#71717a]">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-[#0ea5e9] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Open Canvas →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ====================================================================
          AI GENERATION EXPERIENCE MODAL (TASK PROGRESS ONLY - NO CHAIN-OF-THOUGHT)
          ==================================================================== */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-[#09090b]/90 backdrop-blur-md flex items-center justify-center p-4 font-mono">
          <div className="w-full max-w-lg rounded-2xl border border-[#27272a] bg-[#111113] p-6 shadow-2xl space-y-6">
            <div className="text-center space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-[#0ea5e9] font-bold">
                GENERATION IN PROGRESS
              </span>
              <h2 className="text-xl font-bold text-[#f4f4f5]">
                SKETCH IS DESIGNING YOUR SYSTEM
              </h2>
              <p className="text-xs text-[#a1a1aa]">
                {hasUploadedDocs
                  ? "Analyzing your idea and reading uploaded documents..."
                  : "Researching best solutions and formulating your architecture..."}
              </p>
            </div>

            {/* Task Checklist */}
            <div className="space-y-2.5 p-4 rounded-xl border border-[#27272a] bg-[#09090b] text-xs">
              {currentTasks.map((task, idx) => {
                const isCompleted = idx < generationStep;
                const isRunning = idx === generationStep;
                const isPending = idx > generationStep;

                return (
                  <div
                    key={task}
                    className={`flex items-center gap-3 transition-opacity ${
                      isPending ? "opacity-40 text-[#71717a]" : "text-[#f4f4f5]"
                    }`}
                  >
                    {isCompleted && <span className="text-[#10b981] font-bold">✓</span>}
                    {isRunning && <span className="text-[#0ea5e9] animate-pulse">◉</span>}
                    {isPending && <span className="text-[#71717a]">○</span>}
                    <span className={isRunning ? "font-semibold text-[#0ea5e9]" : ""}>
                      {task}
                    </span>
                  </div>
                );
              })}
            </div>

            {generationError && (
              <div className="p-3 rounded bg-red-950/30 border border-red-500/40 text-xs text-red-400">
                {generationError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
