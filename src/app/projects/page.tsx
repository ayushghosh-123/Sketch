"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "@/features/projects/ProjectCard";
import { CreateProjectModal } from "@/features/projects/CreateProjectModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Project } from "@/types/database";
import {
  Layers,
  Plus,
  Search,
  Filter,
  FolderKanban,
  Radio,
  Network
} from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
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
    if (!confirm("Are you sure you want to delete this project?")) return;
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

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    const matchesType =
      selectedType === "all" || p.project_type?.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const filterTypes = [
    { value: "all", label: "All Systems" },
    { value: "microservices", label: "Microservices" },
    { value: "ai_agent_system", label: "AI Agents" },
    { value: "event_driven", label: "Event Driven" },
    { value: "serverless", label: "Serverless" },
  ];

  return (
    <div className="flex-1 space-y-6 mt-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full text-[#f4f4f5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#27272a]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#0ea5e9]">
              // SYSTEMS REGISTRY // ARCHITECTURE REPOSITORY
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            <span className="font-mono text-[10px] text-[#10b981]">SYSTEM REGISTRY ONLINE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-[#0ea5e9]" />
            Architecture Projects
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Browse, model, and deploy enterprise architectures, microservice graphs, and multi-agent workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded bg-[#111113] border border-[#27272a] text-[#a1a1aa]">
            TOTAL: <span className="text-white font-bold">{projects.length}</span>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] font-mono font-bold text-xs shadow-lg shadow-sky-950/40"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Architecture
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-mono text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#71717a]" />
          <Input
            placeholder="Search systems by keyword, protocol, stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 bg-[#111113] border-[#27272a] text-xs text-white placeholder-[#71717a] focus:ring-1 focus:ring-[#0ea5e9]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <Filter className="h-3.5 w-3.5 text-[#71717a] mr-1 shrink-0" />
          {filterTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => setSelectedType(t.value)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                selectedType === t.value
                  ? "bg-[#0ea5e9]/20 text-[#0ea5e9] border border-[#0ea5e9]/40"
                  : "bg-[#111113] text-[#71717a] hover:text-white border border-[#27272a]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-mono">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-56 rounded-xl border border-[#27272a] bg-[#111113] animate-pulse"
            />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#27272a] bg-[#111113]/40 p-12 text-center font-mono">
          <Layers className="h-10 w-10 text-[#52525b] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white">No architecture projects found</h3>
          <p className="text-xs text-[#71717a] max-w-sm mx-auto mt-1 mb-4">
            {search || selectedType !== "all"
              ? "No architectures match your active filter."
              : "Initialize your first software architecture model to begin AI synthesis."}
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] font-mono font-bold text-xs"
          >
            Create Architecture Blueprint
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onProjectCreated={() => {
          fetchProjects();
        }}
      />
    </div>
  );
}
