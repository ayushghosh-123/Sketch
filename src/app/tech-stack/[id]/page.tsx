"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/database";
import {
  ArrowLeft,
  Cpu,
  Layers,
  Monitor,
  Server,
  Database,
  Bot,
  HardDrive,
  Cloud,
  CheckCircle2,
  Sliders
} from "lucide-react";

export default function TechStackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);

  const [project, setProject] = useState<Project | null>(null);
  const [explainSimply, setExplainSimply] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const pRes = await fetch(`/api/projects/${projectId}`);
        const pJson = await pRes.json();
        if (pJson.success && pJson.data?.project) {
          setProject(pJson.data.project);
        }
      } catch (err) {
        console.error("Failed to load project:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [projectId]);

  const stackTiers = [
    {
      category: "FRONTEND",
      name: "Next.js & TypeScript",
      icon: Monitor,
      color: "text-[#38bdf8]",
      technicalWhy: "Full-stack React framework with React Server Components, streaming SSR, edge middleware, and end-to-end type safety.",
      simpleWhy: "Creates clean, super-fast web pages that work effortlessly on laptops and mobile devices.",
    },
    {
      category: "DATABASE",
      name: "Supabase PostgreSQL",
      icon: Database,
      color: "text-[#10b981]",
      technicalWhy: "ACID compliant relational data persistence with built-in Auth, Row-Level Security, and pgvector extension.",
      simpleWhy: "Safely stores your user accounts, tables, and records in an organized, rock-solid database.",
    },
    {
      category: "AI & INTELLIGENCE",
      name: "Gemini 1.5",
      icon: Bot,
      color: "text-[#a855f7]",
      technicalWhy: "High throughput multimodal LLM with 1M+ context window and low latency structured JSON generation.",
      simpleWhy: "The smart AI brain that reads notes, evaluates technical options, and generates system plans.",
    },
    {
      category: "AGENT WORKFLOW",
      name: "LangGraph.js",
      icon: Cpu,
      color: "text-[#0ea5e9]",
      technicalWhy: "Supports stateful cyclical multi-agent workflows, branching conditions, and runtime Zod validation.",
      simpleWhy: "Coordinates AI agents like a disciplined engineering team, reviewing steps before drawing diagrams.",
    },
    {
      category: "FILE STORAGE",
      name: "Vercel Blob",
      icon: HardDrive,
      color: "text-[#f59e0b]",
      technicalWhy: "Edge-based object storage with signed secure upload URLs and global CDN asset distribution.",
      simpleWhy: "Holds uploaded PDFs, files, and images securely in the cloud.",
    },
    {
      category: "DEPLOYMENT & HOSTING",
      name: "Vercel Cloud",
      icon: Cloud,
      color: "text-[#f43f5e]",
      technicalWhy: "Global Edge Network deployment with automatic HTTPS, instant preview rollouts, and zero server maintenance.",
      simpleWhy: "Keeps your website online worldwide 24/7 without needing you to configure complex servers.",
    },
  ];

  return (
    <div className="flex-1 bg-[#09090b] text-[#f4f4f5] min-h-[calc(100vh-68px)] p-4 sm:p-8 max-w-5xl mx-auto w-full font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#27272a]">
        <div>
          <Link
            href={`/workspace/${projectId}`}
            className="text-xs text-[#71717a] hover:text-[#0ea5e9] flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Canvas
          </Link>
          <div className="text-xs text-[#0ea5e9] uppercase tracking-wider font-bold">
            TECHNOLOGY STACK SPECIFICATION
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5] mt-1">
            Tech Stack Decisions
          </h1>
          <p className="text-xs text-[#a1a1aa] font-sans mt-0.5">
            Architectural selection for {project?.name || "this project"}.
          </p>
        </div>

        {/* Explain Simply Mode Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto p-1.5 rounded-lg bg-[#111113] border border-[#27272a]">
          <span className="text-[11px] text-[#a1a1aa] px-1">Explain Simply</span>
          <button
            onClick={() => setExplainSimply(!explainSimply)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              explainSimply ? "bg-[#0ea5e9]" : "bg-[#27272a]"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                explainSimply ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Stack Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        {stackTiers.map((tier) => {
          const Icon = tier.icon;

          return (
            <div
              key={tier.category}
              className="rounded-xl border border-[#27272a] bg-[#111113] p-5 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center ${tier.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] uppercase text-[#71717a] font-bold">
                    {tier.category}
                  </span>
                </div>
                <span className="text-[10px] text-[#10b981] flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="h-3 w-3" /> VERIFIED
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#f4f4f5]">{tier.name}</h3>
              </div>

              <div>
                <div className="text-[10px] uppercase text-[#0ea5e9] font-semibold">
                  {explainSimply ? "WHY THIS HELPS YOU" : "WHY SKETCH CHOSE THIS"}
                </div>
                <p className="text-xs text-[#a1a1aa] font-sans mt-1 leading-relaxed">
                  {explainSimply ? tier.simpleWhy : tier.technicalWhy}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="pt-8 flex justify-center">
        <Link href={`/workspace/${projectId}`}>
          <Button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] font-semibold text-xs h-9 px-5">
            Return to Visual Architecture Canvas →
          </Button>
        </Link>
      </div>
    </div>
  );
}
