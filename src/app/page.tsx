"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroThinkingAnimation } from "@/components/home/HeroThinkingAnimation";
import {
  ArrowRight,
  Sparkles,
  Layers,
  FileText,
  Database,
  Cpu,
  Shield,
  Zap,
  CheckCircle2,
  ChevronRight,
  GitBranch,
  Network,
  Lock,
  ArrowUpRight,
  FileCode,
  Sliders,
  MoveRight
} from "lucide-react";

export default function LandingPage() {
  const [activePath, setActivePath] = useState<"no-docs" | "has-docs">("has-docs");

  // Selected node in interactive system preview
  const [selectedNode, setSelectedNode] = useState<"client" | "api" | "auth" | "backend" | "ai" | "db">("db");

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-[#f4f4f5] selection:bg-[#0ea5e9]/30 selection:text-white font-sans">
      {/* ====================================================================
          HERO SECTION
          ==================================================================== */}
      <section className="relative pt-20 pb-20 md:pt-28 md:pb-28 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        {/* Subtle Technical Label */}
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[11px] font-mono text-[#a1a1aa]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0ea5e9]" />
            AI SOFTWARE ARCHITECTURE WORKSPACE
          </span>
          <span className="text-[11px] font-mono text-[#71717a]">/</span>
          <span className="text-[11px] font-mono text-[#71717a]">DESCRIBE · RESEARCH · SKETCH</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#f4f4f5] leading-[1.08]">
              Sketch your software <br />
              <span className="text-[#0ea5e9]">before you build it.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed font-normal">
              Start with an idea. Add your research if you have it.
              Sketch researches the rest, decides the best approach,
              and creates your software architecture.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] font-mono font-medium text-xs h-11 px-5 rounded shadow-none transition-colors"
                >
                  Sign Up & Sketch
                  <ArrowRight className="h-3.5 w-3.5 ml-2" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#27272a] bg-[#111113] text-[#f4f4f5] hover:bg-[#18181b] font-mono text-xs h-11 px-5 rounded shadow-none"
                >
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Core Promise Indicators */}
            <div className="pt-6 border-t border-[#27272a] grid grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <div className="text-[10px] text-[#71717a] uppercase">01 / INPUT</div>
                <div className="text-xs font-semibold text-[#f4f4f5] mt-1">Idea or Documents</div>
              </div>
              <div>
                <div className="text-[10px] text-[#71717a] uppercase">02 / INTELLIGENCE</div>
                <div className="text-xs font-semibold text-[#0ea5e9] mt-1">Autonomous Research</div>
              </div>
              <div>
                <div className="text-[10px] text-[#71717a] uppercase">03 / OUTPUT</div>
                <div className="text-xs font-semibold text-[#10b981] mt-1">Doodle Blueprint</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Step-by-Step Thinking & Doodle Sketch Canvas */}
          <div className="lg:col-span-6">
            <HeroThinkingAnimation />
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION: CORE PRODUCT WORKFLOW (TWO PATHS)
          ==================================================================== */}
      <section id="how-it-works" className="py-20 border-t border-[#27272a] bg-[#111113]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0ea5e9]">
              The Core Principle
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5] mt-2 font-mono uppercase">
              You do not need to have research documents.
            </h2>
            <p className="text-sm text-[#a1a1aa] mt-2 font-normal">
              If you only have an idea, Sketch researches the problem for you.
              If you already have research, Sketch understands and incorporates it.
            </p>

            {/* Path Switcher */}
            <div className="flex items-center gap-2 mt-6">
              <button
                onClick={() => setActivePath("has-docs")}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                  activePath === "has-docs"
                    ? "bg-[#18181b] text-[#0ea5e9] border border-[#0ea5e9]"
                    : "bg-[#09090b] text-[#71717a] border border-[#27272a] hover:text-[#f4f4f5]"
                }`}
              >
                Path 1: User Has Documents
              </button>
              <button
                onClick={() => setActivePath("no-docs")}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                  activePath === "no-docs"
                    ? "bg-[#18181b] text-[#0ea5e9] border border-[#0ea5e9]"
                    : "bg-[#09090b] text-[#71717a] border border-[#27272a] hover:text-[#f4f4f5]"
                }`}
              >
                Path 2: User Has No Documents
              </button>
            </div>
          </div>

          {/* Dynamic Path Diagram */}
          {activePath === "has-docs" ? (
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 font-mono text-xs">
              <div className="p-3.5 rounded border border-[#27272a] bg-[#18181b] space-y-1">
                <div className="text-[10px] text-[#0ea5e9] font-bold">01 / INPUT</div>
                <div className="font-semibold text-[#f4f4f5]">Idea + Documents</div>
                <p className="text-[10px] text-[#71717a]">PDF, DOCX, TXT, MD notes ingested.</p>
              </div>
              <div className="p-3.5 rounded border border-[#27272a] bg-[#18181b] space-y-1">
                <div className="text-[10px] text-[#0ea5e9] font-bold">02 / RAG AGENT</div>
                <div className="font-semibold text-[#f4f4f5]">Project Context</div>
                <p className="text-[10px] text-[#71717a]">Semantic extraction answers key specs.</p>
              </div>
              <div className="p-3.5 rounded border border-[#27272a] bg-[#18181b] space-y-1">
                <div className="text-[10px] text-[#0ea5e9] font-bold">03 / RESEARCH</div>
                <div className="font-semibold text-[#f4f4f5]">Research Agent</div>
                <p className="text-[10px] text-[#71717a]">Researches missing info & options.</p>
              </div>
              <div className="p-3.5 rounded border border-[#27272a] bg-[#18181b] space-y-1">
                <div className="text-[10px] text-[#0ea5e9] font-bold">04 / DECISION</div>
                <div className="font-semibold text-[#f4f4f5]">Decision Agent</div>
                <p className="text-[10px] text-[#71717a]">Decides architecture & tech stack.</p>
              </div>
              <div className="p-3.5 rounded border border-[#27272a] bg-[#18181b] space-y-1">
                <div className="text-[10px] text-[#0ea5e9] font-bold">05 / VALIDATE</div>
                <div className="font-semibold text-[#f4f4f5]">Validation Step</div>
                <p className="text-[10px] text-[#71717a]">Checks integrity before visual layout.</p>
              </div>
              <div className="p-3.5 rounded border border-[#10b981]/50 bg-[#18181b] space-y-1">
                <div className="text-[10px] text-[#10b981] font-bold">06 / CANVAS</div>
                <div className="font-semibold text-[#f4f4f5]">Editable Canvas</div>
                <p className="text-[10px] text-[#10b981]">Interactive React Flow studio ready.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs">
              <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-1.5">
                <div className="text-[10px] text-[#0ea5e9] font-bold">01 / INPUT</div>
                <div className="font-semibold text-[#f4f4f5]">Idea Only</div>
                <p className="text-[10px] text-[#71717a]">Describe what you want to build in plain text.</p>
              </div>
              <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-1.5">
                <div className="text-[10px] text-[#0ea5e9] font-bold">02 / RESEARCH</div>
                <div className="font-semibold text-[#f4f4f5]">Autonomous Research</div>
                <p className="text-[10px] text-[#71717a]">Sketch researches best solutions from scratch.</p>
              </div>
              <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-1.5">
                <div className="text-[10px] text-[#0ea5e9] font-bold">03 / DECISION</div>
                <div className="font-semibold text-[#f4f4f5]">Decision Agent</div>
                <p className="text-[10px] text-[#71717a]">Selects tiers, components, and trade-offs.</p>
              </div>
              <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-1.5">
                <div className="text-[10px] text-[#0ea5e9] font-bold">04 / VALIDATE</div>
                <div className="font-semibold text-[#f4f4f5]">Validation Step</div>
                <p className="text-[10px] text-[#71717a]">Enforces security and scalability rules.</p>
              </div>
              <div className="p-4 rounded border border-[#10b981]/50 bg-[#18181b] space-y-1.5">
                <div className="text-[10px] text-[#10b981] font-bold">05 / CANVAS</div>
                <div className="font-semibold text-[#f4f4f5]">Editable Canvas</div>
                <p className="text-[10px] text-[#10b981]">Complete visual architecture generated.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          SECTION: INTERACTIVE SYSTEM MAP STUDIO PREVIEW
          ==================================================================== */}
      <section id="product" className="py-20 border-t border-[#27272a] bg-[#09090b]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#0ea5e9]">
                Interactive Architecture Editor
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5] mt-1 font-mono uppercase">
                Explore the Sketch Workspace
              </h2>
              <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1">
                Click components in the visual canvas below to inspect technical details and connections.
              </p>
            </div>
            <Link href="/dashboard">
              <Button size="sm" className="font-mono text-xs bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b]">
                Open Workspace →
              </Button>
            </Link>
          </div>

          {/* Interactive Workspace Studio */}
          <div className="rounded-xl border border-[#27272a] bg-[#111113] overflow-hidden font-mono shadow-2xl">
            {/* Top Workspace Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#18181b] border-b border-[#27272a] text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#0ea5e9]">◈</span>
                <span className="font-semibold text-[#f4f4f5]">AI Learning Platform · Architecture</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-[#10b981] flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" /> READY
                </span>
                <span className="text-[#71717a]">6 COMPONENTS · 7 EDGES</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
              {/* Left: Tools Palette (3 cols) */}
              <div className="lg:col-span-3 border-r border-[#27272a] bg-[#09090b] p-4 text-xs space-y-4">
                <div className="text-[10px] uppercase tracking-wider text-[#71717a] font-semibold">
                  Workspace Tools
                </div>
                <div className="space-y-1">
                  <div className="p-1.5 rounded bg-[#18181b] border border-[#27272a] text-[#f4f4f5] flex items-center gap-2">
                    <span className="text-[#0ea5e9]">↖</span> Select
                  </div>
                  <div className="p-1.5 rounded bg-[#111113] text-[#a1a1aa] flex items-center gap-2">
                    <span>✋</span> Hand / Pan
                  </div>
                  <div className="p-1.5 rounded bg-[#111113] text-[#a1a1aa] flex items-center gap-2">
                    <span>□</span> Rectangle
                  </div>
                  <div className="p-1.5 rounded bg-[#111113] text-[#a1a1aa] flex items-center gap-2">
                    <span>○</span> Circle
                  </div>
                  <div className="p-1.5 rounded bg-[#111113] text-[#a1a1aa] flex items-center gap-2">
                    <span>T</span> Text Box
                  </div>
                  <div className="p-1.5 rounded bg-[#111113] text-[#a1a1aa] flex items-center gap-2">
                    <span>→</span> Connector
                  </div>
                </div>
              </div>

              {/* Center: Interactive Canvas Nodes (6 cols) */}
              <div className="lg:col-span-6 p-6 flex flex-col justify-center items-center relative bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[size:16px_16px]">
                <div className="grid grid-cols-2 gap-5 w-full max-w-md">
                  {/* Node 1: Web Application */}
                  <div
                    onClick={() => setSelectedNode("client")}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      selectedNode === "client"
                        ? "bg-[#18181b] border-[#0ea5e9] ring-1 ring-[#0ea5e9]"
                        : "bg-[#111113] border-[#27272a] hover:border-[#3f3f46]"
                    }`}
                  >
                    <div className="text-[10px] text-[#0ea5e9] uppercase flex items-center justify-between">
                      <span>◈ FRONTEND</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    </div>
                    <div className="text-xs font-semibold text-[#f4f4f5] mt-1">Web Application</div>
                    <div className="text-[10px] text-[#71717a] mt-0.5">Next.js / TypeScript</div>
                  </div>

                  {/* Node 2: API Gateway */}
                  <div
                    onClick={() => setSelectedNode("api")}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      selectedNode === "api"
                        ? "bg-[#18181b] border-[#0ea5e9] ring-1 ring-[#0ea5e9]"
                        : "bg-[#111113] border-[#27272a] hover:border-[#3f3f46]"
                    }`}
                  >
                    <div className="text-[10px] text-[#a1a1aa] uppercase flex items-center justify-between">
                      <span>↔ API</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    </div>
                    <div className="text-xs font-semibold text-[#f4f4f5] mt-1">API Router</div>
                    <div className="text-[10px] text-[#71717a] mt-0.5">Route Handlers</div>
                  </div>

                  {/* Node 3: AI Agent System */}
                  <div
                    onClick={() => setSelectedNode("ai")}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      selectedNode === "ai"
                        ? "bg-[#18181b] border-[#0ea5e9] ring-1 ring-[#0ea5e9]"
                        : "bg-[#111113] border-[#27272a] hover:border-[#3f3f46]"
                    }`}
                  >
                    <div className="text-[10px] text-[#0ea5e9] uppercase flex items-center justify-between">
                      <span>◎ AI AGENT</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    </div>
                    <div className="text-xs font-semibold text-[#f4f4f5] mt-1">AI Tutor Engine</div>
                    <div className="text-[10px] text-[#71717a] mt-0.5">LangGraph.js + Gemini</div>
                  </div>

                  {/* Node 4: Database */}
                  <div
                    onClick={() => setSelectedNode("db")}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      selectedNode === "db"
                        ? "bg-[#18181b] border-[#0ea5e9] ring-1 ring-[#0ea5e9]"
                        : "bg-[#111113] border-[#27272a] hover:border-[#3f3f46]"
                    }`}
                  >
                    <div className="text-[10px] text-[#10b981] uppercase flex items-center justify-between">
                      <span>◉ DATABASE</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    </div>
                    <div className="text-xs font-semibold text-[#f4f4f5] mt-1">Primary Database</div>
                    <div className="text-[10px] text-[#71717a] mt-0.5">Supabase PostgreSQL</div>
                  </div>
                </div>
              </div>

              {/* Right: Component Inspector Panel (3 cols) */}
              <div className="lg:col-span-3 border-l border-[#27272a] bg-[#09090b] p-4 text-xs space-y-4">
                <div className="text-[10px] uppercase tracking-wider text-[#71717a] font-semibold">
                  Inspector
                </div>

                {selectedNode === "db" && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-[#71717a]">NAME</div>
                      <div className="text-sm font-semibold text-[#f4f4f5]">Primary Database</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">TECHNOLOGY</div>
                      <div className="text-xs text-[#0ea5e9]">Supabase PostgreSQL 16 + pgvector</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">DESCRIPTION</div>
                      <div className="text-[11px] text-[#a1a1aa] leading-relaxed">
                        ACID relational database with Row-Level Security policies and vector embeddings for semantic search.
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">CONNECTIONS</div>
                      <div className="text-[11px] text-[#a1a1aa]">← API Router, AI Tutor Engine</div>
                    </div>
                  </div>
                )}

                {selectedNode === "client" && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-[#71717a]">NAME</div>
                      <div className="text-sm font-semibold text-[#f4f4f5]">Web Application</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">TECHNOLOGY</div>
                      <div className="text-xs text-[#0ea5e9]">Next.js / TypeScript & React</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">DESCRIPTION</div>
                      <div className="text-[11px] text-[#a1a1aa] leading-relaxed">
                        User interface with server components, client state, and streaming real-time chat.
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">CONNECTIONS</div>
                      <div className="text-[11px] text-[#a1a1aa]">→ API Router</div>
                    </div>
                  </div>
                )}

                {selectedNode === "api" && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-[#71717a]">NAME</div>
                      <div className="text-sm font-semibold text-[#f4f4f5]">API Router</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">TECHNOLOGY</div>
                      <div className="text-xs text-[#0ea5e9]">Next.js Route Handlers</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">DESCRIPTION</div>
                      <div className="text-[11px] text-[#a1a1aa] leading-relaxed">
                        Dispatches requests, validates session tokens, and executes business operations.
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">CONNECTIONS</div>
                      <div className="text-[11px] text-[#a1a1aa]">→ Primary Database, AI Tutor Engine</div>
                    </div>
                  </div>
                )}

                {selectedNode === "ai" && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-[#71717a]">NAME</div>
                      <div className="text-sm font-semibold text-[#f4f4f5]">AI Tutor Engine</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">TECHNOLOGY</div>
                      <div className="text-xs text-[#0ea5e9]">LangGraph.js + Gemini 1.5</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">DESCRIPTION</div>
                      <div className="text-[11px] text-[#a1a1aa] leading-relaxed">
                        Multi-agent system providing personalized student coding help and retrieval.
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">CONNECTIONS</div>
                      <div className="text-[11px] text-[#a1a1aa]">→ Primary Database (vector similarity)</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom AI Command Bar Preview */}
            <div className="p-3 bg-[#18181b] border-t border-[#27272a] flex items-center justify-between text-xs text-[#a1a1aa]">
              <div className="flex items-center gap-2">
                <span className="text-[#0ea5e9]">✦</span>
                <span className="text-[#71717a]">Try command:</span>
                <span className="text-[#f4f4f5] bg-[#111113] px-2 py-0.5 rounded border border-[#27272a]">
                  &ldquo;Add Redis caching&rdquo;
                </span>
              </div>
              <Link href="/dashboard" className="text-[#0ea5e9] hover:underline font-mono text-xs">
                Try in Workspace →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION: 7-STEP PRODUCT STORY (FEATURES)
          ==================================================================== */}
      <section id="features" className="py-20 border-t border-[#27272a] bg-[#111113]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0ea5e9]">
              The 7-Step Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5] mt-1 font-mono uppercase">
              How Sketch Works
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1">
              Simple enough for a beginner to understand. Powerful enough for senior architects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="text-[10px] text-[#0ea5e9] font-bold">STEP 1</div>
              <h3 className="text-sm font-semibold text-[#f4f4f5]">Tell Sketch what you want to build.</h3>
              <p className="text-[#71717a] leading-relaxed">
                Describe your software idea in simple words. No formal architecture degree required.
              </p>
            </div>

            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="text-[10px] text-[#0ea5e9] font-bold">STEP 2</div>
              <h3 className="text-sm font-semibold text-[#f4f4f5]">Upload research if you have it.</h3>
              <p className="text-[#71717a] leading-relaxed">
                Add PDFs, technical RFCs, or notes. If you don&apos;t have any, Sketch handles it.
              </p>
            </div>

            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="text-[10px] text-[#0ea5e9] font-bold">STEP 3</div>
              <h3 className="text-sm font-semibold text-[#f4f4f5]">Sketch understands your information.</h3>
              <p className="text-[#71717a] leading-relaxed">
                RAG agent extracts requirements, existing decisions, and constraints from your documents.
              </p>
            </div>

            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="text-[10px] text-[#0ea5e9] font-bold">STEP 4</div>
              <h3 className="text-sm font-semibold text-[#f4f4f5]">Sketch researches anything missing.</h3>
              <p className="text-[#71717a] leading-relaxed">
                Research agent evaluates current technologies, frameworks, and architecture patterns.
              </p>
            </div>

            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="text-[10px] text-[#0ea5e9] font-bold">STEP 5</div>
              <h3 className="text-sm font-semibold text-[#f4f4f5]">Sketch decides how your system should work.</h3>
              <p className="text-[#71717a] leading-relaxed">
                Decision agent specifies layers, components, connections, and trade-offs.
              </p>
            </div>

            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="text-[10px] text-[#0ea5e9] font-bold">STEP 6</div>
              <h3 className="text-sm font-semibold text-[#f4f4f5]">Sketch creates your visual architecture.</h3>
              <p className="text-[#71717a] leading-relaxed">
                Canvas agent renders an organized React Flow diagram with automated Dagre layout.
              </p>
            </div>

            <div className="p-4 rounded border border-[#10b981]/50 bg-[#18181b] space-y-2 md:col-span-2">
              <div className="text-[10px] text-[#10b981] font-bold">STEP 7 · FULL CONTROL</div>
              <h3 className="text-sm font-semibold text-[#f4f4f5]">You can edit everything.</h3>
              <p className="text-[#71717a] leading-relaxed">
                Move nodes, change colors, rename services, add shapes, or ask AI to alter your system with natural language commands.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION: CALL TO ACTION
          ==================================================================== */}
      <section className="py-24 border-t border-[#27272a] bg-[#09090b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-xs font-mono text-[#0ea5e9]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span>DESCRIBE IT · RESEARCH IT · SKETCH IT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f4f4f5] uppercase font-mono">
            You bring the idea.<br />
            Sketch figures out the rest.
          </h2>

          <p className="text-sm sm:text-base text-[#a1a1aa] max-w-xl mx-auto leading-relaxed">
            Turn your software idea into an intelligent, editable architecture canvas in seconds.
          </p>

          <div className="pt-4 flex justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] font-mono font-medium text-xs h-11 px-6 rounded shadow-none"
              >
                Sign Up & Start Sketching →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}