"use client";

import { useState } from "react";
import Link from "next/link";
import { useArchitectureStore } from "./store";
import { Button } from "@/components/ui/button";
import {
  Undo,
  Redo,
  LayoutGrid,
  Share2,
  Download,
  CheckCircle2,
  Save,
  ArrowLeft,
  BookOpen,
  Cpu,
  Layers
} from "lucide-react";

interface WorkspaceTopBarProps {
  projectId: string;
  projectName: string;
  onSave: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
}

export function WorkspaceTopBar({
  projectId,
  projectName,
  onSave,
  isSaving,
  saveSuccess,
}: WorkspaceTopBarProps) {
  const undo = useArchitectureStore((state) => state.undo);
  const redo = useArchitectureStore((state) => state.redo);
  const history = useArchitectureStore((state) => state.history);
  const future = useArchitectureStore((state) => state.future);
  const applyLayout = useArchitectureStore((state) => state.applyLayout);
  const isDirty = useArchitectureStore((state) => state.isDirty);
  const nodes = useArchitectureStore((state) => state.nodes);
  const edges = useArchitectureStore((state) => state.edges);

  const [copied, setCopied] = useState(false);

  // Export JSON spec
  const handleExport = () => {
    const dataStr = JSON.stringify({ nodes, edges, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}-sketch.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Share Link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <header className="h-12 bg-[#09090b] border-b border-[#27272a] px-3 sm:px-4 flex items-center justify-between font-mono text-xs z-20 select-none">
      {/* LEFT: Back, Sketch Logo & Project Name */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="text-[#71717a] hover:text-[#f4f4f5] p-1 rounded hover:bg-[#18181b] transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#0ea5e9]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m18 2 4 4-10 10H8v-4L18 2z" />
              <path d="m14 6 4 4" />
              <path d="M4 20h16" />
            </svg>
          </div>
          <span className="font-bold text-[#f4f4f5] uppercase font-sans tracking-wide">
            SKETCH
          </span>
          <span className="text-[#71717a]">/</span>
          <span className="font-semibold text-[#f4f4f5] truncate max-w-[140px] sm:max-w-xs">
            {projectName}
          </span>
        </div>

        {/* Project Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#111113] border border-[#27272a] text-[10px] text-[#10b981]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
          <span>Ready</span>
        </div>
      </div>

      {/* CENTER: Dedicated Architecture Decision & Tech Stack links */}
      <div className="hidden lg:flex items-center gap-2">
        <Link
          href={`/workspace/${projectId}/decisions`}
          className="px-2.5 py-1 rounded hover:bg-[#18181b] text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors flex items-center gap-1.5 border border-transparent hover:border-[#27272a]"
        >
          <Layers className="h-3.5 w-3.5 text-[#0ea5e9]" />
          <span>Decisions</span>
        </Link>
        <Link
          href={`/tech-stack/${projectId}`}
          className="px-2.5 py-1 rounded hover:bg-[#18181b] text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors flex items-center gap-1.5 border border-transparent hover:border-[#27272a]"
        >
          <Cpu className="h-3.5 w-3.5 text-[#10b981]" />
          <span>Tech Stack</span>
        </Link>
      </div>

      {/* RIGHT: Actions (Undo, Redo, Auto Arrange, Share, Export, Save) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Undo / Redo */}
        <button
          onClick={undo}
          disabled={history.length === 0}
          title="Undo (Ctrl+Z)"
          className="h-7 w-7 rounded flex items-center justify-center text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#18181b] disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <Undo className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={redo}
          disabled={future.length === 0}
          title="Redo (Ctrl+Y)"
          className="h-7 w-7 rounded flex items-center justify-center text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#18181b] disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <Redo className="h-3.5 w-3.5" />
        </button>

        <div className="h-4 w-px bg-[#27272a]" />

        {/* Auto Arrange */}
        <button
          onClick={() => applyLayout("LR")}
          title="Auto Arrange Layout"
          className="h-7 px-2 rounded flex items-center gap-1 text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#18181b] text-[11px]"
        >
          <LayoutGrid className="h-3 w-3 text-[#0ea5e9]" />
          <span className="hidden sm:inline">Arrange</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          title="Share Project URL"
          className="h-7 px-2 rounded flex items-center gap-1 text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#18181b] text-[11px]"
        >
          <Share2 className="h-3 w-3" />
          <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
        </button>

        {/* Export */}
        <button
          onClick={handleExport}
          title="Export Architecture Spec JSON"
          className="h-7 px-2 rounded flex items-center gap-1 text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#18181b] text-[11px]"
        >
          <Download className="h-3 w-3" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <div className="h-4 w-px bg-[#27272a]" />

        {/* Save Button */}
        <Button
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="h-7 px-3 text-[11px] bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] font-semibold"
        >
          {saveSuccess ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Saved
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Save className="h-3 w-3" />
              {isDirty ? "Save *" : "Save"}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
