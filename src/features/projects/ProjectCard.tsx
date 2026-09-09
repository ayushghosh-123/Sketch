"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types/database";
import {
  ArrowRight,
  Trash2,
  Cpu,
  Layers
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <div className="rounded border border-[#27272a] bg-[#111113] p-5 hover:border-[#0ea5e9]/50 hover:bg-[#18181b] transition-all font-mono flex flex-col justify-between group">
      <div>
        {/* Top: System Type and Delete Action */}
        <div className="flex items-center justify-between text-xs text-[#71717a] pb-2 border-b border-[#27272a]/60">
          <span className="uppercase text-[10px] tracking-wider text-[#0ea5e9]">
            {project.project_type?.replace(/_/g, " ") || "DISTRIBUTED SYSTEM"}
          </span>
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(project.id);
              }}
              className="text-[#71717a] hover:text-[#ef4444] transition-colors p-1"
              title="Delete system"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Project Name */}
        <Link href={`/projects/${project.id}`}>
          <h3 className="text-sm font-bold text-[#f4f4f5] group-hover:text-[#0ea5e9] transition-colors mt-3 uppercase tracking-tight line-clamp-1">
            {project.name}
          </h3>
        </Link>

        {/* System Description */}
        <p className="text-xs text-[#a1a1aa] line-clamp-2 mt-1.5 leading-relaxed font-sans">
          {project.description || "Active software system architecture."}
        </p>

        {/* System Status */}
        <div className="mt-4 pt-3 border-t border-[#27272a]/60">
          <div className="text-[10px] uppercase text-[#71717a]">SYSTEM STATUS</div>
          <div className="text-xs font-semibold text-[#10b981] flex items-center gap-1.5 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            ● READY
          </div>
        </div>

        {/* Grid Attributes: Components & Documents */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded bg-[#09090b] border border-[#27272a]">
            <div className="text-[9px] text-[#71717a] uppercase">COMPONENTS</div>
            <div className="text-xs font-bold text-[#f4f4f5] mt-0.5">12 NODES</div>
          </div>
          <div className="p-2 rounded bg-[#09090b] border border-[#27272a]">
            <div className="text-[9px] text-[#71717a] uppercase">DOCUMENTS</div>
            <div className="text-xs font-bold text-[#f4f4f5] mt-0.5">6 SPECS</div>
          </div>
        </div>
      </div>

      {/* Footer: Last Updated & Open Button */}
      <div className="mt-4 pt-3 border-t border-[#27272a]/60 flex items-center justify-between text-[11px] text-[#71717a]">
        <div>
          UPDATED <span className="text-[#a1a1aa]">{formatDate(project.updated_at)}</span>
        </div>
        <Link
          href={`/projects/${project.id}`}
          className="text-[#0ea5e9] hover:text-[#38bdf8] flex items-center gap-1 font-semibold transition-colors"
        >
          OPEN <span>→</span>
        </Link>
      </div>
    </div>
  );
}
