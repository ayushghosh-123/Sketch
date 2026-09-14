"use client";

import { memo, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Terminal,
  Activity
} from "lucide-react";

export interface NodeStatusItem {
  id: string;
  name: string;
  status: "idle" | "running" | "completed" | "failed";
  description: string;
}

export const WORKFLOW_NODES: { id: string; name: string; description: string }[] = [
  { id: "input_orchestrator", name: "Input Orchestrator", description: "Route idea & inspect docs" },
  { id: "rag_agent", name: "RAG Agent", description: "Vector semantic retrieval" },
  { id: "research_agent", name: "Research Agent", description: "Architectural & tech research" },
  { id: "decision_agent", name: "Decision Agent", description: "Decide layers & components" },
  { id: "validation_step", name: "Validation Step", description: "Verify system integrity" },
  { id: "canvas_agent", name: "Canvas Agent", description: "Dagre layout generation" },
  { id: "save_project", name: "Save Project", description: "Persist & version state" },
];

interface AgentWorkflowVisualizerProps {
  currentNode: string | null;
  nodeStatuses: Record<string, "idle" | "running" | "completed" | "failed">;
  isGenerating: boolean;
  logs: string[];
}

export const AgentWorkflowVisualizer = memo(function AgentWorkflowVisualizer({
  currentNode,
  nodeStatuses,
  isGenerating,
  logs,
}: AgentWorkflowVisualizerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-col bg-[#000000] border-t border-white/10 font-mono text-xs select-none">
      {/* Header Bar */}
      <div className="px-4 py-2 bg-[#111111] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-white uppercase tracking-wider text-[11px] font-sans">
            <span>◎ AGENT WORKFLOW PIPELINE</span>
          </div>
          {isGenerating ? (
            <span className="text-[10px] text-[#f97316] flex items-center gap-1 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f97316] animate-pulse" />
              RUNNING / {currentNode?.replace(/_/g, " ").toUpperCase() || "ORCHESTRATING"}
            </span>
          ) : (
            <span className="text-[10px] text-[#71717a] font-mono">○ IDLE</span>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#71717a] hover:text-white p-1 flex items-center gap-1 text-[10px] cursor-pointer"
        >
          <span>{isExpanded ? "COLLAPSE" : "EXPAND"}</span>
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
        </button>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 max-h-56 overflow-y-auto">
          {/* Node Status Pipeline Grid (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {WORKFLOW_NODES.map((node) => {
              const status =
                nodeStatuses[node.id] ||
                nodeStatuses[node.name] ||
                (currentNode === node.id || currentNode === node.name ? "running" : "idle");
              const isCurrent = currentNode === node.id || currentNode === node.name;

              return (
                <div
                  key={node.id}
                  title={node.description}
                  className={`p-2 rounded border text-[10px] space-y-1 transition-all ${
                    status === "completed"
                      ? "bg-[#111111] border-white/10 text-white"
                      : status === "running" || isCurrent
                      ? "bg-[#18181b] border-[#f97316] text-white ring-1 ring-[#f97316]"
                      : status === "failed"
                      ? "bg-red-950/20 border-red-500/50 text-red-400"
                      : "bg-[#000000] border-white/10 text-[#71717a]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">
                      {status === "completed" && <span className="text-[#10b981]">✓</span>}
                      {(status === "running" || isCurrent) && <span className="text-[#f97316] animate-pulse">◉</span>}
                      {status === "idle" && !isCurrent && <span className="text-[#71717a]">○</span>}
                      {status === "failed" && <span className="text-[#ef4444]">✕</span>}
                    </span>
                    <span className="text-[9px] uppercase tracking-tighter">
                      {status === "running" || isCurrent ? "RUNNING" : status}
                    </span>
                  </div>
                  <div className="font-medium leading-tight truncate font-sans">{node.name}</div>
                </div>
              );
            })}
          </div>

          {/* Execution Logs Stream (5 cols) */}
          <div className="lg:col-span-5 bg-[#111111] border border-white/10 rounded p-2.5 text-[10px] text-[#a1a1aa] overflow-y-auto max-h-48 space-y-1">
            <div className="text-[9px] uppercase text-[#71717a] pb-1 border-b border-white/10">
              Execution Telemetry Logs
            </div>
            {logs.length === 0 ? (
              <div className="text-[#71717a] italic py-2">No active execution logs. Ready for system synthesis.</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="leading-tight flex items-start gap-1.5 font-mono">
                  <span className="text-[#f97316] select-none">&gt;</span>
                  <span className="text-white">{log}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
});
