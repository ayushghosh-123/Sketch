"use client";

import { useEffect, useState, use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArchitectureCanvas } from "@/features/architecture/ArchitectureCanvas";
import { DocumentManagerView } from "@/features/documents/DocumentManagerView";
import { ProjectChatAssistant } from "@/features/rag/ProjectChatAssistant";
import { ImpactAnalysisView } from "@/features/impact-analysis/ImpactAnalysisView";
import { VersionHistoryView } from "@/features/versions/VersionHistoryView";
import type { Project, ProjectRequirements } from "@/types/database";
import {
  Layers,
  Network,
  FileText,
  MessageSquare,
  Activity,
  GitFork,
  Settings,
  ArrowLeft,
  Users,
  Cpu,
  Shield,
  Zap,
  Trash2,
  Terminal,
  Radio
} from "lucide-react";

function ProjectWorkspaceInner({ projectId }: { projectId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "architecture";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [project, setProject] = useState<Project | null>(null);
  const [requirements, setRequirements] = useState<ProjectRequirements | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjectData = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setProject(json.data.project);
        setRequirements(json.data.requirements);
      }
    } catch (err) {
      console.error("Failed to load project:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const handleDeleteProject = async () => {
    if (!confirm("Are you sure you want to delete this project? All architectures, documents, and vector embeddings will be permanently removed.")) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        router.push("/projects");
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-[#09090b] text-[#f4f4f5]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[#0ea5e9] border-t-transparent animate-spin" />
          <span className="text-xs text-[#71717a] font-mono">[WORKSPACE_INIT]: Loading Architecture Topology...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#09090b] text-[#f4f4f5]">
        <h3 className="text-lg font-bold text-white font-mono">PROJECT NOT FOUND</h3>
        <p className="text-xs text-[#71717a] mt-1 mb-4 font-mono">
          The requested architecture project could not be found or has been decommissioned.
        </p>
        <Link href="/projects">
          <Button size="sm" variant="outline" className="border-[#27272a] bg-[#111113] text-white hover:bg-[#18181b] font-mono text-xs">
            Back to Registry
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-68px)] overflow-hidden bg-[#09090b] text-[#f4f4f5]">
      {/* Project Workspace Command Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-[#27272a] bg-[#09090b]/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="text-[#71717a] hover:text-white p-1.5 rounded hover:bg-[#18181b] transition-colors border border-transparent hover:border-[#27272a]"
            title="Return to Registry"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10b981]" />
              <h1 className="text-xs sm:text-sm font-bold text-white font-mono truncate max-w-xs sm:max-w-md">
                {project.name}
              </h1>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#0ea5e9] uppercase">
                {project.project_type?.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="h-8 bg-[#111113] border border-[#27272a] p-0.5">
              <TabsTrigger value="architecture" className="text-[11px] font-mono gap-1.5 px-3 data-[state=active]:bg-[#18181b] data-[state=active]:text-white">
                <Network className="h-3.5 w-3.5 text-[#0ea5e9]" />
                <span className="hidden sm:inline">STUDIO</span>
              </TabsTrigger>
              <TabsTrigger value="overview" className="text-[11px] font-mono gap-1.5 px-3 data-[state=active]:bg-[#18181b] data-[state=active]:text-white">
                <Layers className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden sm:inline">SPECS</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-[11px] font-mono gap-1.5 px-3 data-[state=active]:bg-[#18181b] data-[state=active]:text-white">
                <FileText className="h-3.5 w-3.5 text-[#0ea5e9]" />
                <span className="hidden sm:inline">CORPUS & RAG</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-[11px] font-mono gap-1.5 px-3 data-[state=active]:bg-[#18181b] data-[state=active]:text-white">
                <MessageSquare className="h-3.5 w-3.5 text-[#10b981]" />
                <span className="hidden sm:inline">AI ARCHITECT</span>
              </TabsTrigger>
              <TabsTrigger value="impact" className="text-[11px] font-mono gap-1.5 px-3 data-[state=active]:bg-[#18181b] data-[state=active]:text-white">
                <Activity className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">IMPACT</span>
              </TabsTrigger>
              <TabsTrigger value="versions" className="text-[11px] font-mono gap-1.5 px-3 data-[state=active]:bg-[#18181b] data-[state=active]:text-white">
                <GitFork className="h-3.5 w-3.5 text-rose-400" />
                <span className="hidden sm:inline">VERSIONS</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-[11px] font-mono gap-1.5 px-3 data-[state=active]:bg-[#18181b] data-[state=active]:text-white">
                <Settings className="h-3.5 w-3.5 text-[#71717a]" />
                <span className="hidden sm:inline">CONFIG</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Workspace Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "architecture" && (
          <ArchitectureCanvas projectId={projectId} />
        )}

        {activeTab === "overview" && (
          <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#0ea5e9]">
                  // ARCHITECTURE REQUIREMENTS SPECIFICATION (ARS)
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  Foundational System Specifications & Constraints
                </h2>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#111113] border border-[#27272a] text-[#a1a1aa]">
                SPEC ID: [ARS-{projectId.slice(0, 6).toUpperCase()}]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#27272a] bg-[#111113]">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0ea5e9] mb-2 pb-2 border-b border-[#27272a]">
                  <Layers className="h-4 w-4" />
                  SYSTEM OVERVIEW & PURPOSE
                </div>
                <p className="text-xs text-[#f4f4f5] leading-relaxed">
                  {project.description || "No project description provided."}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#27272a] bg-[#111113]">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 mb-2 pb-2 border-b border-[#27272a]">
                  <Users className="h-4 w-4" />
                  TARGET USERS & OPERATIONAL PERSONAS
                </div>
                <p className="text-xs text-[#f4f4f5] leading-relaxed">
                  {requirements?.target_users || "General enterprise users, developers, and DevOps operators."}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#27272a] bg-[#111113]">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#10b981] mb-2 pb-2 border-b border-[#27272a]">
                  <Cpu className="h-4 w-4" />
                  PREFERRED ARCHITECTURAL STACK
                </div>
                <p className="text-xs text-[#f4f4f5] leading-relaxed font-mono">
                  {requirements?.preferred_technologies || "Next.js, Node.js, PostgreSQL, Redis, Docker, LangGraph"}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#27272a] bg-[#111113]">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-2 pb-2 border-b border-[#27272a]">
                  <Zap className="h-4 w-4" />
                  SCALABILITY & NON-FUNCTIONAL TARGETS
                </div>
                <p className="text-xs text-[#f4f4f5] leading-relaxed">
                  {requirements?.scalability_requirements || "Stateless horizontally auto-scaling API nodes, distributed caching, low-latency p99 targets."}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#27272a] bg-[#111113] md:col-span-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 mb-2 pb-2 border-b border-[#27272a]">
                  <Shield className="h-4 w-4" />
                  SECURITY, COMPLIANCE & GOVERNANCE
                </div>
                <p className="text-xs text-[#f4f4f5] leading-relaxed">
                  {requirements?.security_requirements || "TLS 1.3 encryption in transit, AES-256 at rest, JWT OAuth2 session tokens, Row-Level Security (RLS), RBAC audit logging."}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <DocumentManagerView projectId={projectId} />
        )}

        {activeTab === "chat" && (
          <ProjectChatAssistant projectId={projectId} />
        )}

        {activeTab === "impact" && (
          <ImpactAnalysisView projectId={projectId} />
        )}

        {activeTab === "versions" && (
          <VersionHistoryView
            projectId={projectId}
            onVersionRestored={() => {
              setActiveTab("architecture");
            }}
          />
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="pb-3 border-b border-[#27272a]">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#71717a]">
                // SYSTEM CONFIGURATION
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">Project Settings & Decommissioning</h2>
              <p className="text-xs text-[#a1a1aa] mt-1">Manage project metadata and lifecycle controls.</p>
            </div>

            <div className="rounded-xl border border-red-500/30 bg-red-950/10 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-red-400 font-mono pb-2 border-b border-red-500/20">
                <Trash2 className="h-4 w-4" />
                DANGER ZONE: PERMANENT SYSTEM DECOMMISSION
              </div>
              <p className="text-xs text-[#a1a1aa] mt-3 leading-relaxed">
                Permanently delete this project from the database, including all architecture components, dependency edges, document knowledge chunks, and vector index embeddings. This action cannot be reversed.
              </p>
              <div className="pt-4">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteProject}
                  className="bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold shadow-lg shadow-red-950/50"
                >
                  Decommission Project Permanently
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);

  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-xs text-[#71717a] font-mono">Initializing Command Center...</div>}>
      <ProjectWorkspaceInner projectId={projectId} />
    </Suspense>
  );
}