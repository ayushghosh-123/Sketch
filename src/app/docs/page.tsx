"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  Network,
  Cpu,
  Layers,
  Database,
  Shield,
  Zap,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function DocumentationPage() {
  return (
    <div className="flex-1 bg-[#09090b] text-[#f4f4f5] min-h-[calc(100vh-68px)] p-4 sm:p-8 max-w-5xl mx-auto w-full font-sans">
      {/* Top Header */}
      <div className="pb-6 border-b border-[#27272a] space-y-2">
        <Link
          href="/"
          className="text-xs font-mono text-[#71717a] hover:text-[#0ea5e9] flex items-center gap-1 mb-2 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
        </Link>
        <div className="text-xs font-mono text-[#0ea5e9] uppercase tracking-wider font-bold">
          SKETCH DOCUMENTATION & SYSTEM MANUAL
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f4f4f5]">
          How Sketch Works
        </h1>
        <p className="text-sm text-[#a1a1aa] max-w-2xl font-normal leading-relaxed">
          Comprehensive guide to the Sketch multi-agent architecture, the two workflow paths,
          pgvector semantic RAG, and visual canvas editing.
        </p>
      </div>

      {/* Docs Content */}
      <div className="space-y-10 pt-8 font-mono text-xs">
        {/* Section 1: The Core Philosophy & The Two Paths */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-[#f4f4f5] uppercase border-b border-[#27272a] pb-2 flex items-center gap-2 font-sans">
            <span className="text-[#0ea5e9]">01</span> The Core Philosophy & The Two Paths
          </h2>
          <p className="text-xs text-[#a1a1aa] font-sans leading-relaxed">
            The fundamental principle of Sketch is that <strong>the user does not need to have research documents</strong>.
            If you only bring an idea, Sketch researches the technologies, frameworks, and architecture for you.
            If you already have research (PDFs, notes, RFCs), Sketch ingests and uses it.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-[#27272a] bg-[#111113] space-y-2">
              <div className="text-[10px] text-[#0ea5e9] font-bold uppercase">PATH 1: USER HAS DOCUMENTS</div>
              <div className="text-xs text-[#f4f4f5] leading-relaxed">
                User Idea + Uploaded Documents → RAG Agent → Extracted Project Context → Research Agent → Decision Agent → Canvas Agent → Editable Canvas
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#27272a] bg-[#111113] space-y-2">
              <div className="text-[10px] text-[#10b981] font-bold uppercase">PATH 2: USER HAS NO DOCUMENTS</div>
              <div className="text-xs text-[#f4f4f5] leading-relaxed">
                User Idea → Research Agent → Decision Agent → Validation Step → Canvas Agent → Editable Canvas
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: The Multi-Agent Pipeline */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-[#f4f4f5] uppercase border-b border-[#27272a] pb-2 flex items-center gap-2 font-sans">
            <span className="text-[#0ea5e9]">02</span> LangGraph.js Multi-Agent Architecture
          </h2>
          <div className="space-y-3 font-sans text-xs text-[#a1a1aa] leading-relaxed">
            <p>
              Sketch uses <strong>LangGraph.js</strong> in TypeScript to coordinate autonomous specialized agents:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-[#f4f4f5]">Input Orchestrator:</strong> Receives user idea, metadata, and preferences; checks whether uploaded documents exist; routes to RAG or directly to Research.
              </li>
              <li>
                <strong className="text-[#f4f4f5]">RAG Agent:</strong> Parses PDFs, DOCX, TXT, and Markdown files; stores embeddings in Supabase pgvector; answers key questions about existing knowledge and constraints.
              </li>
              <li>
                <strong className="text-[#f4f4f5]">Research Agent:</strong> Evaluates technological alternatives for Frontend, Backend, Database, AI, and Storage; assesses scalability, budget, and performance.
              </li>
              <li>
                <strong className="text-[#f4f4f5]">Decision Agent:</strong> Formulates layers, components, connections, technology choices, and architectural decision records with trade-offs.
              </li>
              <li>
                <strong className="text-[#f4f4f5]">Validation Step:</strong> Enforces architectural integrity, checks for missing tiers, broken edges, or security oversights before canvas generation.
              </li>
              <li>
                <strong className="text-[#f4f4f5]">Canvas Agent:</strong> Turns system plans into visual React Flow nodes and edges with automatic Dagre hierarchical layouts.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: AI Editing & Blast Radius Analysis */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-[#f4f4f5] uppercase border-b border-[#27272a] pb-2 flex items-center gap-2 font-sans">
            <span className="text-[#0ea5e9]">03</span> Natural Language AI Editing
          </h2>
          <p className="text-xs text-[#a1a1aa] font-sans leading-relaxed">
            From the bottom command bar in the Sketch Workspace, users can instruct Sketch in natural English:
          </p>
          <div className="p-4 rounded-xl border border-[#27272a] bg-[#111113] space-y-2 font-mono">
            <div className="text-[11px] text-[#0ea5e9]">✦ Example Commands:</div>
            <div className="text-xs text-[#f4f4f5] space-y-1">
              <div>&bull; &ldquo;Add Redis caching.&rdquo;</div>
              <div>&bull; &ldquo;Add a mobile application.&rdquo;</div>
              <div>&bull; &ldquo;Make the system more scalable.&rdquo;</div>
              <div>&bull; &ldquo;Add authentication.&rdquo;</div>
              <div>&bull; &ldquo;Add a payment service.&rdquo;</div>
            </div>
            <p className="text-[11px] text-[#71717a] font-sans pt-2">
              Before applying, Sketch shows a <strong>Proposed Changes Preview</strong> (ADD, MODIFY, REMOVE)
              and lets you cancel or apply with instant Undo support.
            </p>
          </div>
        </section>

        {/* Action button */}
        <div className="pt-4 flex justify-center">
          <Link href="/dashboard">
            <Button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] font-mono font-semibold text-xs h-10 px-6">
              Open Sketch Dashboard →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
