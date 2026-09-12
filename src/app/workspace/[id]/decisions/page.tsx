"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Project, ArchitectureDecision } from "@/types/database";
import {
  ArrowLeft,
} from "lucide-react";

export default function DecisionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);

  const [project, setProject] = useState<Project | null>(null);
  const [decisions, setDecisions] = useState<ArchitectureDecision[]>([]);
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

        // Load decisions
        const dRes = await fetch(`/api/projects/${projectId}/architecture`);
        const dJson = await dRes.json();
        if (dJson.success && dJson.data?.decisions) {
          setDecisions(dJson.data.decisions);
        }
      } catch (err) {
        console.error("Failed to load decisions:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [projectId]);

  // Fallback default decisions if none generated yet
  const displayDecisions: Array<{
    id: string;
    title: string;
    chosen: string;
    why: string;
    whySimple: string;
    alternatives: string[];
    tradeoffs: string;
  }> = decisions.length > 0
    ? decisions.map((d) => ({
        id: d.id,
        title: d.title,
        chosen: d.decision,
        why: d.reasoning || "Selected to satisfy throughput and consistency requirements.",
        whySimple: "Chosen to make your application reliable and simple to manage without complex maintenance.",
        alternatives: Array.isArray(d.alternatives) ? d.alternatives as string[] : ["Alternative Engine"],
        tradeoffs: "Requires connection pooling under extreme concurrent serverless load.",
      }))
    : [
        {
          id: "dec-1",
          title: "PRIMARY DATABASE ARCHITECTURE",
          chosen: "Supabase PostgreSQL with pgvector",
          why: "The project requires transactional relational consistency, built-in Authentication, Row-Level Security (RLS), and in-database 768-dim vector embeddings without managing separate vector databases.",
          whySimple: "PostgreSQL safely stores your application's accounts and data in organized tables, and gives you AI search all in one single place.",
          alternatives: ["Neon Serverless PostgreSQL", "MongoDB Atlas", "Firebase Firestore"],
          tradeoffs: "Neon provides serverless scale-to-zero branching, but would require separate services for user authentication and vector memory storage.",
        },
        {
          id: "dec-2",
          title: "AI ORCHESTRATION & AGENT WORKFLOWS",
          chosen: "LangGraph.js + Gemini 1.5",
          why: "Supports multi-agent state machines, cyclical graphs, deterministic schema validation, and low latency token generation.",
          whySimple: "Guides smart AI agents to work together like a team, checking each other's work before drawing your system.",
          alternatives: ["Standard Chatbot Prompts", "AutoGPT", "Custom Python Worker"],
          tradeoffs: "Requires defining strict TypeScript state schemas instead of informal string prompts.",
        },
        {
          id: "dec-3",
          title: "CLIENT & APPLICATION LAYER",
          chosen: "Next.js (App Router) + TypeScript",
          why: "Full-stack React framework providing streaming server-side rendering, React Server Components, server actions, and type safety.",
          whySimple: "Builds fast, modern web pages that load smoothly on your phone or computer.",
          alternatives: ["Vite + React SPA", "Remix", "Astro"],
          tradeoffs: "Slightly steeper learning curve than a simple static single-page client app.",
        },
        {
          id: "dec-4",
          title: "IN-MEMORY CACHE & RATE LIMITING",
          chosen: "Redis Key-Value Cache",
          why: "Sub-millisecond query caches and distributed session locks mitigate database read pressure under high traffic.",
          whySimple: "Memorizes common answers so your website opens instantly without making the database do extra work.",
          alternatives: ["In-memory Node Map", "Memcached", "Direct DB reads"],
          tradeoffs: "Requires active cache invalidation logic on data updates.",
        },
        {
          id: "dec-5",
          title: "FILE & KNOWLEDGE ASSET STORAGE",
          chosen: "Vercel Blob / Supabase Storage",
          why: "Global edge CDN object storage with signed secure download URLs and zero infrastructure management.",
          whySimple: "Safely holds uploaded PDFs, images, and files in the cloud.",
          alternatives: ["Amazon S3", "Google Cloud Storage", "Local Disk"],
          tradeoffs: "Bandwidth pricing under massive video streaming workloads.",
        },
      ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#09090b] text-[#71717a] font-mono text-xs">
        Loading decisions...
      </div>
    );
  }

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
            ARCHITECTURE DECISION RECORDS (ADR)
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5] mt-1">
            Why Sketch Chose This
          </h1>
          <p className="text-xs text-[#a1a1aa] font-sans mt-0.5">
            Transparent architectural rationale, evaluated alternatives, and trade-offs for {project?.name || "this project"}.
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

      {/* Decisions List */}
      <div className="space-y-6 pt-6">
        {displayDecisions.map((dec, idx) => (
          <div
            key={dec.id}
            className="rounded-xl border border-[#27272a] bg-[#111113] p-5 sm:p-6 space-y-4 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#27272a]">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#0ea5e9]">ADR 0{idx + 1}</span>
                <span className="text-[#71717a]">·</span>
                <h2 className="text-sm font-bold text-[#f4f4f5] uppercase">{dec.title}</h2>
              </div>
              <span className="text-[10px] text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/30 px-2 py-0.5 rounded self-start">
                ✓ ACCEPTED DECISION
              </span>
            </div>

            {/* WHAT WAS CHOSEN */}
            <div>
              <div className="text-[10px] uppercase text-[#71717a] font-semibold">WHAT WAS CHOSEN</div>
              <div className="text-base font-bold text-[#f4f4f5] mt-0.5">
                {dec.chosen}
              </div>
            </div>

            {/* WHY IT WAS CHOSEN */}
            <div>
              <div className="text-[10px] uppercase text-[#0ea5e9] font-semibold">
                {explainSimply ? "WHY IT HELPS YOU (SIMPLE EXPLANATION)" : "WHY IT WAS CHOSEN (TECHNICAL RATIONALE)"}
              </div>
              <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed font-sans mt-1">
                {explainSimply ? dec.whySimple : dec.why}
              </p>
            </div>

            {/* ALTERNATIVES CONSIDERED */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#27272a]/60">
              <div>
                <div className="text-[10px] uppercase text-[#71717a] font-semibold">
                  ALTERNATIVES EVALUATED
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {dec.alternatives.map((alt) => (
                    <span
                      key={alt}
                      className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-xs text-[#71717a]"
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase text-[#f59e0b] font-semibold">
                  TRADE-OFFS & CONSTRAINTS
                </div>
                <p className="text-xs text-[#a1a1aa] font-sans mt-1 leading-relaxed">
                  {dec.tradeoffs}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
