"use client";

import { useState, useEffect } from "react";
import { useArchitectureStore } from "./store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ImpactAnalysisResult } from "@/services/impactAnalysisService";
import {
  X,
  Trash2,
  Activity,
  Save,
  Cpu,
  Layers,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Radio,
  ArrowRight
} from "lucide-react";

interface ComponentDetailsProps {
  projectId: string;
}

export function ComponentDetails({ projectId }: ComponentDetailsProps) {
  const selectedNode = useArchitectureStore((state) => state.selectedNode);
  const setSelectedNode = useArchitectureStore((state) => state.setSelectedNode);
  const updateNodeData = useArchitectureStore((state) => state.updateNodeData);
  const deleteNode = useArchitectureStore((state) => state.deleteNode);
  const highlightImpact = useArchitectureStore((state) => state.highlightImpact);
  const clearImpact = useArchitectureStore((state) => state.clearImpact);

  // Form state
  const [label, setLabel] = useState("");
  const [technology, setTechnology] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [configExpanded, setConfigExpanded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [impactData, setImpactData] = useState<ImpactAnalysisResult | null>(null);

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data.label || "");
      setTechnology(selectedNode.data.technology || "");
      setDescription(selectedNode.data.description || "");
      setIsEditing(false);
      setImpactData(null);
    }
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div className="h-full bg-[#09090b] border-l border-[#27272a] p-5 flex flex-col items-center justify-center text-center text-[#71717a] font-mono text-xs w-80">
        <Layers className="h-8 w-8 text-[#27272a] mb-2" />
        <div className="font-semibold text-[#f4f4f5] uppercase text-xs">NO COMPONENT SELECTED</div>
        <p className="text-[11px] text-[#71717a] mt-1 max-w-[200px]">
          Select any node in the architecture graph to inspect properties and run blast-radius analysis.
        </p>
      </div>
    );
  }

  const handleSave = () => {
    updateNodeData(selectedNode.id, {
      label,
      technology,
      description,
    });
    setIsEditing(false);
  };

  const handleRunImpactAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/impact-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          changedComponentId: selectedNode.id,
          changeDescription: `Evaluating modifications on ${label} (${technology})`,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setImpactData(data.data);
        highlightImpact(
          selectedNode.id,
          data.data.directAffectedIds || [],
          data.data.indirectAffectedIds || []
        );
      }
    } catch (err) {
      console.error("Impact analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full bg-[#09090b] border-l border-[#27272a] flex flex-col font-mono text-xs w-80 select-none">
      {/* Inspector Header */}
      <div className="p-4 bg-[#111113] border-b border-[#27272a] flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase text-[#71717a]">COMPONENT</div>
          <div className="text-sm font-bold text-[#f4f4f5] truncate max-w-[200px] mt-0.5">
            {label}
          </div>
        </div>
        <button
          onClick={() => {
            clearImpact();
            setSelectedNode(null);
          }}
          className="text-[#71717a] hover:text-[#f4f4f5] p-1"
          aria-label="Close inspector"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Section: TYPE */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase text-[#71717a] font-semibold">TYPE</div>
          <div className="text-xs text-[#0ea5e9] font-medium uppercase">
            {selectedNode.data.componentType?.replace("_", " ") || "SERVICE"}
          </div>
        </div>

        {/* Section: TECHNOLOGY */}
        <div className="space-y-1 pt-2 border-t border-[#27272a]">
          <div className="text-[10px] uppercase text-[#71717a] font-semibold">TECHNOLOGY</div>
          {isEditing ? (
            <Input
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              className="bg-[#111113] border-[#27272a] text-xs font-mono text-[#f4f4f5] h-8"
            />
          ) : (
            <div className="text-xs text-[#f4f4f5]">{technology || "Unspecified"}</div>
          )}
        </div>

        {/* Section: RESPONSIBILITIES */}
        <div className="space-y-1 pt-2 border-t border-[#27272a]">
          <div className="text-[10px] uppercase text-[#71717a] font-semibold">RESPONSIBILITIES</div>
          {isEditing ? (
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-[#111113] border-[#27272a] text-xs font-mono text-[#f4f4f5] resize-none"
            />
          ) : (
            <div className="text-[11px] text-[#a1a1aa] leading-relaxed font-sans">
              {description || "Primary application domain component."}
            </div>
          )}
        </div>

        {/* Section: DEPENDENCIES */}
        <div className="space-y-1 pt-2 border-t border-[#27272a]">
          <div className="text-[10px] uppercase text-[#71717a] font-semibold">DEPENDENCIES</div>
          <div className="text-[11px] text-[#a1a1aa]">
            {Array.isArray((selectedNode.data as Record<string, unknown>).dependencies) &&
            ((selectedNode.data as Record<string, unknown>).dependencies as string[]).length > 0 ? (
              <div className="space-y-1 mt-1">
                {((selectedNode.data as Record<string, unknown>).dependencies as string[]).map((dep: string) => (
                  <div key={dep} className="px-2 py-1 rounded bg-[#111113] border border-[#27272a] truncate">
                    ← {dep}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-[#71717a]">Root / Ingress component</span>
            )}
          </div>
        </div>

        {/* Section: CONFIGURATION (Collapsible) */}
        <div className="pt-2 border-t border-[#27272a]">
          <button
            onClick={() => setConfigExpanded(!configExpanded)}
            className="w-full flex items-center justify-between text-[10px] uppercase text-[#71717a] font-semibold py-1 hover:text-[#f4f4f5]"
          >
            <span>CONFIGURATION</span>
            {configExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {configExpanded && (
            <div className="mt-2 p-2.5 rounded bg-[#111113] border border-[#27272a] text-[10px] text-[#a1a1aa] space-y-1.5">
              <div className="flex justify-between">
                <span>NODE ID:</span>
                <span className="text-[#f4f4f5] font-mono">{selectedNode.id}</span>
              </div>
              <div className="flex justify-between">
                <span>STATUS:</span>
                <span className="text-[#10b981] font-mono">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span>FAILOVER:</span>
                <span className="text-[#f4f4f5] font-mono">AUTOMATIC</span>
              </div>
            </div>
          )}
        </div>

        {/* Impact Analysis Results */}
        {impactData && (
          <div className="pt-2 border-t border-[#27272a] space-y-2">
            <div className="text-[10px] uppercase text-[#f59e0b] font-semibold flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-[#f59e0b]" />
              BLAST RADIUS REPORT
            </div>
            <div className="p-2.5 rounded bg-[#111113] border border-[#f59e0b]/40 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#71717a]">RISK SCORE:</span>
                <span className="font-bold text-[#ef4444]">{impactData.riskLevel?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">DIRECT (d=1):</span>
                <span className="text-[#f59e0b]">{impactData.directAffectedIds?.length || 0} nodes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">CASCADE (d≥2):</span>
                <span className="text-[#f4f4f5]">{impactData.indirectAffectedIds?.length || 0} nodes</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section: ACTIONS (Footer) */}
      <div className="p-3 bg-[#111113] border-t border-[#27272a] space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {isEditing ? (
            <Button
              onClick={handleSave}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-[#09090b] text-xs h-8 font-semibold"
            >
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="w-full border-[#27272a] bg-[#18181b] text-[#f4f4f5] text-xs h-8"
            >
              Edit Node
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => deleteNode(selectedNode.id)}
            className="w-full border-red-500/30 text-red-400 hover:bg-red-950/20 text-xs h-8"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>

        <Button
          onClick={handleRunImpactAnalysis}
          disabled={isAnalyzing}
          className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] text-xs h-8 font-semibold"
        >
          <Activity className="h-3.5 w-3.5 mr-1.5" />
          {isAnalyzing ? "Calculating Blast..." : "Analyze Impact (BFS) →"}
        </Button>
      </div>
    </div>
  );
}
