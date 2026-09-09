"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavBrand, NavLinks, NavActions } from "@/components/layout/navigation";
import {
  ArrowRight,
  Terminal,
  Layers,
  Database,
  Cpu,
  Shield,
  GitBranch,
  Network,
  FileCode,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Boxes,
  Server,
  Zap,
  Clock,
  ChevronRight,
  Radio,
  Sliders,
  Code2
} from "lucide-react";

export default function LandingPage() {
  // Hero interactive system simulation step
  const [activeStep, setActiveStep] = useState<number>(0);
  // Selected component in interactive canvas section
  const [selectedCanvasNode, setSelectedCanvasNode] = useState<"api" | "db" | "worker" | "cache">("db");
  // Impact analysis simulation state
  const [simulatedChange, setSimulatedChange] = useState<"none" | "db" | "auth">("db");

  // Step ticker for the Hero Living Architecture Map
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-[#f4f4f5] selection:bg-[#0ea5e9]/30 selection:text-white">
      {/* ====================================================================
          SECTION 1: HERO SECTION & LIVING ARCHITECTURE VISUALIZATION
          ==================================================================== */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        {/* Top Status Header */}
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[11px] font-mono text-[#a1a1aa]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0ea5e9]" />
            SYSTEM SPECIFICATION ENGINE
          </span>
          <span className="text-[11px] font-mono text-[#71717a]">/</span>
          <span className="text-[11px] font-mono text-[#71717a]">VERSION 1.4 COMPLIANT</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Hero Left: Headline & Prompt Action */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f4f4f5] leading-[1.05] font-mono uppercase">
              BUILD THE SYSTEM<br />
              <span className="text-[#0ea5e9]">BEFORE THE CODE.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#a1a1aa] font-normal leading-relaxed">
              Turn requirements into architecture, dependencies, decisions, and implementation paths. 
              AgentArchitect helps developers transform product ideas into interactive, verified software architecture.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] font-mono font-medium text-xs h-11 px-5 rounded shadow-none transition-colors"
                >
                  Start Building
                  <ArrowRight className="h-3.5 w-3.5 ml-2" />
                </Button>
              </Link>
              <Link href="#interactive-map">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#27272a] bg-[#111113] text-[#f4f4f5] hover:bg-[#18181b] font-mono text-xs h-11 px-5 rounded shadow-none"
                >
                  Explore the System
                </Button>
              </Link>
            </div>

            {/* Quick Architecture Indicators */}
            <div className="pt-6 border-t border-[#27272a] grid grid-cols-3 gap-4 font-mono">
              <div>
                <div className="text-xs text-[#71717a]">INPUT</div>
                <div className="text-sm font-semibold text-[#f4f4f5] mt-0.5">Plain English / RFC</div>
              </div>
              <div>
                <div className="text-xs text-[#71717a]">ENGINE</div>
                <div className="text-sm font-semibold text-[#f4f4f5] mt-0.5">LangGraph State Graph</div>
              </div>
              <div>
                <div className="text-xs text-[#71717a]">VERIFICATION</div>
                <div className="text-sm font-semibold text-[#10b981] mt-0.5">Zod Schema Pass</div>
              </div>
            </div>
          </div>

          {/* Hero Right: The Living Architecture Map */}
          <div className="lg:col-span-6">
            <div className="rounded-lg border border-[#27272a] bg-[#111113] p-5 shadow-2xl relative overflow-hidden font-mono">
              {/* Panel Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#27272a] text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0ea5e9] animate-ping" />
                  <span className="text-[#f4f4f5] font-semibold">LIVING TOPOLOGY GRAPH</span>
                </div>
                <div className="text-[10px] text-[#71717a]">
                  STATE: {activeStep === 0 && "INGESTING REQS"}
                  {activeStep === 1 && "ANALYZING GRAPH"}
                  {activeStep === 2 && "EXPANDING NODES"}
                  {activeStep === 3 && "WIRING ADJACENCIES"}
                  {activeStep === 4 && "TOPOLOGY STABLE"}
                </div>
              </div>

              {/* Graphical Canvas Representation */}
              <div className="py-6 flex flex-col items-center gap-4 text-xs">
                {/* Node: USER */}
                <div className={`px-4 py-2 rounded border transition-all duration-300 ${
                  activeStep >= 0
                    ? "bg-[#18181b] border-[#0ea5e9] text-[#f4f4f5] shadow-xs"
                    : "bg-[#111113] border-[#27272a] text-[#71717a]"
                }`}>
                  <div className="text-[10px] text-[#71717a]">CLIENT INGRESS</div>
                  <div className="font-semibold flex items-center gap-1.5">
                    <span>◈</span> USER CLIENT
                  </div>
                </div>

                <div className="text-[#71717a] text-[10px] leading-none">│ ▼</div>

                {/* Node: FRONTEND */}
                <div className={`px-4 py-2 rounded border transition-all duration-300 ${
                  activeStep >= 1
                    ? "bg-[#18181b] border-[#0ea5e9] text-[#f4f4f5]"
                    : "bg-[#111113] border-[#27272a] text-[#71717a]"
                }`}>
                  <div className="text-[10px] text-[#71717a]">APPLICATION TIER</div>
                  <div className="font-semibold flex items-center gap-1.5">
                    <span>◈</span> FRONTEND (Next.js)
                  </div>
                </div>

                <div className="text-[#71717a] text-[10px] leading-none">│ ▼</div>

                {/* Node: API LAYER */}
                <div className={`px-4 py-2 rounded border transition-all duration-300 ${
                  activeStep >= 2
                    ? "bg-[#18181b] border-[#0ea5e9] text-[#f4f4f5]"
                    : "bg-[#111113] border-[#27272a] text-[#71717a]"
                }`}>
                  <div className="text-[10px] text-[#71717a]">ROUTER / GATEWAY</div>
                  <div className="font-semibold flex items-center gap-1.5">
                    <span>↔</span> API LAYER (Edge / REST)
                  </div>
                </div>

                <div className="text-[#71717a] text-[10px] leading-none">/ &nbsp; \ ▼ &nbsp; ▼</div>

                {/* Split Nodes: DATABASE & AI AGENT */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className={`p-3 rounded border text-center transition-all duration-300 ${
                    activeStep >= 3
                      ? "bg-[#18181b] border-[#0ea5e9] text-[#f4f4f5]"
                      : "bg-[#111113] border-[#27272a] text-[#71717a]"
                  }`}>
                    <div className="text-[10px] text-[#71717a]">STORAGE TIER</div>
                    <div className="font-semibold mt-0.5">◉ DATABASE</div>
                    <div className="text-[10px] text-[#a1a1aa] mt-0.5">PostgreSQL</div>
                  </div>

                  <div className={`p-3 rounded border text-center transition-all duration-300 ${
                    activeStep >= 3
                      ? "bg-[#18181b] border-[#0ea5e9] text-[#f4f4f5]"
                      : "bg-[#111113] border-[#27272a] text-[#71717a]"
                  }`}>
                    <div className="text-[10px] text-[#71717a]">COMPUTE TIER</div>
                    <div className="font-semibold mt-0.5">◎ AI AGENT</div>
                    <div className="text-[10px] text-[#a1a1aa] mt-0.5">LangGraph Exec</div>
                  </div>
                </div>

                <div className="text-[#71717a] text-[10px] leading-none">└────┬────┘ ▼</div>

                {/* Final Node: SYSTEM */}
                <div className={`px-5 py-2.5 rounded border transition-all duration-300 w-full text-center ${
                  activeStep === 4
                    ? "bg-[#0ea5e9]/10 border-[#0ea5e9] text-[#0ea5e9] shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                    : "bg-[#111113] border-[#27272a] text-[#71717a]"
                }`}>
                  <div className="text-[10px] tracking-wider text-[#a1a1aa]">TOPOLOGY RESULT</div>
                  <div className="font-bold text-sm text-[#f4f4f5] mt-0.5">
                    ● ARCHITECTURE SYNTHESIZED (12 NODES, 18 EDGES)
                  </div>
                </div>
              </div>

              {/* Bottom Simulation Status Bar */}
              <div className="pt-3 border-t border-[#27272a] flex items-center justify-between text-[10px] text-[#71717a]">
                <span>PULSE CYCLE: {(activeStep * 25)}%</span>
                <span className="text-[#10b981] font-semibold">DETERMINISTIC BFS VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: HOW THE SYSTEM WORKS (5 STEP PIPELINE)
          ==================================================================== */}
      <section id="workflow" className="py-20 border-t border-[#27272a] bg-[#111113]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0ea5e9]">
              Engineering Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5] mt-2 font-mono uppercase">
              See the system thinking.
            </h2>
            <p className="text-sm text-[#a1a1aa] mt-2 font-mono">
              AI should not be a black box chatbot. AgentArchitect models requirements step by step into verifiable architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono">
            {/* Step 1 */}
            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="text-xs text-[#0ea5e9] font-bold">01 / REQS</div>
              <h3 className="text-sm font-semibold text-[#f4f4f5]">Requirements</h3>
              <p className="text-xs text-[#71717a] leading-relaxed">
                Ingests RFC notes, PDFs, or plain descriptions into structured entities.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="text-xs text-[#0ea5e9] font-bold">02 / ANALYSIS</div>
              <h3 className="text-sm font-semibold text-[#f4f4f5]">AI Analysis</h3>
              <p className="text-xs text-[#71717a] leading-relaxed">
                Multi-agent council evaluates throughput, security bounds, and latency budgets.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="text-xs text-[#0ea5e9] font-bold">03 / ARCH</div>
              <h3 className="text-sm font-semibold text-[#f4f4f5]">Architecture</h3>
              <p className="text-xs text-[#71717a] leading-relaxed">
                Assigns microservices, databases, queues, and caches to discrete nodes.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="text-xs text-[#0ea5e9] font-bold">04 / GRAPH</div>
              <h3 className="text-sm font-semibold text-[#f4f4f5]">System Graph</h3>
              <p className="text-xs text-[#71717a] leading-relaxed">
                Renders a living interactive React Flow canvas with Dagre hierarchical layout.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="text-xs text-[#0ea5e9] font-bold">05 / IMPACT</div>
              <h3 className="text-sm font-semibold text-[#f4f4f5]">Impact Analysis</h3>
              <p className="text-xs text-[#71717a] leading-relaxed">
                Runs directed BFS to calculate downstream blast radius on component change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: INTERACTIVE ARCHITECTURE VISUALIZATION & CANVAS PREVIEW
          ==================================================================== */}
      <section id="system-map" className="py-20 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#0ea5e9]">
                Architecture Workspace
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5] mt-1 font-mono uppercase">
                Interactive System Map Studio
              </h2>
              <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono mt-1">
                Click nodes in the diagram below to inspect technical attributes and dependency linkages.
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="font-mono text-xs border-[#27272a] bg-[#111113] text-[#f4f4f5]">
                Open Full Studio →
              </Button>
            </Link>
          </div>

          {/* Interactive Workspace Studio Preview */}
          <div className="rounded-lg border border-[#27272a] bg-[#111113] overflow-hidden font-mono shadow-2xl">
            {/* Studio Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#18181b] border-b border-[#27272a] text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#0ea5e9]">◈</span>
                <span className="font-semibold text-[#f4f4f5]">PROJECT / DISTRIBUTED E-COMMERCE</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#10b981] flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" /> ● READY
                </span>
                <span className="text-[11px] text-[#71717a]">12 COMPONENTS • 18 EDGES</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
              {/* Left: Component Library Palette (3 cols) */}
              <div className="lg:col-span-3 border-r border-[#27272a] bg-[#09090b] p-4 text-xs space-y-4">
                <div className="text-[10px] uppercase tracking-wider text-[#71717a] font-semibold">
                  Component Library
                </div>
                <div className="space-y-1.5">
                  <div className="text-[10px] text-[#a1a1aa] uppercase">Application</div>
                  <div className="p-2 rounded bg-[#111113] border border-[#27272a] flex items-center justify-between text-[#f4f4f5]">
                    <span>◈ Frontend</span>
                    <span className="text-[10px] text-[#71717a]">Next.js</span>
                  </div>
                  <div className="p-2 rounded bg-[#111113] border border-[#27272a] flex items-center justify-between text-[#f4f4f5]">
                    <span>↔ API Gateway</span>
                    <span className="text-[10px] text-[#71717a]">REST / Hono</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#27272a]">
                  <div className="text-[10px] text-[#a1a1aa] uppercase">Data & Storage</div>
                  <div className="p-2 rounded bg-[#111113] border border-[#27272a] flex items-center justify-between text-[#f4f4f5]">
                    <span>◉ Database</span>
                    <span className="text-[10px] text-[#71717a]">PostgreSQL</span>
                  </div>
                  <div className="p-2 rounded bg-[#111113] border border-[#27272a] flex items-center justify-between text-[#f4f4f5]">
                    <span>⚡ Cache</span>
                    <span className="text-[10px] text-[#71717a]">Redis</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#27272a]">
                  <div className="text-[10px] text-[#a1a1aa] uppercase">AI & Compute</div>
                  <div className="p-2 rounded bg-[#111113] border border-[#27272a] flex items-center justify-between text-[#f4f4f5]">
                    <span>◎ AI Agent</span>
                    <span className="text-[10px] text-[#71717a]">LangGraph</span>
                  </div>
                </div>
              </div>

              {/* Center: Interactive Canvas (6 cols) */}
              <div className="lg:col-span-6 p-6 flex flex-col justify-center items-center relative bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[size:16px_16px]">
                <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                  {/* Node 1: API Router */}
                  <div
                    onClick={() => setSelectedCanvasNode("api")}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      selectedCanvasNode === "api"
                        ? "bg-[#18181b] border-[#0ea5e9] ring-1 ring-[#0ea5e9]"
                        : "bg-[#111113] border-[#27272a] hover:border-[#3f3f46]"
                    }`}
                  >
                    <div className="text-[10px] text-[#0ea5e9] uppercase flex items-center justify-between">
                      <span>↔ API ROUTER</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    </div>
                    <div className="text-xs font-semibold text-[#f4f4f5] mt-1">Ingress Gateway</div>
                    <div className="text-[10px] text-[#71717a] mt-0.5">Rate Limit: 10k req/s</div>
                  </div>

                  {/* Node 2: Cache */}
                  <div
                    onClick={() => setSelectedCanvasNode("cache")}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      selectedCanvasNode === "cache"
                        ? "bg-[#18181b] border-[#0ea5e9] ring-1 ring-[#0ea5e9]"
                        : "bg-[#111113] border-[#27272a] hover:border-[#3f3f46]"
                    }`}
                  >
                    <div className="text-[10px] text-[#a1a1aa] uppercase flex items-center justify-between">
                      <span>⚡ CACHE</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    </div>
                    <div className="text-xs font-semibold text-[#f4f4f5] mt-1">Redis Cluster</div>
                    <div className="text-[10px] text-[#71717a] mt-0.5">TTL: 3600s</div>
                  </div>

                  {/* Node 3: Database */}
                  <div
                    onClick={() => setSelectedCanvasNode("db")}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      selectedCanvasNode === "db"
                        ? "bg-[#18181b] border-[#0ea5e9] ring-1 ring-[#0ea5e9]"
                        : "bg-[#111113] border-[#27272a] hover:border-[#3f3f46]"
                    }`}
                  >
                    <div className="text-[10px] text-[#0ea5e9] uppercase flex items-center justify-between">
                      <span>◉ DATABASE</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    </div>
                    <div className="text-xs font-semibold text-[#f4f4f5] mt-1">PostgreSQL Core</div>
                    <div className="text-[10px] text-[#71717a] mt-0.5">Supabase pgvector</div>
                  </div>

                  {/* Node 4: Worker */}
                  <div
                    onClick={() => setSelectedCanvasNode("worker")}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      selectedCanvasNode === "worker"
                        ? "bg-[#18181b] border-[#0ea5e9] ring-1 ring-[#0ea5e9]"
                        : "bg-[#111113] border-[#27272a] hover:border-[#3f3f46]"
                    }`}
                  >
                    <div className="text-[10px] text-[#a1a1aa] uppercase flex items-center justify-between">
                      <span>◎ ASYNC WORKER</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    </div>
                    <div className="text-xs font-semibold text-[#f4f4f5] mt-1">Order Reconciler</div>
                    <div className="text-[10px] text-[#71717a] mt-0.5">Queue: Kafka / BullMQ</div>
                  </div>
                </div>
              </div>

              {/* Right: Component Inspector Panel (3 cols) */}
              <div className="lg:col-span-3 border-l border-[#27272a] bg-[#09090b] p-4 text-xs space-y-4">
                <div className="text-[10px] uppercase tracking-wider text-[#71717a] font-semibold">
                  Component Inspector
                </div>

                {selectedCanvasNode === "db" && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-[#71717a]">COMPONENT</div>
                      <div className="text-sm font-semibold text-[#f4f4f5]">PostgreSQL Core</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">TYPE</div>
                      <div className="text-xs text-[#0ea5e9]">Relational Database</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">TECHNOLOGY</div>
                      <div className="text-xs text-[#f4f4f5]">Supabase PostgreSQL 16 + pgvector</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">RESPONSIBILITIES</div>
                      <div className="text-[11px] text-[#a1a1aa] leading-relaxed">
                        Stores primary transactional entities, user profiles, and 768-dim embeddings.
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">DEPENDENCIES</div>
                      <div className="text-[11px] text-[#a1a1aa]">← Ingress Gateway, Order Reconciler</div>
                    </div>
                  </div>
                )}

                {selectedCanvasNode === "api" && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-[#71717a]">COMPONENT</div>
                      <div className="text-sm font-semibold text-[#f4f4f5]">Ingress Gateway</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">TYPE</div>
                      <div className="text-xs text-[#0ea5e9]">API Router</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">TECHNOLOGY</div>
                      <div className="text-xs text-[#f4f4f5]">Edge HTTP / WebSocket proxy</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">DEPENDENCIES</div>
                      <div className="text-[11px] text-[#a1a1aa]">→ PostgreSQL Core, Redis Cluster</div>
                    </div>
                  </div>
                )}

                {selectedCanvasNode === "cache" && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-[#71717a]">COMPONENT</div>
                      <div className="text-sm font-semibold text-[#f4f4f5]">Redis Cluster</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">TYPE</div>
                      <div className="text-xs text-[#0ea5e9]">In-Memory Cache</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">ROLE</div>
                      <div className="text-[11px] text-[#a1a1aa]">Session locks & sub-millisecond query caches</div>
                    </div>
                  </div>
                )}

                {selectedCanvasNode === "worker" && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-[#71717a]">COMPONENT</div>
                      <div className="text-sm font-semibold text-[#f4f4f5]">Order Reconciler</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">TYPE</div>
                      <div className="text-xs text-[#0ea5e9]">Background Worker</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">ROLE</div>
                      <div className="text-[11px] text-[#a1a1aa]">Asynchronous ledger verification and webhooks</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: AI AGENT WORKFLOW VISUALIZATION
          ==================================================================== */}
      <section id="agent-workflow" className="py-20 border-t border-[#27272a] bg-[#111113]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0ea5e9]">
              Agent Orchestration
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5] mt-1 font-mono uppercase">
              10-Node LangGraph State Graph
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono mt-1">
              Autonomous engineering agents execute sequentially with formal Zod schema validation at every step.
            </p>
          </div>

          {/* Execution Pipeline Board */}
          <div className="rounded-lg border border-[#27272a] bg-[#09090b] p-6 font-mono space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div className="p-3 rounded bg-[#111113] border border-[#27272a]">
                <div className="text-[10px] text-[#10b981] font-semibold">✓ COMPLETED</div>
                <div className="font-semibold text-[#f4f4f5] mt-1">1. Input Validation</div>
                <div className="text-[10px] text-[#71717a]">Spec sanitized</div>
              </div>

              <div className="p-3 rounded bg-[#111113] border border-[#27272a]">
                <div className="text-[10px] text-[#10b981] font-semibold">✓ COMPLETED</div>
                <div className="font-semibold text-[#f4f4f5] mt-1">2. Requirement Analyzer</div>
                <div className="text-[10px] text-[#71717a]">Decomposed 14 reqs</div>
              </div>

              <div className="p-3 rounded bg-[#18181b] border border-[#0ea5e9]">
                <div className="text-[10px] text-[#0ea5e9] font-semibold animate-pulse">◉ RUNNING</div>
                <div className="font-semibold text-[#f4f4f5] mt-1">3. RAG Retriever</div>
                <div className="text-[10px] text-[#0ea5e9]">768-dim pgvector</div>
              </div>

              <div className="p-3 rounded bg-[#111113] border border-[#27272a] opacity-60">
                <div className="text-[10px] text-[#71717a]">○ QUEUED</div>
                <div className="font-semibold text-[#f4f4f5] mt-1">4. Architect Designer</div>
                <div className="text-[10px] text-[#71717a]">Component wiring</div>
              </div>

              <div className="p-3 rounded bg-[#111113] border border-[#27272a] opacity-60">
                <div className="text-[10px] text-[#71717a]">○ QUEUED</div>
                <div className="font-semibold text-[#f4f4f5] mt-1">5. Zod Validator</div>
                <div className="text-[10px] text-[#71717a]">Schema check</div>
              </div>
            </div>

            {/* Execution Telemetry Log Stream */}
            <div className="p-4 rounded bg-[#111113] border border-[#27272a] text-xs font-mono text-[#a1a1aa] space-y-1.5">
              <div className="flex items-center gap-3 text-[#71717a]">
                <span>14:32:08</span>
                <span className="text-[#f4f4f5]">[RequirementAnalyzer]</span>
                <span>Identified high write-throughput requirement (&gt;8k orders/min).</span>
              </div>
              <div className="flex items-center gap-3 text-[#71717a]">
                <span>14:32:10</span>
                <span className="text-[#0ea5e9]">[RAGRetriever]</span>
                <span>Searching project RFC documents via cosine similarity...</span>
              </div>
              <div className="flex items-center gap-3 text-[#10b981]">
                <span>14:32:12</span>
                <span className="text-[#10b981]">[RAGRetriever]</span>
                <span>Retrieved 8 relevant chunks (confidence 0.914). Passing state to ArchitectureDesigner.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: IMPACT ANALYSIS PREVIEW (Directed BFS Blast Radius)
          ==================================================================== */}
      <section id="impact-preview" className="py-20 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#f59e0b]">
              Predictive Safety
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5] mt-1 font-mono uppercase">
              Impact Radar: Directed Blast Radius
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono mt-1">
              Select a simulated component modification to observe downstream domino failure propagation.
            </p>
          </div>

          <div className="rounded-lg border border-[#27272a] bg-[#111113] p-6 font-mono">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#27272a]">
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#71717a]">TRIGGER CHANGE:</span>
                <button
                  onClick={() => setSimulatedChange("db")}
                  className={`px-3 py-1.5 rounded text-xs transition-colors ${
                    simulatedChange === "db"
                      ? "bg-[#ef4444]/20 border border-[#ef4444] text-[#f4f4f5]"
                      : "bg-[#18181b] border border-[#27272a] text-[#a1a1aa]"
                  }`}
                >
                  Swap Database: Postgres → MongoDB
                </button>
                <button
                  onClick={() => setSimulatedChange("auth")}
                  className={`px-3 py-1.5 rounded text-xs transition-colors ${
                    simulatedChange === "auth"
                      ? "bg-[#f59e0b]/20 border border-[#f59e0b] text-[#f4f4f5]"
                      : "bg-[#18181b] border border-[#27272a] text-[#a1a1aa]"
                  }`}
                >
                  Modify Auth: JWT → Session Cookie
                </button>
              </div>

              <div className="text-xs">
                <span className="text-[#71717a]">OVERALL RISK: </span>
                <span className="text-[#ef4444] font-bold">HIGH (4 COMPONENTS)</span>
              </div>
            </div>

            {/* Visual BFS Blast Tree */}
            <div className="py-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Component 1: Changed Source */}
              <div className="p-4 rounded border border-[#ef4444] bg-[#ef4444]/10">
                <div className="text-[10px] text-[#ef4444] font-bold">● CHANGED (SOURCE)</div>
                <div className="text-sm font-semibold text-[#f4f4f5] mt-1">
                  {simulatedChange === "db" ? "Primary Database" : "Auth Module"}
                </div>
                <div className="text-[10px] text-[#a1a1aa] mt-1">
                  Origin of structural modification
                </div>
              </div>

              {/* Component 2: Direct Impact d=1 */}
              <div className="p-4 rounded border border-[#f59e0b] bg-[#f59e0b]/10">
                <div className="text-[10px] text-[#f59e0b] font-bold">▲ DIRECT IMPACT (d=1)</div>
                <div className="text-sm font-semibold text-[#f4f4f5] mt-1">Backend API Layer</div>
                <div className="text-[10px] text-[#a1a1aa] mt-1">
                  ORM & client drivers invalidated
                </div>
              </div>

              {/* Component 3: Indirect Impact d=2 */}
              <div className="p-4 rounded border border-[#27272a] bg-[#18181b]">
                <div className="text-[10px] text-[#a1a1aa] font-medium">○ INDIRECT (d=2)</div>
                <div className="text-sm font-semibold text-[#f4f4f5] mt-1">Analytics Consumer</div>
                <div className="text-[10px] text-[#71717a] mt-1">
                  Change-data-capture stream broken
                </div>
              </div>

              {/* Component 4: Indirect Impact d=2 */}
              <div className="p-4 rounded border border-[#27272a] bg-[#18181b]">
                <div className="text-[10px] text-[#a1a1aa] font-medium">○ INDIRECT (d=2)</div>
                <div className="text-sm font-semibold text-[#f4f4f5] mt-1">Frontend Client UI</div>
                <div className="text-[10px] text-[#71717a] mt-1">
                  Response model schema mismatch
                </div>
              </div>
            </div>

            {/* AI Recommendation Box */}
            <div className="p-3.5 rounded bg-[#18181b] border border-[#27272a] text-xs text-[#a1a1aa] flex items-start gap-2.5">
              <Zap className="h-4 w-4 text-[#0ea5e9] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#f4f4f5] font-semibold">AI Mitigation Strategy: </span>
                Implement a repository abstraction adapter with dual schema reads for 14 days before dropping PostgreSQL relational foreign keys.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 6: FEATURE GRID (8 Structured Panels)
          ==================================================================== */}
      <section id="features" className="py-20 border-t border-[#27272a] bg-[#111113]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0ea5e9]">
              Technical Toolbox
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5] mt-1 font-mono uppercase">
              Architectural Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono mt-1">
              Engineered for principal architects, tech leads, and autonomous engineering teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            {/* Feature 1 */}
            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="h-7 w-7 rounded bg-[#111113] border border-[#27272a] flex items-center justify-center text-[#0ea5e9]">
                <Cpu className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-[#f4f4f5] uppercase">Architecture Generation</h3>
              <p className="text-[11px] text-[#71717a] leading-relaxed">
                LangGraph agents transform product descriptions into interconnected microservices and databases.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="h-7 w-7 rounded bg-[#111113] border border-[#27272a] flex items-center justify-center text-[#0ea5e9]">
                <Layers className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-[#f4f4f5] uppercase">Interactive System Maps</h3>
              <p className="text-[11px] text-[#71717a] leading-relaxed">
                React Flow canvas featuring Dagre auto-layout, custom component nodes, and drag-and-drop toolboxes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="h-7 w-7 rounded bg-[#111113] border border-[#27272a] flex items-center justify-center text-[#0ea5e9]">
                <FileText className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-[#f4f4f5] uppercase">Document Intelligence</h3>
              <p className="text-[11px] text-[#71717a] leading-relaxed">
                Automatic chunking and parsing for PDF, DOCX, TXT, and Markdown technical requirement files.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="h-7 w-7 rounded bg-[#111113] border border-[#27272a] flex items-center justify-center text-[#0ea5e9]">
                <Database className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-[#f4f4f5] uppercase">RAG-Powered Context</h3>
              <p className="text-[11px] text-[#71717a] leading-relaxed">
                768-dimensional Gemini embeddings in Supabase pgvector strictly isolated by project tenancy.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="h-7 w-7 rounded bg-[#111113] border border-[#27272a] flex items-center justify-center text-[#0ea5e9]">
                <Code2 className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-[#f4f4f5] uppercase">AI Agent Workflows</h3>
              <p className="text-[11px] text-[#71717a] leading-relaxed">
                Real-time Server-Sent Events stream live multi-agent reasoning iterations directly to your screen.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="h-7 w-7 rounded bg-[#111113] border border-[#27272a] flex items-center justify-center text-[#0ea5e9]">
                <Network className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-[#f4f4f5] uppercase">Dependency Analysis</h3>
              <p className="text-[11px] text-[#71717a] leading-relaxed">
                Formal directed graph traversal identifies bidirectional communication links and bottlenecks.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="h-7 w-7 rounded bg-[#111113] border border-[#27272a] flex items-center justify-center text-[#0ea5e9]">
                <Shield className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-[#f4f4f5] uppercase">Impact Detection</h3>
              <p className="text-[11px] text-[#71717a] leading-relaxed">
                Directed BFS calculates direct ($d=1$) and cascading ($d \ge 2$) failure blast radiuses on node updates.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-4 rounded border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="h-7 w-7 rounded bg-[#111113] border border-[#27272a] flex items-center justify-center text-[#0ea5e9]">
                <GitBranch className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-[#f4f4f5] uppercase">Architecture Versioning</h3>
              <p className="text-[11px] text-[#71717a] leading-relaxed">
                Git-like snapshot versions, immutable decision logs, and one-click rollback to previous baselines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 6.5: ARCHITECTURE DOCUMENTATION & RFC REGISTRY
          ==================================================================== */}
      <section id="documentation" className="py-20 border-t border-[#27272a] bg-[#09090b]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0ea5e9]">
              Documentation & Knowledge Base
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5] mt-1 font-mono uppercase">
              Architecture RFCs & Specifications
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono mt-1">
              Ingest, query, and verify technical requirements against deterministic system models with pgvector RAG.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-5 rounded-lg border border-[#27272a] bg-[#111113] space-y-3">
              <div className="text-[10px] text-[#0ea5e9] uppercase font-bold">RFC SPECIFICATION</div>
              <h3 className="text-sm font-semibold text-white">Automated Architecture RFCs</h3>
              <p className="text-xs text-[#71717a] leading-relaxed">
                Generate production-ready markdown architectural RFCs complete with sequence flows, security boundaries, and scalability metrics.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[#27272a] bg-[#111113] space-y-3">
              <div className="text-[10px] text-[#10b981] uppercase font-bold">RAG CORPUS</div>
              <h3 className="text-sm font-semibold text-white">Semantic Knowledge Grounding</h3>
              <p className="text-xs text-[#71717a] leading-relaxed">
                Connect your team&apos;s existing PRDs, OpenAPI specs, and compliance policies for real-time validation during AI generation.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[#27272a] bg-[#111113] space-y-3">
              <div className="text-[10px] text-[#f59e0b] uppercase font-bold">ADR AUDITING</div>
              <h3 className="text-sm font-semibold text-white">Architecture Decision Records</h3>
              <p className="text-xs text-[#71717a] leading-relaxed">
                Maintain immutable timestamped logs of every design tradeoff, alternative evaluated, and reasoning behind architectural choices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 7: CALL TO ACTION
          ==================================================================== */}
      <footer className="py-20 border-t border-[#27272a] bg-[#09090b]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-xs font-mono text-[#0ea5e9]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span>SYSTEM OPERATIONAL</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f4f4f5] uppercase font-mono">
              BUILD WITH ARCHITECTURAL CERTAINTY.
            </h2>

            <p className="text-sm text-[#a1a1aa] max-w-lg mx-auto leading-relaxed">
              Eliminate architectural blindspots. Model systems, dependencies, and blast radiuses before writing code.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <NavActions />
            </div>
          </div>

          {/* Minimalist Tech Company Footer Navigation using modular navbar components */}
          <div className="pt-8 border-t border-neutral-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
            <NavBrand showTag />
            <NavLinks className="gap-6 lg:gap-8 text-xs" />
            <div className="text-[11px] text-neutral-500 font-mono">
              © {new Date().getFullYear()} AgentArchitect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}