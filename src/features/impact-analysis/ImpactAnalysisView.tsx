"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ArchitectureComponent, ComponentDependency } from "@/types/database";
import type { ImpactAnalysisResult } from "@/services/impactAnalysisService";
import {
  Activity,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  GitCommit,
  Radio,
  Network,
  Zap,
  Lock,
  Clock,
  Database,
  Cpu,
  CornerDownRight
} from "lucide-react";

interface ImpactAnalysisViewProps {
  projectId: string;
}

type ChangeType = "MODIFY" | "REMOVE" | "REPLACE" | "SCALE";

export function ImpactAnalysisView({ projectId }: ImpactAnalysisViewProps) {
  const [components, setComponents] = useState<ArchitectureComponent[]>([]);
  const [dependencies, setDependencies] = useState<ComponentDependency[]>([]);
  const [selectedCompId, setSelectedCompId] = useState<string>("");
  const [changeType, setChangeType] = useState<ChangeType>("MODIFY");
  const [changeDescription, setChangeDescription] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImpactAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/projects/${projectId}/architecture`);
        const json = await res.json();
        if (json.success && json.data) {
          setComponents(json.data.components || []);
          setDependencies(json.data.dependencies || []);
          if (json.data.components?.length > 0) {
            setSelectedCompId(json.data.components[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load components:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [projectId]);

  const selectedComponent = useMemo(() => {
    return components.find((c) => c.id === selectedCompId);
  }, [components, selectedCompId]);

  const handleRunAnalysis = async () => {
    if (!selectedCompId) return;
    setIsAnalyzing(true);

    const fullDescription = changeDescription.trim()
      ? `[ACTION: ${changeType}] ${changeDescription}`
      : `[ACTION: ${changeType}] Architecture change on ${selectedComponent?.name || "component"}`;

    try {
      const res = await fetch(`/api/projects/${projectId}/impact-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          changedComponentId: selectedCompId,
          changeDescription: fullDescription,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAnalysisResult(json.data);
      }
    } catch (err) {
      console.error("Failed to run impact analysis:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const directList = useMemo(() => {
    return analysisResult?.affectedComponents.filter((c) => c.type === "direct") || [];
  }, [analysisResult]);

  const indirectList = useMemo(() => {
    return analysisResult?.affectedComponents.filter((c) => c.type === "indirect") || [];
  }, [analysisResult]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 text-[#f4f4f5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#27272a]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-amber-400">
              // BLAST RADIUS RADAR // GRAPH BFS TRAVERSAL
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="font-mono text-[10px] text-amber-400">TOPOLOGICAL SORT ACTIVE</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-amber-400" />
            Directed Impact & Failure Cascade Analyzer
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Simulate schema shifts, decommissioned endpoints, or technology replacements across directed acyclic dependency graphs (DAG).
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded border border-[#27272a] bg-[#111113] text-[#a1a1aa]">
            NODES: <span className="text-white font-bold">{components.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded border border-[#27272a] bg-[#111113] text-[#a1a1aa]">
            EDGES: <span className="text-white font-bold">{dependencies.length}</span>
          </div>
        </div>
      </div>

      {/* Control & Query Panel */}
      <div className="rounded-xl border border-[#27272a] bg-[#111113] p-5 space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa] flex items-center gap-2 pb-2 border-b border-[#27272a]/70">
          <Radio className="h-3.5 w-3.5 text-amber-400" />
          <span>Simulation Configuration</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Target Component */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-mono font-semibold text-[#a1a1aa] block">
              TARGET COMPONENT (ROOT OF CHANGE)
            </label>
            <select
              value={selectedCompId}
              onChange={(e) => setSelectedCompId(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-[#09090b] border border-[#27272a] text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
            >
              {components.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} [{c.component_type.toUpperCase()}] ({c.technology || "Generic"})
                </option>
              ))}
            </select>
          </div>

          {/* Change Type */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-mono font-semibold text-[#a1a1aa] block">
              MUTATION TYPE
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(["MODIFY", "REPLACE", "REMOVE", "SCALE"] as ChangeType[]).map((t) => {
                const isSel = changeType === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setChangeType(t)}
                    className={`h-9 text-[11px] font-mono font-bold rounded border transition-colors ${
                      isSel
                        ? t === "REMOVE"
                          ? "bg-red-500/20 border-red-500 text-red-400"
                          : t === "MODIFY"
                          ? "bg-amber-500/20 border-amber-500 text-amber-400"
                          : t === "REPLACE"
                          ? "bg-[#0ea5e9]/20 border-[#0ea5e9] text-[#0ea5e9]"
                          : "bg-purple-500/20 border-purple-500 text-purple-400"
                        : "border-[#27272a] bg-[#09090b] text-[#71717a] hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-mono font-semibold text-[#a1a1aa] block">
              MUTATION SPECIFICATION
            </label>
            <Input
              placeholder="e.g. Migrating auth token to Ed25519 or schema alteration"
              value={changeDescription}
              onChange={(e) => setChangeDescription(e.target.value)}
              className="h-9 text-xs bg-[#09090b] border-[#27272a] text-white font-mono placeholder-[#71717a]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#27272a]/70">
          <span className="text-[11px] font-mono text-[#71717a]">
            BFS Traversal Algorithm: Bidirectional Upstream Callers & Downstream Consumers
          </span>
          <Button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || components.length === 0}
            className="bg-amber-400 hover:bg-amber-300 text-[#09090b] font-mono font-bold text-xs shadow-lg shadow-amber-950/30"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Traversing Graph...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                Execute BFS Impact Analysis
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Results View */}
      {analysisResult && (
        <div className="space-y-5 animate-in fade-in-50 duration-200">
          {/* Summary Banner */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">
                    BLAST RADIUS ASSESSMENT: {analysisResult.changedComponentName}
                  </h3>
                  <span className="text-[10px] font-mono text-amber-400/80">
                    STATUS: CASCADE ANALYSIS COMPUTED
                  </span>
                </div>
              </div>

              <span
                className={`font-mono text-xs px-3 py-1 rounded font-bold uppercase tracking-wider border ${
                  analysisResult.riskLevel === "critical"
                    ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
                    : analysisResult.riskLevel === "high"
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                    : analysisResult.riskLevel === "medium"
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    : "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40"
                }`}
              >
                SYSTEM RISK: {analysisResult.riskLevel}
              </span>
            </div>

            <p className="text-xs text-[#f4f4f5] mt-3 leading-relaxed font-mono">
              {analysisResult.summary}
            </p>
          </div>

          {/* Blast Radius Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/5">
              <div className="text-[10px] text-red-400 uppercase tracking-wider flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                Root Node
              </div>
              <div className="text-base font-bold text-white mt-1 truncate">
                {analysisResult.changedComponentName}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
              <div className="text-[10px] text-amber-400 uppercase tracking-wider">
                ▲ Direct Impact (D=1)
              </div>
              <div className="text-base font-bold text-white mt-1">
                {analysisResult.directAffectedIds.length} Upstream Callers
              </div>
            </div>

            <div className="p-3 rounded-lg border border-[#0ea5e9]/30 bg-[#0ea5e9]/5">
              <div className="text-[10px] text-[#0ea5e9] uppercase tracking-wider">
                ○ Indirect Cascade (D&ge;2)
              </div>
              <div className="text-base font-bold text-white mt-1">
                {analysisResult.indirectAffectedIds.length} Consumers
              </div>
            </div>

            <div className="p-3 rounded-lg border border-[#27272a] bg-[#111113]">
              <div className="text-[10px] text-[#71717a] uppercase tracking-wider">
                Total Blast Radius
              </div>
              <div className="text-base font-bold text-white mt-1">
                {analysisResult.directAffectedIds.length + analysisResult.indirectAffectedIds.length} Nodes
              </div>
            </div>
          </div>

          {/* Visual Blast Radius Cascade Tree */}
          <div className="rounded-xl border border-[#27272a] bg-[#111113] p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#27272a]">
              <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-2">
                <Network className="h-4 w-4 text-amber-400" />
                Directed Dependency Cascade Visualization
              </span>
              <span className="font-mono text-[10px] text-[#71717a]">BFS PROPAGATION ORDER</span>
            </div>

            <div className="space-y-4">
              {/* Origin Node */}
              <div className="p-3.5 rounded-lg border-2 border-red-500/60 bg-red-950/20 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[11px] font-bold text-red-400 uppercase">
                      ● ORIGIN OF MUTATION (DISTANCE = 0)
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                    ROOT
                  </span>
                </div>
                <div className="text-sm font-bold text-white mt-2">
                  {analysisResult.changedComponentName}
                </div>
                <div className="text-[11px] text-[#a1a1aa] mt-1">
                  Change applied: {changeDescription || "Architecture modification / tech switch"}
                </div>
              </div>

              {/* Cascade Level 1 (Direct) */}
              <div className="pl-6 border-l-2 border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 font-mono text-[11px] text-amber-400 font-bold">
                  <CornerDownRight className="h-3.5 w-3.5" />
                  ▲ DIRECT IMPACT (DISTANCE = 1) — IMMEDIATE DEPENDENCIES
                </div>

                {directList.length === 0 ? (
                  <div className="p-3 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#71717a] font-mono italic">
                    No direct callers or upstream dependencies registered.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {directList.map((comp) => (
                      <div
                        key={comp.id}
                        className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 font-mono"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{comp.name}</span>
                          <span className="text-[10px] text-amber-400 font-bold">[DIRECT]</span>
                        </div>
                        <p className="text-[11px] text-[#a1a1aa] mt-1.5 leading-relaxed">
                          {comp.impactDescription}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cascade Level 2+ (Indirect) */}
              <div className="pl-12 border-l-2 border-[#0ea5e9]/30 space-y-2">
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#0ea5e9] font-bold">
                  <CornerDownRight className="h-3.5 w-3.5" />
                  ○ INDIRECT CASCADE (DISTANCE &ge; 2) — SECONDARY CONSUMERS
                </div>

                {indirectList.length === 0 ? (
                  <div className="p-3 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#71717a] font-mono italic">
                    No downstream indirect cascading dependencies impacted.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {indirectList.map((comp) => (
                      <div
                        key={comp.id}
                        className="p-3 rounded-lg border border-[#0ea5e9]/30 bg-[#0ea5e9]/5 font-mono"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{comp.name}</span>
                          <span className="text-[10px] text-[#0ea5e9] font-bold">[INDIRECT]</span>
                        </div>
                        <p className="text-[11px] text-[#a1a1aa] mt-1.5 leading-relaxed">
                          {comp.impactDescription}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Engineering Mitigation Strategy */}
          <div className="rounded-xl border border-[#27272a] bg-[#111113] p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#27272a]">
              <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#0ea5e9]" />
                AI Engineering Mitigation Strategy
              </span>
              <span className="font-mono text-[10px] text-[#71717a]">ZERO-DOWNTIME PROTOCOL</span>
            </div>

            <div className="space-y-2.5">
              {analysisResult.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[#09090b] border border-[#27272a] text-xs font-mono"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#0ea5e9]/20 text-[#0ea5e9] text-[10px] font-bold border border-[#0ea5e9]/40">
                    0{i + 1}
                  </span>
                  <div className="leading-relaxed text-[#f4f4f5]">
                    {rec}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
