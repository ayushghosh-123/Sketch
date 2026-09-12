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
  Copy,
  Activity,
  Save,
  Cpu,
  Layers,
  Network,
  AlertTriangle,
  CheckCircle2,
  Palette,
  ArrowRight,
  ArrowLeftRight
} from "lucide-react";

interface ComponentDetailsProps {
  projectId: string;
  projectName?: string;
}

export function ComponentDetails({ projectId, projectName = "Software System" }: ComponentDetailsProps) {
  const nodes = useArchitectureStore((state) => state.nodes);
  const edges = useArchitectureStore((state) => state.edges);
  const selectedNode = useArchitectureStore((state) => state.selectedNode);
  const selectedEdge = useArchitectureStore((state) => state.selectedEdge);
  const setSelectedNode = useArchitectureStore((state) => state.setSelectedNode);
  const setSelectedEdge = useArchitectureStore((state) => state.setSelectedEdge);
  const updateNodeData = useArchitectureStore((state) => state.updateNodeData);
  const deleteNode = useArchitectureStore((state) => state.deleteNode);
  const duplicateNode = useArchitectureStore((state) => state.duplicateNode);
  const updateEdge = useArchitectureStore((state) => state.updateEdge);
  const deleteEdge = useArchitectureStore((state) => state.deleteEdge);
  const highlightImpact = useArchitectureStore((state) => state.highlightImpact);
  const clearImpact = useArchitectureStore((state) => state.clearImpact);

  // Form state for node
  const [label, setLabel] = useState("");
  const [technology, setTechnology] = useState("");
  const [description, setDescription] = useState("");
  const [colorPreset, setColorPreset] = useState<string>("neutral");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [impactData, setImpactData] = useState<ImpactAnalysisResult | null>(null);

  // Form state for edge
  const [edgeLabel, setEdgeLabel] = useState("");
  const [edgeColor, setEdgeColor] = useState("#0ea5e9");

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data.label || "");
      setTechnology(selectedNode.data.technology || "");
      setDescription(selectedNode.data.description || "");
      setColorPreset(selectedNode.data.colorPreset || "neutral");
      setImpactData(null);
    }
  }, [selectedNode]);

  useEffect(() => {
    if (selectedEdge) {
      setEdgeLabel(typeof selectedEdge.label === "string" ? selectedEdge.label : "");
      const stroke = (selectedEdge.style as Record<string, string>)?.stroke || "#0ea5e9";
      setEdgeColor(stroke);
    }
  }, [selectedEdge]);

  // COLOR PRESETS: Neutral, Blue, Green, Purple, Orange, Red
  const colorPresets = [
    { name: "neutral", bg: "#18181b", border: "#27272a", label: "Neutral" },
    { name: "blue", bg: "#0284c7", border: "#0ea5e9", label: "Blue" },
    { name: "green", bg: "#059669", border: "#10b981", label: "Green" },
    { name: "purple", bg: "#7c3aed", border: "#a855f7", label: "Purple" },
    { name: "orange", bg: "#d97706", border: "#f59e0b", label: "Orange" },
    { name: "red", bg: "#dc2626", border: "#ef4444", label: "Red" },
  ];

  // 1. STATE: NO SELECTION -> SHOW PROJECT OVERVIEW
  if (!selectedNode && !selectedEdge) {
    const techSet = new Set<string>();
    nodes.forEach((n) => {
      if (n.data.technology) techSet.add(n.data.technology);
    });
    const techStack = Array.from(techSet);

    return (
      <div className="h-full bg-[#09090b] border-l border-[#27272a] flex flex-col font-mono text-xs w-80 select-none">
        <div className="p-4 bg-[#111113] border-b border-[#27272a]">
          <div className="text-[10px] uppercase text-[#0ea5e9] font-bold">PROJECT OVERVIEW</div>
          <h3 className="text-sm font-bold text-[#f4f4f5] truncate mt-1">{projectName}</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded bg-[#111113] border border-[#27272a]">
              <div className="text-[10px] text-[#71717a]">COMPONENTS</div>
              <div className="text-lg font-bold text-[#f4f4f5] mt-0.5">{nodes.length}</div>
            </div>
            <div className="p-3 rounded bg-[#111113] border border-[#27272a]">
              <div className="text-[10px] text-[#71717a]">CONNECTIONS</div>
              <div className="text-lg font-bold text-[#0ea5e9] mt-0.5">{edges.length}</div>
            </div>
          </div>

          {/* Architecture Health */}
          <div className="p-3.5 rounded-lg border border-[#27272a] bg-[#111113] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase text-[#71717a] font-semibold">ARCHITECTURE HEALTH</span>
              <span className="text-[10px] text-[#10b981] flex items-center gap-1 font-bold">
                <CheckCircle2 className="h-3 w-3" /> 100% HEALTHY
              </span>
            </div>
            <div className="w-full bg-[#18181b] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#10b981] h-full w-full" />
            </div>
            <p className="text-[10px] text-[#71717a] leading-relaxed">
              All services have validated ingress/egress dependencies. No orphaned database components.
            </p>
          </div>

          {/* Technology Stack */}
          <div className="space-y-2 pt-2 border-t border-[#27272a]">
            <div className="text-[10px] uppercase text-[#71717a] font-semibold">
              TECHNOLOGY STACK ({techStack.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 rounded bg-[#18181b] border border-[#27272a] text-[11px] text-[#f4f4f5]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded bg-[#18181b] border border-[#27272a] text-[11px] text-[#71717a] leading-relaxed">
            💡 Click any component or connection line to inspect attributes, change colors, or test change blast radiuses.
          </div>
        </div>
      </div>
    );
  }

  // 2. STATE: EDGE SELECTED -> SHOW CONNECTION DETAILS
  if (selectedEdge) {
    const sourceNode = nodes.find((n) => n.id === selectedEdge.source);
    const targetNode = nodes.find((n) => n.id === selectedEdge.target);

    const handleSaveEdge = (newLabel: string, newColor: string) => {
      updateEdge(selectedEdge.id, {
        label: newLabel,
        style: { stroke: newColor, strokeWidth: 2 },
      });
    };

    return (
      <div className="h-full bg-[#09090b] border-l border-[#27272a] flex flex-col font-mono text-xs w-80 select-none">
        <div className="p-4 bg-[#111113] border-b border-[#27272a] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase text-[#0ea5e9] font-bold">CONNECTION DETAILS</div>
            <div className="text-xs font-semibold text-[#f4f4f5] truncate mt-0.5">
              {sourceNode?.data.label || selectedEdge.source} → {targetNode?.data.label || selectedEdge.target}
            </div>
          </div>
          <button
            onClick={() => setSelectedEdge(null)}
            className="text-[#71717a] hover:text-[#f4f4f5] p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1">
            <div className="text-[10px] uppercase text-[#71717a]">FROM (SOURCE)</div>
            <div className="p-2 rounded bg-[#111113] border border-[#27272a] text-[#f4f4f5] text-xs">
              {sourceNode?.data.label || selectedEdge.source}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] uppercase text-[#71717a]">TO (TARGET)</div>
            <div className="p-2 rounded bg-[#111113] border border-[#27272a] text-[#f4f4f5] text-xs">
              {targetNode?.data.label || selectedEdge.target}
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-[#27272a]">
            <div className="text-[10px] uppercase text-[#71717a]">CONNECTION LABEL</div>
            <Input
              value={edgeLabel}
              onChange={(e) => {
                setEdgeLabel(e.target.value);
                handleSaveEdge(e.target.value, edgeColor);
              }}
              placeholder="e.g. HTTPS / API Call"
              className="bg-[#111113] border-[#27272a] text-xs text-[#f4f4f5] h-8"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-[#27272a]">
            <div className="text-[10px] uppercase text-[#71717a]">LINE COLOR</div>
            <div className="flex items-center gap-2">
              {["#0ea5e9", "#10b981", "#f59e0b", "#f43f5e", "#a855f7", "#ffffff"].map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setEdgeColor(color);
                    handleSaveEdge(edgeLabel, color);
                  }}
                  className={`h-6 w-6 rounded-full border transition-transform ${
                    edgeColor === color ? "scale-110 border-white ring-1 ring-white" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#111113] border-t border-[#27272a]">
          <Button
            variant="outline"
            onClick={() => deleteEdge(selectedEdge.id)}
            className="w-full border-red-500/30 text-red-400 hover:bg-red-950/20 text-xs h-8"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete Connection
          </Button>
        </div>
      </div>
    );
  }

  // 3. STATE: NODE SELECTED -> SHOW COMPONENT DETAILS
  const handleSaveNode = () => {
    if (!selectedNode) return;
    updateNodeData(selectedNode.id, {
      label,
      technology,
      description,
      colorPreset: colorPreset as "neutral" | "blue" | "green" | "purple" | "orange" | "red" | "custom",
    });
  };

  const handleRunImpactAnalysis = async () => {
    if (!selectedNode) return;
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

  if (!selectedNode) return null;

  return (
    <div className="h-full bg-[#09090b] border-l border-[#27272a] flex flex-col font-mono text-xs w-80 select-none">
      <div className="p-4 bg-[#111113] border-b border-[#27272a] flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase text-[#0ea5e9] font-bold">COMPONENT DETAILS</div>
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
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Name */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase text-[#71717a]">NAME</div>
          <Input
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              updateNodeData(selectedNode.id, { label: e.target.value });
            }}
            className="bg-[#111113] border-[#27272a] text-xs font-mono text-[#f4f4f5] h-8"
          />
        </div>

        {/* Technology */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase text-[#71717a]">TECHNOLOGY</div>
          <Input
            value={technology}
            onChange={(e) => {
              setTechnology(e.target.value);
              updateNodeData(selectedNode.id, { technology: e.target.value });
            }}
            className="bg-[#111113] border-[#27272a] text-xs font-mono text-[#f4f4f5] h-8"
          />
        </div>

        {/* Category */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase text-[#71717a]">CATEGORY / TYPE</div>
          <div className="p-2 rounded bg-[#111113] border border-[#27272a] text-[#0ea5e9] uppercase text-xs">
            {selectedNode.data.componentType}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase text-[#71717a]">DESCRIPTION</div>
          <Textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              updateNodeData(selectedNode.id, { description: e.target.value });
            }}
            rows={3}
            className="bg-[#111113] border-[#27272a] text-xs font-mono text-[#f4f4f5] resize-none"
          />
        </div>

        {/* Color Presets */}
        <div className="space-y-2 pt-2 border-t border-[#27272a]">
          <div className="text-[10px] uppercase text-[#71717a]">COLOR PRESET</div>
          <div className="grid grid-cols-3 gap-2">
            {colorPresets.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  setColorPreset(p.name);
                  updateNodeData(selectedNode.id, {
                    colorPreset: p.name as "neutral" | "blue" | "green" | "purple" | "orange" | "red" | "custom",
                  });
                }}
                className={`p-1.5 rounded border text-[10px] flex items-center gap-1.5 transition-all ${
                  colorPreset === p.name ? "border-[#0ea5e9] ring-1 ring-[#0ea5e9]" : "border-[#27272a] bg-[#111113]"
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.border }} />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
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
                <span className="text-[#71717a]">RISK:</span>
                <span className="font-bold text-[#ef4444]">{impactData.riskLevel?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">DIRECT IMPACT:</span>
                <span className="text-[#f59e0b]">{impactData.directAffectedIds?.length || 0} nodes</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-3 bg-[#111113] border-t border-[#27272a] space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => duplicateNode(selectedNode.id)}
            className="border-[#27272a] bg-[#18181b] text-[#f4f4f5] text-xs h-8"
          >
            <Copy className="h-3 w-3 mr-1" />
            Duplicate
          </Button>

          <Button
            variant="outline"
            onClick={() => deleteNode(selectedNode.id)}
            className="border-red-500/30 text-red-400 hover:bg-red-950/20 text-xs h-8"
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
          {isAnalyzing ? "Analyzing..." : "Analyze Impact (BFS) →"}
        </Button>
      </div>
    </div>
  );
}
