"use client";

import { useState } from "react";
import { useArchitectureStore } from "./store";
import { Button } from "@/components/ui/button";
import type { ProposedArchitectureChange } from "@/agents/types";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  Plus,
  Edit2,
  MinusCircle
} from "lucide-react";

interface BottomCommandBarProps {
  projectId: string;
}

export function BottomCommandBar({ projectId }: BottomCommandBarProps) {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [proposedChange, setProposedChange] = useState<ProposedArchitectureChange | null>(null);
  const [lastAppliedMessage, setLastAppliedMessage] = useState<string | null>(null);

  const undo = useArchitectureStore((state) => state.undo);
  const setNodes = useArchitectureStore((state) => state.setNodes);
  const setEdges = useArchitectureStore((state) => state.setEdges);
  const applyLayout = useArchitectureStore((state) => state.applyLayout);



  const handleSendCommand = async (cmdToSend?: string) => {
    const finalCmd = cmdToSend || command;
    if (!finalCmd.trim()) return;

    setIsProcessing(true);
    setProposedChange(null);
    setLastAppliedMessage(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/architecture/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: finalCmd.trim(),
          apply: false, // first stage: preview proposed changes!
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.proposedChange) {
        setProposedChange(json.data.proposedChange);
      }
    } catch (err) {
      console.error("Command planning failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyChanges = async () => {
    if (!proposedChange) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/architecture/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: proposedChange.command,
          apply: true, // apply the changes
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.graphData) {
        setNodes(json.data.graphData.nodes);
        setEdges(json.data.graphData.edges);
        setLastAppliedMessage(`✓ Applied: ${proposedChange.summary}`);
        setProposedChange(null);
        setCommand("");

        setTimeout(() => {
          applyLayout("LR");
        }, 200);

        setTimeout(() => {
          setLastAppliedMessage(null);
        }, 6000);
      }
    } catch (err) {
      console.error("Apply changes failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Proposed Changes Preview Modal */}
      {proposedChange && (
        <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
          <div className="w-full max-w-lg rounded-xl border border-[#27272a] bg-[#111113] p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
              <div className="flex items-center gap-2">
                <span className="text-[#0ea5e9]">✦</span>
                <span className="font-bold text-[#f4f4f5] uppercase">PROPOSED ARCHITECTURE CHANGES</span>
              </div>
              <button
                onClick={() => setProposedChange(null)}
                className="text-[#71717a] hover:text-[#f4f4f5]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-[#71717a] uppercase">COMMAND</span>
              <div className="p-2 rounded bg-[#18181b] border border-[#27272a] text-[#f4f4f5]">
                &ldquo;{proposedChange.command}&rdquo;
              </div>
            </div>

            <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
              {proposedChange.summary}
            </p>

            {/* Changes Breakdown */}
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {/* ADD */}
              {proposedChange.add?.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 space-y-0.5">
                  <div className="font-bold flex items-center gap-1.5 text-[11px]">
                    <Plus className="h-3 w-3" /> ADD: {item.name} ({item.technology})
                  </div>
                  <p className="text-[10px] text-neutral-400">{item.description}</p>
                </div>
              ))}

              {/* MODIFY */}
              {proposedChange.modify?.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded bg-amber-950/20 border border-amber-500/30 text-amber-400 space-y-0.5">
                  <div className="font-bold flex items-center gap-1.5 text-[11px]">
                    <Edit2 className="h-3 w-3" /> MODIFY: {item.name}
                  </div>
                  <p className="text-[10px] text-neutral-400">{item.changes}</p>
                </div>
              ))}

              {/* REMOVE */}
              {proposedChange.remove?.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded bg-red-950/20 border border-red-500/30 text-red-400 space-y-0.5">
                  <div className="font-bold flex items-center gap-1.5 text-[11px]">
                    <MinusCircle className="h-3 w-3" /> REMOVE: {item.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#27272a]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProposedChange(null)}
                className="border-[#27272a] bg-[#18181b] text-[#f4f4f5] text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApplyChanges}
                disabled={isProcessing}
                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] text-xs font-semibold"
              >
                {isProcessing ? "Applying..." : "Apply Changes →"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Command Bar */}
      <div className="border-t border-[#27272a] bg-[#09090b] p-3 font-mono text-xs z-10 flex flex-col gap-2">
        {/* Applied Feedback Bar */}
        {lastAppliedMessage && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 text-xs animate-in fade-in">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {lastAppliedMessage}
            </span>
            <button
              onClick={() => {
                undo();
                setLastAppliedMessage(null);
              }}
              className="text-xs text-white hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Undo
            </button>
          </div>
        )}

        {/* Input area */}
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111113] border border-[#27272a] focus-within:border-[#0ea5e9] transition-colors">
            <Sparkles className="h-4 w-4 text-[#0ea5e9] shrink-0" />
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendCommand();
              }}
              placeholder="✦ Ask Sketch to change your system... (e.g. Add Redis caching, Add a mobile app, Make scalable)"
              className="w-full bg-transparent text-xs text-[#f4f4f5] placeholder:text-[#71717a] focus:outline-none"
            />
          </div>

          <Button
            size="sm"
            onClick={() => handleSendCommand()}
            disabled={!command.trim() || isProcessing}
            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] text-xs font-semibold px-4 h-9 shadow-none disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Planning...</span>
            ) : (
              <>
                <span>Send</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
