"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  Lightbulb,
  Search,
  CheckCircle2,
  Sparkles,
  FileText,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

interface StepMeta {
  id: number;
  label: string;
  badge: string;
  subhead: string;
  desc: string;
}

const THINKING_STEPS: StepMeta[] = [
  {
    id: 0,
    label: "01 · User Idea",
    badge: "UNDERSTAND BY USER",
    subhead: "Natural Language & Research Ingestion",
    desc: "Describe your concept in plain words, or bring requirements, PDFs, and notes. Sketch understands the full scope.",
  },
  {
    id: 1,
    label: "02 · Research",
    badge: "AUTONOMOUS RESEARCH",
    subhead: "Deep Tradeoff & Dependency Analysis",
    desc: "Autonomous agents compare database options, serverless vs edge, latency benchmarks, and architectural patterns.",
  },
  {
    id: 2,
    label: "03 · Decision",
    badge: "ARCHITECTURE SYNTHESIS",
    subhead: "Optimal Tech Stack & Component Mapping",
    desc: "The Decision Agent selects frameworks, protocols, and data models validated against engineering invariants.",
  },
  {
    id: 3,
    label: "04 · Make Sketch",
    badge: "DOODLE BLUEPRINT CANVAS",
    subhead: "Interactive Visual Architecture Generated",
    desc: "Hand-drawn architectural blueprint rendered in real-time with verified connections, ready to edit and export.",
  },
];

export function HeroThinkingAnimation() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedCanvasNode, setSelectedCanvasNode] = useState<string>("agent");

  // Refs for GSAP animation
  const doodleSvgRef = useRef<SVGSVGElement>(null);
  const gsapTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Cycle steps every 4.8s if not paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % THINKING_STEPS.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [isPaused]);

  // GSAP animation for hand-drawn doodle sketch lines when entering step 3 (Make Sketch)
  const triggerDoodleSketchAnimation = useCallback(() => {
    if (!doodleSvgRef.current) return;

    if (gsapTimelineRef.current) {
      gsapTimelineRef.current.kill();
    }

    const paths = doodleSvgRef.current.querySelectorAll<SVGPathElement>(".doodle-path");
    const nodes = doodleSvgRef.current.querySelectorAll<SVGGElement>(".doodle-node");
    const labels = doodleSvgRef.current.querySelectorAll<SVGTextElement>(".doodle-label");

    // Initialize paths with strokeDashoffset
    paths.forEach((path) => {
      const length = path.getTotalLength ? path.getTotalLength() : 300;
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    gsapTimelineRef.current = tl;

    // 1. Draw connecting doodle lines
    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 1.2,
      stagger: 0.12,
    });

    // 2. Pop in node boxes with elastic hand-sketched feel
    tl.fromTo(
      nodes,
      { scale: 0.85, opacity: 0, transformOrigin: "center center" },
      { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: "back.out(1.7)" },
      "-=0.6"
    );

    // 3. Reveal labels & indicators
    tl.fromTo(
      labels,
      { opacity: 0, y: 4 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.04 },
      "-=0.3"
    );
  }, []);

  useEffect(() => {
    if (currentStep === 3) {
      const timer = setTimeout(() => {
        triggerDoodleSketchAnimation();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentStep, triggerDoodleSketchAnimation]);

  return (
    <div className="w-full p-4 sm:p-6 font-mono relative overflow-hidden">
      {/* Top Header Bar with Step Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#f97316] animate-ping" />
          <span className="text-xs font-semibold text-white tracking-wide">
            AGENTIC THINKING PIPELINE
          </span>
        </div>

        {/* Play / Pause / Replay Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-1.5 rounded-md hover:bg-[#18181b] text-[#a1a1aa] hover:text-white transition-colors border border-transparent hover:border-white/10"
            title={isPaused ? "Resume animation" : "Pause animation"}
          >
            {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => {
              setCurrentStep(0);
              setIsPaused(false);
            }}
            className="p-1.5 rounded-md hover:bg-[#18181b] text-[#a1a1aa] hover:text-white transition-colors border border-transparent hover:border-white/10"
            title="Restart pipeline"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Step Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-3 pb-4">
        {THINKING_STEPS.map((step) => {
          const isActive = currentStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => {
                setCurrentStep(step.id);
                setIsPaused(true);
              }}
              className={`relative text-left px-3 py-2 rounded-lg text-xs transition-all border ${
                isActive
                  ? "bg-[#18181b] border-[#f97316]/70 text-white shadow-xs"
                  : "bg-black/60 border-white/10 text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#18181b]/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-tight">
                  {step.label}
                </span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f97316]" />
                )}
              </div>
              <div className="text-[10px] truncate mt-0.5 opacity-80">
                {step.badge}
              </div>

              {/* Step Progress Line */}
              {isActive && !isPaused && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f97316] rounded-b"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4.8, ease: "linear" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Step Content Area */}
      <div className="min-h-[300px] flex flex-col justify-between pt-1">
        <AnimatePresence mode="wait">
          {/* ============================================================
              STEP 0: USER IDEA & INGESTION ("Understand by User")
              ============================================================ */}
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl border border-[#f97316]/40 bg-[#18181b] relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] text-[#f97316] mb-2 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-[#f97316]" />
                    STEP 1: USER BRINGS THE IDEA
                  </span>
                  <span className="text-[10px] text-[#71717a]">RAW INPUT</span>
                </div>

                {/* Hand-drawn idea prompt */}
                <div className="p-3.5 rounded-lg bg-black border border-white/10 text-xs text-[#f4f4f5] leading-relaxed">
                  <span className="text-[#f97316] mr-2">›</span>
                  &ldquo;I need to build an AI software architecture platform. Users describe an app or upload specs; agents research tradeoffs, decide the tech stack, and sketch an interactive, editable blueprint canvas with drag-and-drop nodes.&rdquo;
                </div>

                {/* Ingested Documents & Notes */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="text-[#71717a]">Attached context:</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-black border border-white/10 text-[#a1a1aa]">
                    <FileText className="h-3 w-3 text-[#f97316]" />
                    spec-v2-architecture.pdf (14 pages)
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-black border border-white/10 text-[#a1a1aa]">
                    <FileText className="h-3 w-3 text-[#10b981]" />
                    security-requirements.docx
                  </span>
                </div>

                {/* Doodle Lightbulb & Scribble Hint */}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-[#71717a]">
                  <span>Sketch accepts plain ideas OR complete technical documentation.</span>
                  <span className="text-[#f97316] flex items-center gap-1">
                    Understanding User Scope →
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================================
              STEP 1: AUTONOMOUS RESEARCH
              ============================================================ */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-3"
            >
              <div className="p-4 rounded-xl border border-[#f97316]/40 bg-[#18181b] space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#f97316] font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 text-[#f97316] animate-pulse" />
                    STEP 2: RESEARCH & TRADEOFF AGENT
                  </span>
                  <span className="text-[10px] text-[#10b981]">● 3 BENCHMARKS EVALUATED</span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded bg-black border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#a1a1aa]">Frontend:</span>{" "}
                      <span className="text-[#f4f4f5] font-semibold">Next.js 16 App Router</span>
                    </div>
                    <span className="text-[10px] text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/30">
                      ✓ React 19 SSR + Zero Cold Start
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-black border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#a1a1aa]">Database:</span>{" "}
                      <span className="text-[#f4f4f5] font-semibold">Supabase PostgreSQL + pgvector</span>
                    </div>
                    <span className="text-[10px] text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/30">
                      ✓ Unified Relational + RAG Embeddings
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-black border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#a1a1aa]">Orchestration:</span>{" "}
                      <span className="text-[#f4f4f5] font-semibold">LangGraph StateGraph Engine</span>
                    </div>
                    <span className="text-[10px] text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/30">
                      ✓ Multi-Agent Cyclic Reasoning
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-[10px] text-[#a1a1aa] flex items-center justify-between">
                  <span>Synthesized 14 tradeoffs across compute, storage, and latency.</span>
                  <span className="text-[#f97316]">Feeding into Decision Matrix →</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================================
              STEP 2: ARCHITECTURE DECISION
              ============================================================ */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-3"
            >
              <div className="p-4 rounded-xl border border-[#f97316]/40 bg-[#18181b] space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#f97316] font-semibold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#10b981]" />
                    STEP 3: DECISION AGENT · SYSTEM SPEC VERIFIED
                  </span>
                  <span className="text-[10px] text-[#10b981]">0 INVARIANT CONFLICTS</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-lg bg-black border border-white/10 space-y-1">
                    <span className="text-[10px] text-[#f97316] font-semibold uppercase">TIER 1 · EDGE & UI</span>
                    <div className="font-semibold text-[#f4f4f5]">Interactive Canvas</div>
                    <div className="text-[10px] text-[#71717a]">React Flow · Tailwind · Zustand · Dagre</div>
                  </div>

                  <div className="p-3 rounded-lg bg-black border border-white/10 space-y-1">
                    <span className="text-[10px] text-[#f97316] font-semibold uppercase">TIER 2 · GATEWAY</span>
                    <div className="font-semibold text-[#f4f4f5]">API & Security</div>
                    <div className="text-[10px] text-[#71717a]">Next.js Route Handlers · Clerk Auth</div>
                  </div>

                  <div className="p-3 rounded-lg bg-black border border-white/10 space-y-1">
                    <span className="text-[10px] text-[#f97316] font-semibold uppercase">TIER 3 · AI BRAIN</span>
                    <div className="font-semibold text-[#f4f4f5]">Multi-Agent Graph</div>
                    <div className="text-[10px] text-[#71717a]">Input Orchestrator · RAG · Decision Agent</div>
                  </div>

                  <div className="p-3 rounded-lg bg-black border border-white/10 space-y-1">
                    <span className="text-[10px] text-[#f97316] font-semibold uppercase">TIER 4 · STORAGE</span>
                    <div className="font-semibold text-[#f4f4f5]">PostgreSQL + Vectors</div>
                    <div className="text-[10px] text-[#71717a]">Supabase DB · pgvector 1536d Cosine</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-[10px] text-[#a1a1aa] flex items-center justify-between">
                  <span>Architecture schema validated with Zod. Generating visual graph...</span>
                  <span className="text-[#10b981]">Ready to Sketch →</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================================
              STEP 3: MAKE SKETCH / DOODLE BLUEPRINT CANVAS (GSAP + FRAMER)
              ============================================================ */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-3"
            >
              {/* Doodle Sketch Canvas Container */}
              <div className="p-3 sm:p-4 rounded-xl border border-[#f97316]/50 bg-black relative overflow-hidden">
                {/* Canvas Status Bar */}
                <div className="flex items-center justify-between text-[11px] mb-2 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-[#10b981] font-semibold flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      DOODLE BLUEPRINT SKETCH
                    </span>
                    <span className="text-[10px] text-[#71717a]">
                      (Hand-drawn Animated Graph)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={triggerDoodleSketchAnimation}
                      className="text-[10px] text-[#f97316] hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="h-2.5 w-2.5" />
                      Redraw Sketch
                    </button>
                    <span className="text-[10px] text-[#10b981] px-1.5 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/30">
                      LIVE
                    </span>
                  </div>
                </div>

                {/* Hand-drawn Doodle Architectural SVG Diagram */}
                <div className="relative w-full h-[220px] bg-[#111111]/90 rounded-lg border border-white/10 p-2 flex items-center justify-center select-none">
                  {/* Subtle Grid Background */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(#f97316 1px, transparent 1px)`,
                      backgroundSize: "16px 16px",
                    }}
                  />

                  <svg
                    ref={doodleSvgRef}
                    viewBox="0 0 540 210"
                    className="w-full h-full max-w-[540px] z-10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Definitions for hand-drawn marker and gradients */}
                    <defs>
                      <marker
                        id="doodle-arrow"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#f97316" />
                      </marker>
                    </defs>

                    {/* ================= DOODLE CONNECTING PATHS ================= */}
                    {/* Path 1: Client -> API Gateway */}
                    <path
                      d="M 100 95 C 130 92, 140 96, 170 95"
                      stroke="#f97316"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeDasharray="4 3"
                      className="doodle-path"
                      markerEnd="url(#doodle-arrow)"
                    />

                    {/* Path 2: API Gateway -> Auth */}
                    <path
                      d="M 220 75 C 235 55, 255 45, 275 45"
                      stroke="#f97316"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="4 3"
                      className="doodle-path"
                      markerEnd="url(#doodle-arrow)"
                    />

                    {/* Path 3: API Gateway -> LangGraph Agent */}
                    <path
                      d="M 240 95 C 265 95, 280 95, 305 95"
                      stroke="#f97316"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      className="doodle-path"
                      markerEnd="url(#doodle-arrow)"
                    />

                    {/* Path 4: LangGraph Agent -> Supabase Postgres */}
                    <path
                      d="M 380 85 C 405 75, 420 65, 445 60"
                      stroke="#10b981"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeDasharray="4 3"
                      className="doodle-path"
                      markerEnd="url(#doodle-arrow)"
                    />

                    {/* Path 5: LangGraph Agent -> pgvector Store */}
                    <path
                      d="M 380 115 C 405 130, 420 145, 445 150"
                      stroke="#a855f7"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeDasharray="4 3"
                      className="doodle-path"
                      markerEnd="url(#doodle-arrow)"
                    />

                    {/* Animated Pulse along main artery (Client to Agent) */}
                    <circle r="3" fill="#fb923c" className="animate-pulse">
                      <animateMotion
                        path="M 100 95 C 130 92, 140 96, 170 95 L 240 95 C 265 95, 280 95, 305 95"
                        dur="2.8s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* ================= DOODLE NODE 1: CLIENT BROWSER ================= */}
                    <g
                      className="doodle-node cursor-pointer group"
                      onClick={() => setSelectedCanvasNode("client")}
                    >
                      {/* Hand-drawn style jittered box */}
                      <path
                        d="M 22 65 Q 60 63 98 66 Q 102 95 98 126 Q 58 128 22 125 Q 18 95 22 65 Z"
                        fill="#18181b"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="2"
                        className="transition-colors hover:stroke-[#f97316]"
                      />
                      {/* Browser header scribble */}
                      <circle cx="32" cy="74" r="2.5" fill="#f43f5e" />
                      <circle cx="40" cy="74" r="2.5" fill="#eab308" />
                      <circle cx="48" cy="74" r="2.5" fill="#10b981" />
                      <line x1="22" y1="82" x2="98" y2="82" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                      <text x="32" y="98" fill="#f4f4f5" fontSize="10" fontFamily="monospace" fontWeight="bold" className="doodle-label">
                        Client UI
                      </text>
                      <text x="32" y="112" fill="#71717a" fontSize="8" fontFamily="monospace" className="doodle-label">
                        Next.js App
                      </text>
                    </g>

                    {/* ================= DOODLE NODE 2: API GATEWAY ================= */}
                    <g
                      className="doodle-node cursor-pointer group"
                      onClick={() => setSelectedCanvasNode("gateway")}
                    >
                      <path
                        d="M 172 72 Q 206 69 238 73 Q 242 95 238 120 Q 204 123 172 119 Q 168 95 172 72 Z"
                        fill="#18181b"
                        stroke="#f97316"
                        strokeWidth="2"
                        className="transition-colors hover:stroke-[#fb923c]"
                      />
                      <text x="180" y="92" fill="#f97316" fontSize="10" fontFamily="monospace" fontWeight="bold" className="doodle-label">
                        Edge API
                      </text>
                      <text x="180" y="106" fill="#a1a1aa" fontSize="8" fontFamily="monospace" className="doodle-label">
                        Gateway
                      </text>
                    </g>

                    {/* ================= DOODLE NODE 3: AUTH / CLERK ================= */}
                    <g
                      className="doodle-node cursor-pointer group"
                      onClick={() => setSelectedCanvasNode("auth")}
                    >
                      <path
                        d="M 276 28 Q 320 26 360 29 Q 363 48 360 62 Q 318 64 276 61 Q 273 45 276 28 Z"
                        fill="#18181b"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1.8"
                        className="transition-colors hover:stroke-[#10b981]"
                      />
                      <text x="286" y="44" fill="#f4f4f5" fontSize="9" fontFamily="monospace" fontWeight="bold" className="doodle-label">
                        Auth Service
                      </text>
                      <text x="286" y="56" fill="#71717a" fontSize="8" fontFamily="monospace" className="doodle-label">
                        Clerk JWT / RBAC
                      </text>
                    </g>

                    {/* ================= DOODLE NODE 4: LANGGRAPH AGENT (CENTER BRAIN) ================= */}
                    <g
                      className="doodle-node cursor-pointer group"
                      onClick={() => setSelectedCanvasNode("agent")}
                    >
                      <path
                        d="M 306 70 Q 344 67 380 71 Q 385 95 381 123 Q 342 126 306 122 Q 302 95 306 70 Z"
                        fill="#18181b"
                        stroke="#f97316"
                        strokeWidth="2.4"
                        className="transition-colors hover:stroke-[#fb923c]"
                      />
                      {/* Doodle Brain/Node icon */}
                      <circle cx="318" cy="84" r="4" fill="#f97316" opacity="0.3" />
                      <circle cx="318" cy="84" r="2" fill="#f97316" />
                      <text x="328" y="88" fill="#f4f4f5" fontSize="10" fontFamily="monospace" fontWeight="bold" className="doodle-label">
                        LangGraph
                      </text>
                      <text x="318" y="104" fill="#f97316" fontSize="8.5" fontFamily="monospace" fontWeight="600" className="doodle-label">
                        Multi-Agent
                      </text>
                      <text x="318" y="116" fill="#71717a" fontSize="7.5" fontFamily="monospace" className="doodle-label">
                        RAG + Decision
                      </text>
                    </g>

                    {/* ================= DOODLE NODE 5: SUPABASE POSTGRES ================= */}
                    <g
                      className="doodle-node cursor-pointer group"
                      onClick={() => setSelectedCanvasNode("postgres")}
                    >
                      {/* Cylinder Top */}
                      <ellipse cx="480" cy="45" rx="38" ry="10" fill="#18181b" stroke="#10b981" strokeWidth="1.8" />
                      {/* Cylinder Body */}
                      <path
                        d="M 442 45 L 442 75 C 442 82, 518 82, 518 75 L 518 45"
                        fill="#18181b"
                        stroke="#10b981"
                        strokeWidth="1.8"
                      />
                      <text x="454" y="60" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold" className="doodle-label">
                        PostgreSQL
                      </text>
                      <text x="456" y="72" fill="#71717a" fontSize="7.5" fontFamily="monospace" className="doodle-label">
                        Supabase DB
                      </text>
                    </g>

                    {/* ================= DOODLE NODE 6: PGVECTOR STORE ================= */}
                    <g
                      className="doodle-node cursor-pointer group"
                      onClick={() => setSelectedCanvasNode("pgvector")}
                    >
                      <path
                        d="M 445 130 Q 482 127 518 131 Q 522 150 518 172 Q 480 175 445 171 Q 441 150 445 130 Z"
                        fill="#18181b"
                        stroke="#a855f7"
                        strokeWidth="1.8"
                        className="transition-colors hover:stroke-[#c084fc]"
                      />
                      <text x="456" y="148" fill="#c084fc" fontSize="9" fontFamily="monospace" fontWeight="bold" className="doodle-label">
                        pgvector
                      </text>
                      <text x="456" y="162" fill="#71717a" fontSize="7.5" fontFamily="monospace" className="doodle-label">
                        1536-dim RAG
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Inspect Selected Node Bar */}
                <div className="mt-2.5 p-2 rounded bg-[#18181b] border border-white/10 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#71717a]">Selected Node:</span>
                    <span className="text-[#f97316] font-bold uppercase">
                      {selectedCanvasNode === "client" && "Client UI · Next.js 16 + React Flow"}
                      {selectedCanvasNode === "gateway" && "Edge API Gateway · Route Handlers"}
                      {selectedCanvasNode === "auth" && "Authentication · Clerk JWT Token Verify"}
                      {selectedCanvasNode === "agent" && "LangGraph Multi-Agent Orchestrator"}
                      {selectedCanvasNode === "postgres" && "Primary DB · Supabase PostgreSQL"}
                      {selectedCanvasNode === "pgvector" && "Vector Store · pgvector Cosine Distance"}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#10b981]">
                    Status: Fully Connected
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Flow Pipeline Summary */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#71717a]">
          <div className="flex items-center gap-2">
            <span className="text-[#f97316]">✦</span>
            <span>Step {currentStep + 1} of 4:</span>
            <span className="text-white font-semibold">
              {THINKING_STEPS[currentStep].subhead}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {THINKING_STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentStep(s.id);
                  setIsPaused(true);
                }}
                className={`h-2 rounded-full transition-all ${
                  currentStep === s.id ? "w-6 bg-[#f97316]" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                title={`Go to step ${s.id + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
