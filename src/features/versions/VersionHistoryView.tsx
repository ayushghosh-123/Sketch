"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { ProjectVersion, ArchitectureComponent, ComponentDependency } from "@/types/database";
import {
  GitFork,
  Clock,
  RotateCcw,
  Plus,
  Eye,
  ArrowRight,
  GitCommit,
  CheckCircle2,
  AlertCircle,
  Layers,
  Split,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  Sliders,
  Radio,
  Check
} from "lucide-react";

interface VersionHistoryViewProps {
  projectId: string;
  onVersionRestored?: () => void;
}

interface ComponentDiffItem {
  id: string;
  name: string;
  technology: string;
  component_type: string;
  diffStatus: "added" | "removed" | "modified" | "unchanged";
  previousTech?: string;
  previousType?: string;
}

export function VersionHistoryView({ projectId, onVersionRestored }: VersionHistoryViewProps) {
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [inspectedVersionId, setInspectedVersionId] = useState<string | null>(null);
  const [newSnapshotDesc, setNewSnapshotDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Comparison State
  const [compareVersionAId, setCompareVersionAId] = useState<string | null>(null);
  const [compareVersionBId, setCompareVersionBId] = useState<string | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Current live components for comparison
  const [liveComponents, setLiveComponents] = useState<ArchitectureComponent[]>([]);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const [vRes, aRes] = await Promise.all([
        fetch(`/api/projects/${projectId}/versions`),
        fetch(`/api/projects/${projectId}/architecture`),
      ]);

      const vJson = await vRes.json();
      const aJson = await aRes.json();

      if (vJson.success && Array.isArray(vJson.data)) {
        const sorted = (vJson.data as ProjectVersion[]).sort(
          (a, b) => b.version_number - a.version_number
        );
        setVersions(sorted);
        if (sorted.length >= 2) {
          setCompareVersionAId(sorted[0].id);
          setCompareVersionBId(sorted[1].id);
        } else if (sorted.length === 1) {
          setCompareVersionAId("live");
          setCompareVersionBId(sorted[0].id);
        }
      }

      if (aJson.success && aJson.data?.components) {
        setLiveComponents(aJson.data.components);
      }
    } catch (err) {
      console.error("Failed to load versions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, [projectId]);

  const handleCreateSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSnapshotDesc.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: newSnapshotDesc.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setNewSnapshotDesc("");
        fetchVersions();
      }
    } catch (err) {
      console.error("Failed to create snapshot:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (!confirm("Are you sure you want to restore this version? Your current architecture graph will be rolled back to this snapshot.")) {
      return;
    }

    setRestoringId(versionId);
    try {
      const res = await fetch(`/api/projects/${projectId}/versions/${versionId}/restore`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        alert("Version restored successfully to workspace canvas!");
        if (onVersionRestored) onVersionRestored();
        fetchVersions();
      }
    } catch (err) {
      console.error("Restore failed:", err);
    } finally {
      setRestoringId(null);
    }
  };

  const startComparison = (targetVersionId: string) => {
    if (versions.length > 0) {
      setCompareVersionAId(versions[0].id); // Latest/Head
      setCompareVersionBId(targetVersionId);
      setIsCompareOpen(true);
    }
  };

  // Compute diff between Version A and Version B
  const diffResults = useMemo(() => {
    const getComponentsForId = (id: string | null): ArchitectureComponent[] => {
      if (!id) return [];
      if (id === "live") return liveComponents;
      const v = versions.find((ver) => ver.id === id);
      return v?.architecture_snapshot?.components || [];
    };

    const compsA = getComponentsForId(compareVersionAId);
    const compsB = getComponentsForId(compareVersionBId);

    const mapA = new Map(compsA.map((c) => [c.name.toLowerCase(), c]));
    const mapB = new Map(compsB.map((c) => [c.name.toLowerCase(), c]));

    const diffList: ComponentDiffItem[] = [];

    // Check components in B against A
    mapB.forEach((compB, name) => {
      const compA = mapA.get(name);
      if (!compA) {
        diffList.push({
          id: compB.id,
          name: compB.name,
          technology: compB.technology || "Generic",
          component_type: compB.component_type,
          diffStatus: "added",
        });
      } else {
        const isModified =
          compA.technology !== compB.technology ||
          compA.component_type !== compB.component_type;

        diffList.push({
          id: compB.id,
          name: compB.name,
          technology: compB.technology || "Generic",
          component_type: compB.component_type,
          diffStatus: isModified ? "modified" : "unchanged",
          previousTech: compA.technology || "Generic",
          previousType: compA.component_type,
        });
      }
    });

    // Check removed components in A not present in B
    mapA.forEach((compA, name) => {
      if (!mapB.has(name)) {
        diffList.push({
          id: compA.id,
          name: compA.name,
          technology: compA.technology || "Generic",
          component_type: compA.component_type,
          diffStatus: "removed",
        });
      }
    });

    const added = diffList.filter((d) => d.diffStatus === "added");
    const modified = diffList.filter((d) => d.diffStatus === "modified");
    const removed = diffList.filter((d) => d.diffStatus === "removed");
    const unchanged = diffList.filter((d) => d.diffStatus === "unchanged");

    return { diffList, added, modified, removed, unchanged };
  }, [compareVersionAId, compareVersionBId, versions, liveComponents]);

  const latestVersion = versions[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 text-[#f4f4f5]">
      {/* Header & Meta telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#f97316]">
              // IMMUTABLE CHECKPOINTS // GIT-STYLE ARCHITECTURE TIMELINE
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#f97316]" />
            <span className="font-mono text-[10px] text-[#f97316]">
              HEAD: {latestVersion ? `v${latestVersion.version_number}.0` : "INITIAL"}
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
            <GitFork className="h-5 w-5 text-[#f97316]" />
            Architecture Version History & Diff Engine
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-1 font-sans">
            Browse immutable architecture snapshots generated by LangGraph.js synthesis or tagged manually. Compare graph diffs across versions.
          </p>
        </div>

        {/* Snapshot creator input */}
        <form onSubmit={handleCreateSnapshot} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tag snapshot (e.g. Pre-PostgreSQL RFC)"
            value={newSnapshotDesc}
            onChange={(e) => setNewSnapshotDesc(e.target.value)}
            className="h-9 px-3 rounded-md bg-[#111111] border border-white/10 text-xs text-white placeholder-[#71717a] focus:outline-none focus:ring-1 focus:ring-[#f97316] font-mono w-60"
          />
          <Button
            type="submit"
            size="sm"
            disabled={isCreating || !newSnapshotDesc.trim()}
            className="bg-[#f97316] hover:bg-[#ea580c] text-white font-mono font-bold text-xs chai-btn-primary shadow-lg shadow-orange-950/40 cursor-pointer"
          >
            {isCreating ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                Tagging...
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Commit Snapshot
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Comparison Drawer / Side-by-Side Diff Section */}
      {isCompareOpen && (
        <div className="rounded-xl border border-white/10 bg-[#111111] p-5 space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Split className="h-4 w-4 text-[#f97316]" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Side-by-Side Architectural Graph Diff
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#a1a1aa]">BASE (A):</span>
                <select
                  value={compareVersionAId || ""}
                  onChange={(e) => setCompareVersionAId(e.target.value)}
                  className="h-8 px-2 rounded bg-[#09090b] border border-[#27272a] text-xs text-white font-mono"
                >
                  <option value="live">Live Canvas (Current)</option>
                  {versions.map((v) => (
                    <option key={v.id} value={v.id}>
                      v{v.version_number}.0 ({v.description?.slice(0, 20) || "Snapshot"})
                    </option>
                  ))}
                </select>

                <ArrowRight className="h-3.5 w-3.5 text-[#71717a]" />

                <span className="text-[#a1a1aa]">COMPARE (B):</span>
                <select
                  value={compareVersionBId || ""}
                  onChange={(e) => setCompareVersionBId(e.target.value)}
                  className="h-8 px-2 rounded bg-[#09090b] border border-[#27272a] text-xs text-white font-mono"
                >
                  {versions.map((v) => (
                    <option key={v.id} value={v.id}>
                      v{v.version_number}.0 ({v.description?.slice(0, 20) || "Snapshot"})
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCompareOpen(false)}
                className="h-8 text-xs font-mono text-[#71717a] hover:text-white"
              >
                Close Diff
              </Button>
            </div>
          </div>

          {/* Diff Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg border border-[#10b981]/30 bg-[#10b981]/5">
              <div className="text-[10px] text-[#10b981] uppercase tracking-wider">
                + ADDED NODES
              </div>
              <div className="text-base font-bold text-white mt-1">
                {diffResults.added.length} Components
              </div>
            </div>

            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
              <div className="text-[10px] text-amber-400 uppercase tracking-wider">
                ~ MODIFIED NODES
              </div>
              <div className="text-base font-bold text-white mt-1">
                {diffResults.modified.length} Components
              </div>
            </div>

            <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/5">
              <div className="text-[10px] text-red-400 uppercase tracking-wider">
                - REMOVED NODES
              </div>
              <div className="text-base font-bold text-white mt-1">
                {diffResults.removed.length} Components
              </div>
            </div>

            <div className="p-3 rounded-lg border border-[#27272a] bg-[#09090b]">
              <div className="text-[10px] text-[#71717a] uppercase tracking-wider">
                = UNCHANGED NODES
              </div>
              <div className="text-base font-bold text-white mt-1">
                {diffResults.unchanged.length} Components
              </div>
            </div>
          </div>

          {/* Diff Component List */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-[#a1a1aa] font-semibold">
              Component Diff Breakdown
            </div>

            {diffResults.diffList.length === 0 ? (
              <div className="p-4 rounded bg-[#09090b] border border-[#27272a] text-xs font-mono text-[#71717a] text-center">
                Both versions possess identical component topologies.
              </div>
            ) : (
              <div className="space-y-1.5 font-mono text-xs">
                {diffResults.diffList.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-4 ${
                      item.diffStatus === "added"
                        ? "border-[#10b981]/30 bg-[#10b981]/5"
                        : item.diffStatus === "modified"
                        ? "border-amber-500/30 bg-amber-500/5"
                        : item.diffStatus === "removed"
                        ? "border-red-500/30 bg-red-500/5"
                        : "border-[#27272a] bg-[#09090b]/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-bold text-xs px-2 py-0.5 rounded uppercase ${
                          item.diffStatus === "added"
                            ? "bg-[#10b981]/20 text-[#10b981]"
                            : item.diffStatus === "modified"
                            ? "bg-amber-500/20 text-amber-400"
                            : item.diffStatus === "removed"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-[#27272a] text-[#71717a]"
                        }`}
                      >
                        {item.diffStatus === "added" && "+ ADDED"}
                        {item.diffStatus === "modified" && "~ MODIFIED"}
                        {item.diffStatus === "removed" && "- REMOVED"}
                        {item.diffStatus === "unchanged" && "= UNCHANGED"}
                      </span>

                      <div>
                        <div className="font-bold text-white text-xs">{item.name}</div>
                        <div className="text-[11px] text-[#a1a1aa]">
                          Type: {item.component_type.toUpperCase()} | Tech: {item.technology}
                        </div>
                      </div>
                    </div>

                    {item.diffStatus === "modified" && (
                      <div className="text-right text-[11px] text-[#71717a]">
                        <span>Was: {item.previousTech} ({item.previousType})</span>
                        <ArrowRight className="h-3 w-3 inline mx-1.5 text-amber-400" />
                        <span className="text-amber-400 font-bold">{item.technology}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Git-Style Vertical Commit Timeline */}
      {loading ? (
        <div className="space-y-4 font-mono">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 rounded-xl bg-[#111113] border border-[#27272a] animate-pulse" />
          ))}
        </div>
      ) : versions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#27272a] bg-[#111113]/40 p-12 text-center font-mono">
          <GitFork className="h-8 w-8 text-[#52525b] mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-white">No version snapshots recorded yet</h4>
          <p className="text-xs text-[#71717a] mt-1 max-w-sm mx-auto">
            Generate an architecture using the AI Architect studio, or tag an immutable checkpoint snapshot using the input above.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
          {versions.map((ver, idx) => {
            const isHead = idx === 0;
            const isInspected = inspectedVersionId === ver.id;
            const compCount = ver.architecture_snapshot?.components?.length || 0;
            const depCount = ver.architecture_snapshot?.dependencies?.length || 0;
            const commitHash = ver.id.slice(0, 7).toUpperCase();

            return (
              <div key={ver.id} className="relative group">
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-[#000000] transition-transform ${
                    isHead
                      ? "border-[#f97316] text-[#f97316] shadow-[0_0_12px_rgba(249,115,22,0.5)]"
                      : "border-white/20 text-[#71717a]"
                  }`}
                >
                  {isHead ? (
                    <span className="h-2 w-2 rounded-full bg-[#f97316]" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#71717a]" />
                  )}
                </div>

                {/* Commit Card */}
                <div
                  className={`rounded-xl border transition-colors ${
                    isHead
                      ? "border-[#f97316]/40 bg-[#111111]"
                      : "border-white/10 bg-[#111111] hover:border-white/20"
                  }`}
                >
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-12 shrink-0 items-center justify-center rounded border font-mono font-bold text-xs ${
                          isHead
                            ? "border-[#f97316]/40 bg-[#f97316]/10 text-[#f97316]"
                            : "border-white/10 bg-[#18181b] text-[#a1a1aa]"
                        }`}
                      >
                        v{ver.version_number}.0
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white font-sans">
                            {ver.description || `Architecture Checkpoint v${ver.version_number}`}
                          </h4>

                          {isHead && (
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/30 font-bold">
                              ● CURRENT HEAD
                            </span>
                          )}

                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#18181b] border border-white/10 text-[#71717a]">
                            COMMIT {commitHash}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-[#71717a] mt-1 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(ver.created_at)}
                          </span>
                          <span>*</span>
                          <span>{compCount} components</span>
                          <span>*</span>
                          <span>{depCount} links</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0 font-mono">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startComparison(ver.id)}
                        className="h-8 px-2.5 text-xs border-white/10 bg-[#18181b] text-[#a1a1aa] hover:text-white hover:bg-white/10 cursor-pointer"
                      >
                        <Split className="h-3.5 w-3.5 mr-1 text-[#f97316]" />
                        Compare
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInspectedVersionId(isInspected ? null : ver.id)}
                        className="h-8 px-2.5 text-xs border-white/10 bg-[#18181b] text-[#a1a1aa] hover:text-white hover:bg-white/10 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1 text-[#71717a]" />
                        {isInspected ? "Hide" : "Inspect"}
                      </Button>

                      {!isHead && (
                        <Button
                          size="sm"
                          onClick={() => handleRestoreVersion(ver.id)}
                          disabled={restoringId === ver.id}
                          className="h-8 px-3 text-xs font-semibold bg-[#18181b] hover:bg-[#27272a] text-white border border-white/10 cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5 mr-1 text-[#f97316]" />
                          {restoringId === ver.id ? "Restoring..." : "Restore"}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Inspected Components Drawer */}
                  {isInspected && (
                    <div className="px-4 pb-4 pt-3 border-t border-white/10 bg-[#000000]/90 text-xs font-mono">
                      <div className="flex items-center justify-between text-[11px] text-[#a1a1aa] mb-2 pb-1 border-b border-white/10">
                        <span>SNAPSHOT COMPONENTS TOPOLOGY ({compCount})</span>
                        <span className="text-[#f97316]">TIMESTAMP: {ver.created_at}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {ver.architecture_snapshot?.components?.map((c) => (
                          <div
                            key={c.id}
                            className="p-2.5 rounded bg-[#111111] border border-white/10"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white truncate font-sans">{c.name}</span>
                              <span className="text-[10px] text-[#71717a] uppercase">
                                {c.component_type}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#f97316] mt-0.5 truncate">
                              {c.technology || "No tech specified"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
