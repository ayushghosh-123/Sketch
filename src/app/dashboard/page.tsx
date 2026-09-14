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
    <div className="flex-1 bg-[#000000] text-[#ffffff] min-h-[calc(100vh-68px)] flex flex-col items-center px-4 py-8 sm:py-12 max-w-5xl mx-auto w-full font-sans relative">
      {/* ChaiCode Warm Ambient Spotlight */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-gradient-to-b from-orange-500/10 via-amber-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* ====================================================================
          CORE IDEA INPUT EXPERIENCE
          ==================================================================== */}
      <div className="w-full space-y-6">
        {/* Main Heading */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111111] border border-white/10 text-xs font-mono text-[#a1a1aa] mb-1 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#f97316]" />
            <span>MULTI-AGENT ARCHITECTURE SUITE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            What do you want to build?
          </h1>
          <p className="text-sm sm:text-base text-[#a1a1aa] max-w-xl mx-auto">
            Describe your vision. Upload technical notes or start purely from first principles.
          </p>
        </div>

        {/* Large AI Input Area */}
        <div className="w-full rounded-2xl border border-white/10 bg-[#111111] p-4 sm:p-6 shadow-2xl focus-within:border-[#f97316]/80 focus-within:ring-1 focus-within:ring-[#f97316]/40 transition-all space-y-4">
          {/* Optional Project Name field */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <input
              type="text"
              placeholder="System or Product Name (optional)"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-transparent text-sm font-semibold text-[#ffffff] placeholder:text-[#71717a] focus:outline-none w-full font-mono"
            />
          </div>

          {/* Main Idea Textarea */}
          <textarea
            rows={4}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe what you want to build... (e.g. I want to build a real-time collaborative platform with GitHub sync and auto-scaling cloud preview environments)"
            className="w-full bg-transparent text-base sm:text-lg text-[#ffffff] placeholder:text-[#71717a] focus:outline-none resize-none leading-relaxed"
          />

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181b] hover:bg-[#222226] border border-white/10 text-xs font-mono text-[#a1a1aa] hover:text-[#ffffff] transition-colors"
              >
                <Paperclip className="h-3.5 w-3.5 text-[#f97316]" />
                <span>+ Add context ({uploadedFiles.length})</span>
              </button>
            </div>

            {/* Sketch It Button */}
            <Button
              onClick={handleSketchIt}
              disabled={!idea.trim() || isGenerating}
              className="bg-[#f97316] hover:bg-[#ea580c] text-[#000000] font-mono font-bold text-xs h-10 px-6 rounded-lg chai-btn-primary transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.45)] disabled:opacity-50"
            >
              <span>Sketch it</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* ====================================================================
            OPTIONAL CONTEXT SECTION: ADD WHAT YOU ALREADY KNOW
            ==================================================================== */}
        

        {/* ====================================================================
            ADVANCED PREFERENCES (COLLAPSED BY DEFAULT)
            ==================================================================== */}
        <div className="rounded-xl border border-white/10 bg-[#111111] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full p-4 flex items-center justify-between text-xs font-mono text-[#a1a1aa] hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sliders className="h-3.5 w-3.5 text-[#f97316]" />
              <span>Advanced Preferences (Optional)</span>
            </div>
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showAdvanced && (
            <div className="p-4 pt-0 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs mt-3">
              <div>
                <label className="text-[10px] text-[#71717a] uppercase block mb-1">Preferred Frontend</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, React"
                  value={preferences.preferredFrontend}
                  onChange={(e) => setPreferences({ ...preferences, preferredFrontend: e.target.value })}
                  className="w-full bg-[#18181b] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-[#f97316]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] uppercase block mb-1">Preferred Backend</label>
                <input
                  type="text"
                  placeholder="e.g. Node.js, Go, Python"
                  value={preferences.preferredBackend}
                  onChange={(e) => setPreferences({ ...preferences, preferredBackend: e.target.value })}
                  className="w-full bg-[#18181b] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-[#f97316]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] uppercase block mb-1">Preferred Database</label>
                <input
                  type="text"
                  placeholder="e.g. Supabase, PostgreSQL"
                  value={preferences.preferredDatabase}
                  onChange={(e) => setPreferences({ ...preferences, preferredDatabase: e.target.value })}
                  className="w-full bg-[#18181b] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-[#f97316]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] uppercase block mb-1">Preferred Cloud</label>
                <input
                  type="text"
                  placeholder="e.g. Vercel, AWS"
                  value={preferences.preferredCloud}
                  onChange={(e) => setPreferences({ ...preferences, preferredCloud: e.target.value })}
                  className="w-full bg-[#18181b] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-[#f97316]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====================================================================
          AI GENERATION EXPERIENCE MODAL (TASK PROGRESS ONLY - NO CHAIN-OF-THOUGHT)
          ==================================================================== */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-[#000000]/90 backdrop-blur-md flex items-center justify-center p-4 font-mono">
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#111111] p-6 shadow-[0_0_50px_rgba(249,115,22,0.15)] space-y-6">
            <div className="text-center space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-[#f97316] font-bold">
                GENERATION IN PROGRESS
              </span>
              <h2 className="text-xl font-bold text-white">
                SKETCH IS DESIGNING YOUR SYSTEM
              </h2>
              <p className="text-xs text-[#a1a1aa]">
                {hasUploadedDocs
                  ? "Analyzing your idea and reading uploaded documents..."
                  : "Researching best solutions and formulating your architecture..."}
              </p>
            </div>

            {/* Task Checklist */}
            <div className="space-y-2.5 p-4 rounded-xl border border-white/10 bg-[#000000] text-xs">
              {currentTasks.map((task, idx) => {
                const isCompleted = idx < generationStep;
                const isRunning = idx === generationStep;
                const isPending = idx > generationStep;

                return (
                  <div
                    key={task}
                    className={`flex items-center gap-3 transition-opacity ${
                      isPending ? "opacity-40 text-[#71717a]" : "text-white"
                    }`}
                  >
                    {isCompleted && <span className="text-[#10b981] font-bold">✓</span>}
                    {isRunning && <span className="text-[#f97316] animate-pulse">◉</span>}
                    {isPending && <span className="text-[#71717a]">○</span>}
                    <span className={isRunning ? "font-semibold text-[#f97316]" : ""}>
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
