"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProjectCard } from "@/features/projects/ProjectCard";
import { CreateProjectModal } from "@/features/projects/CreateProjectModal";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/database";
import {
  Layers,
  Plus,
  Activity,
  ArrowRight,
  Cpu,
  Shield,
  Terminal,
  Server
} from "lucide-react";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this system?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full font-mono mt-10">
      {/* Top Command Center Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#27272a]">
        <div>
          <div className="text-xs text-[#0ea5e9] uppercase tracking-wider flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
            COMMAND CENTER / WORKSPACE OVERVIEW
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5] mt-1 uppercase">
            Systems Registry
          </h1>
          <p className="text-xs text-[#a1a1aa] font-sans mt-0.5">
            Active architectural workspaces, system topologies, and dependency graphs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] font-semibold text-xs h-9 px-4 rounded transition-colors flex items-center gap-1.5 shadow-none"
          >
            <Plus className="h-3.5 w-3.5" />
            Create New System →
          </Button>
        </div>
      </div>

      {/* System Activity Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-3.5 rounded border border-[#27272a] bg-[#111113]">
          <div className="text-[10px] text-[#71717a] uppercase">ACTIVE SYSTEMS</div>
          <div className="text-xl font-bold text-[#f4f4f5] mt-1">{projects.length}</div>
          <div className="text-[10px] text-[#10b981] mt-0.5">● Operational</div>
        </div>

        <div className="p-3.5 rounded border border-[#27272a] bg-[#111113]">
          <div className="text-[10px] text-[#71717a] uppercase">ORCHESTRATOR STATUS</div>
          <div className="text-xl font-bold text-[#f4f4f5] mt-1">10 NODES</div>
          <div className="text-[10px] text-[#0ea5e9] mt-0.5">LangGraph State Graph</div>
        </div>

        <div className="p-3.5 rounded border border-[#27272a] bg-[#111113]">
          <div className="text-[10px] text-[#71717a] uppercase">BLAST RADAR</div>
          <div className="text-xl font-bold text-[#f4f4f5] mt-1">BFS ACTIVE</div>
          <div className="text-[10px] text-[#a1a1aa] mt-0.5">Reverse Adjacency Traversal</div>
        </div>

        <div className="p-3.5 rounded border border-[#27272a] bg-[#111113]">
          <div className="text-[10px] text-[#71717a] uppercase">VECTOR MEMORY</div>
          <div className="text-xl font-bold text-[#f4f4f5] mt-1">768-DIM</div>
          <div className="text-[10px] text-[#a1a1aa] mt-0.5">Supabase pgvector Isolated</div>
        </div>
      </div>

      {/* Main Section: Recent Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#a1a1aa] uppercase tracking-wider font-semibold">
            Registered Systems ({projects.length})
          </span>
          <span className="text-[#71717a] text-[11px]">SORTED BY RECENT ACTIVITY</span>
        </div>

        {loading ? (
          <div className="p-12 text-center border border-[#27272a] bg-[#111113] rounded text-xs text-[#a1a1aa]">
            <span className="inline-block animate-pulse">Scanning system registry...</span>
          </div>
        ) : projects.length === 0 ? (
          /* Empty State: Architecture Focused */
          <div className="p-12 text-center border border-[#27272a] bg-[#111113] rounded space-y-4">
            <div className="h-10 w-10 mx-auto rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#71717a]">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#f4f4f5] uppercase">NO SYSTEM ARCHITECTURE</div>
              <p className="text-xs text-[#71717a] mt-1">Your workspace does not have an architecture yet.</p>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] text-xs h-8 px-4 rounded"
            >
              Generate Architecture →
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </div>

      {/* Guided Project Creation Modal */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onProjectCreated={() => fetchProjects()}
      />
    </div>
  );
}
