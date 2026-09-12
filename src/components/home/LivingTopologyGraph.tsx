"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const STEPS = [
  {
    id: 0,
    state: "INGESTING REQS",
    percent: 0,
    description: "Parsing incoming requirement payload & invariants",
  },
  {
    id: 1,
    state: "ANALYZING GRAPH",
    percent: 25,
    description: "Resolving application hierarchy & edge dependencies",
  },
  {
    id: 2,
    state: "EXPANDING NODES",
    percent: 50,
    description: "Determining edge gateway & router ingress boundaries",
  },
  {
    id: 3,
    state: "WIRING ADJACENCIES",
    percent: 75,
    description: "Orchestrating storage persistence and agent executor tier",
  },
  {
    id: 4,
    state: "TOPOLOGY STABLE",
    percent: 100,
    description: "Synthesized graph verified with deterministic BFS traversal",
  },
];

export function LivingTopologyGraph() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pulseTextRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const particle1Ref = useRef<SVGCircleElement>(null);
  const particle2Ref = useRef<SVGCircleElement>(null);
  const particleSplitLeftRef = useRef<SVGCircleElement>(null);
  const particleSplitRightRef = useRef<SVGCircleElement>(null);
  const particleMergeLeftRef = useRef<SVGCircleElement>(null);
  const particleMergeRightRef = useRef<SVGCircleElement>(null);

  // Auto-advance simulation ticker with pause capability
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [isPaused]);

  // GSAP: Continuous particle flow and metric counter tweening
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Numerical counter tween for the pulse cycle percentage
      const targetPercent = STEPS[activeStep].percent;
      const counterObj = {
        val: activeStep === 0 ? 0 : STEPS[(activeStep - 1 + STEPS.length) % STEPS.length].percent,
      };

      gsap.to(counterObj, {
        val: targetPercent,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          if (pulseTextRef.current) {
            pulseTextRef.current.textContent = `PULSE CYCLE: ${Math.round(counterObj.val)}%`;
          }
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${Math.min(100, Math.max(0, counterObj.val))}%`;
          }
        },
      });

      // Flow particle 1 (User -> Frontend)
      if (particle1Ref.current) {
        gsap.fromTo(
          particle1Ref.current,
          { attr: { cy: 2 }, opacity: 0 },
          {
            attr: { cy: 22 },
            opacity: activeStep >= 0 ? 1 : 0.2,
            duration: 1.2,
            repeat: -1,
            ease: "power1.inOut",
          }
        );
      }

      // Flow particle 2 (Frontend -> Router)
      if (particle2Ref.current) {
        gsap.fromTo(
          particle2Ref.current,
          { attr: { cy: 2 }, opacity: 0 },
          {
            attr: { cy: 22 },
            opacity: activeStep >= 1 ? 1 : 0.2,
            duration: 1.2,
            repeat: -1,
            delay: 0.2,
            ease: "power1.inOut",
          }
        );
      }

      // Branching particles (Router -> Database & Agent)
      if (particleSplitLeftRef.current && particleSplitRightRef.current) {
        gsap.fromTo(
          [particleSplitLeftRef.current, particleSplitRightRef.current],
          { strokeDashoffset: 60, opacity: 0 },
          {
            strokeDashoffset: 0,
            opacity: activeStep >= 2 ? 1 : 0.2,
            duration: 1.5,
            repeat: -1,
            ease: "power1.inOut",
          }
        );
      }

      // Merging particles (Database & Agent -> Final result)
      if (particleMergeLeftRef.current && particleMergeRightRef.current) {
        gsap.fromTo(
          [particleMergeLeftRef.current, particleMergeRightRef.current],
          { strokeDashoffset: 60, opacity: 0 },
          {
            strokeDashoffset: 0,
            opacity: activeStep >= 3 ? 1 : 0.2,
            duration: 1.5,
            repeat: -1,
            ease: "power1.inOut",
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [activeStep]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="rounded-lg border border-[#27272a] bg-[#111113] p-5 shadow-2xl relative overflow-hidden font-mono select-none"
    >
      {/* Background ambient scanline grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(to right, #0ea5e9 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#27272a] text-xs relative z-10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0ea5e9] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0ea5e9]" />
          </span>
          <span className="text-[#f4f4f5] font-semibold tracking-wide">
            LIVING TOPOLOGY GRAPH
          </span>
        </div>

        {/* State readout with Framer Motion AnimatePresence */}
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="text-[#71717a]">STATE:</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={activeStep}
              initial={{ opacity: 0, y: -4, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 4, filter: "blur(2px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`font-semibold tracking-wider ${
                activeStep === 4 ? "text-[#10b981]" : "text-[#0ea5e9]"
              }`}
            >
              {STEPS[activeStep].state}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress micro-bar */}
      <div className="w-full bg-[#18181b] h-0.5 relative overflow-hidden">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#10b981] transition-all duration-300"
          style={{ width: "0%" }}
        />
      </div>

      {/* Graphical Canvas Flow */}
      <div className="py-6 flex flex-col items-center gap-2 text-xs relative z-10">
        {/* ================================================================= */}
        {/* NODE 1: USER CLIENT */}
        {/* ================================================================= */}
        <motion.div
          animate={{
            scale: activeStep === 0 ? 1.03 : 1,
            borderColor: activeStep >= 0 ? "#0ea5e9" : "#27272a",
            boxShadow:
              activeStep === 0
                ? "0 0 16px rgba(14, 165, 233, 0.25)"
                : "0 0 0px transparent",
          }}
          transition={{ duration: 0.35 }}
          className={`px-5 py-2.5 rounded border transition-colors ${
            activeStep >= 0
              ? "bg-[#18181b] text-[#f4f4f5]"
              : "bg-[#111113] text-[#71717a]"
          }`}
        >
          <div className="text-[10px] text-[#71717a] tracking-wider text-center">
            CLIENT INGRESS
          </div>
          <div className="font-semibold flex items-center justify-center gap-1.5 mt-0.5">
            <motion.span
              animate={{ rotate: activeStep === 0 ? [0, 90, 0] : 0 }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-[#0ea5e9] text-xs"
            >
              ◈
            </motion.span>
            <span>USER CLIENT</span>
          </div>
        </motion.div>

        {/* CONNECTOR 1: Vertical Flow */}
        <div className="w-full flex flex-col items-center py-0.5">
          <svg width="24" height="26" viewBox="0 0 24 26" className="overflow-visible">
            {/* Base line */}
            <line
              x1="12"
              y1="0"
              x2="12"
              y2="20"
              stroke={activeStep >= 0 ? "#0ea5e9" : "#27272a"}
              strokeWidth="1.5"
              strokeOpacity={activeStep >= 0 ? 0.8 : 0.4}
            />
            {/* Arrowhead */}
            <polygon
              points="9,20 12,24 15,20"
              fill={activeStep >= 0 ? "#0ea5e9" : "#71717a"}
            />
            {/* Flow particle */}
            <circle
              ref={particle1Ref}
              cx="12"
              cy="0"
              r="2.5"
              fill="#38bdf8"
              filter="drop-shadow(0 0 3px #0ea5e9)"
            />
          </svg>
        </div>

        {/* ================================================================= */}
        {/* NODE 2: FRONTEND */}
        {/* ================================================================= */}
        <motion.div
          animate={{
            scale: activeStep === 1 ? 1.03 : 1,
            borderColor: activeStep >= 1 ? "#0ea5e9" : "#27272a",
            boxShadow:
              activeStep === 1
                ? "0 0 16px rgba(14, 165, 233, 0.25)"
                : "0 0 0px transparent",
          }}
          transition={{ duration: 0.35 }}
          className={`px-5 py-2.5 rounded border transition-colors ${
            activeStep >= 1
              ? "bg-[#18181b] text-[#f4f4f5]"
              : "bg-[#111113] text-[#71717a]"
          }`}
        >
          <div className="text-[10px] text-[#71717a] tracking-wider text-center">
            APPLICATION TIER
          </div>
          <div className="font-semibold flex items-center justify-center gap-1.5 mt-0.5">
            <span className="text-[#0ea5e9] text-xs">◈</span>
            <span>FRONTEND (Next.js)</span>
          </div>
        </motion.div>

        {/* CONNECTOR 2: Vertical Flow */}
        <div className="w-full flex flex-col items-center py-0.5">
          <svg width="24" height="26" viewBox="0 0 24 26" className="overflow-visible">
            <line
              x1="12"
              y1="0"
              x2="12"
              y2="20"
              stroke={activeStep >= 1 ? "#0ea5e9" : "#27272a"}
              strokeWidth="1.5"
              strokeOpacity={activeStep >= 1 ? 0.8 : 0.4}
            />
            <polygon
              points="9,20 12,24 15,20"
              fill={activeStep >= 1 ? "#0ea5e9" : "#71717a"}
            />
            <circle
              ref={particle2Ref}
              cx="12"
              cy="0"
              r="2.5"
              fill="#38bdf8"
              filter="drop-shadow(0 0 3px #0ea5e9)"
            />
          </svg>
        </div>

        {/* ================================================================= */}
        {/* NODE 3: ROUTER / GATEWAY */}
        {/* ================================================================= */}
        <motion.div
          animate={{
            scale: activeStep === 2 ? 1.03 : 1,
            borderColor: activeStep >= 2 ? "#0ea5e9" : "#27272a",
            boxShadow:
              activeStep === 2
                ? "0 0 16px rgba(14, 165, 233, 0.25)"
                : "0 0 0px transparent",
          }}
          transition={{ duration: 0.35 }}
          className={`px-5 py-2.5 rounded border transition-colors ${
            activeStep >= 2
              ? "bg-[#18181b] text-[#f4f4f5]"
              : "bg-[#111113] text-[#71717a]"
          }`}
        >
          <div className="text-[10px] text-[#71717a] tracking-wider text-center">
            ROUTER / GATEWAY
          </div>
          <div className="font-semibold flex items-center justify-center gap-1.5 mt-0.5">
            <span className="text-[#0ea5e9] text-xs font-bold">↔</span>
            <span>API LAYER (Edge / REST)</span>
          </div>
        </motion.div>

        {/* CONNECTOR 3: Branching Split */}
        <div className="w-full flex justify-center py-1">
          <svg width="220" height="28" viewBox="0 0 220 28" className="overflow-visible">
            {/* Top stem */}
            <line
              x1="110"
              y1="0"
              x2="110"
              y2="10"
              stroke={activeStep >= 2 ? "#0ea5e9" : "#27272a"}
              strokeWidth="1.5"
              strokeOpacity={activeStep >= 2 ? 0.8 : 0.4}
            />
            {/* Horizontal split bar */}
            <path
              d="M55 20 L55 10 L165 10 L165 20"
              fill="none"
              stroke={activeStep >= 2 ? "#0ea5e9" : "#27272a"}
              strokeWidth="1.5"
              strokeOpacity={activeStep >= 2 ? 0.8 : 0.4}
            />
            {/* Left Arrowhead */}
            <polygon
              points="51,20 55,25 59,20"
              fill={activeStep >= 2 ? "#0ea5e9" : "#71717a"}
            />
            {/* Right Arrowhead */}
            <polygon
              points="161,20 165,25 169,20"
              fill={activeStep >= 2 ? "#0ea5e9" : "#71717a"}
            />

            {/* Branching animated circuit lines */}
            <path
              ref={particleSplitLeftRef}
              d="M110 0 L110 10 L55 10 L55 24"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="10 40"
            />
            <path
              ref={particleSplitRightRef}
              d="M110 0 L110 10 L165 10 L165 24"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="10 40"
            />
          </svg>
        </div>

        {/* ================================================================= */}
        {/* SPLIT TIER: DATABASE & AI AGENT */}
        {/* ================================================================= */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* Node 4A: Database */}
          <motion.div
            animate={{
              scale: activeStep === 3 ? 1.02 : 1,
              borderColor: activeStep >= 3 ? "#0ea5e9" : "#27272a",
              boxShadow:
                activeStep === 3
                  ? "0 0 16px rgba(14, 165, 233, 0.25)"
                  : "0 0 0px transparent",
            }}
            transition={{ duration: 0.35 }}
            className={`p-3 rounded border text-center transition-colors ${
              activeStep >= 3
                ? "bg-[#18181b] text-[#f4f4f5]"
                : "bg-[#111113] text-[#71717a]"
            }`}
          >
            <div className="text-[10px] text-[#71717a] tracking-wider">STORAGE TIER</div>
            <div className="font-semibold mt-0.5 flex items-center justify-center gap-1">
              <span className="text-[#0ea5e9] text-xs">◉</span>
              <span>DATABASE</span>
            </div>
            <div className="text-[10px] text-[#a1a1aa] mt-0.5">PostgreSQL</div>
          </motion.div>

          {/* Node 4B: AI Agent */}
          <motion.div
            animate={{
              scale: activeStep === 3 ? 1.02 : 1,
              borderColor: activeStep >= 3 ? "#0ea5e9" : "#27272a",
              boxShadow:
                activeStep === 3
                  ? "0 0 16px rgba(14, 165, 233, 0.25)"
                  : "0 0 0px transparent",
            }}
            transition={{ duration: 0.35 }}
            className={`p-3 rounded border text-center transition-colors ${
              activeStep >= 3
                ? "bg-[#18181b] text-[#f4f4f5]"
                : "bg-[#111113] text-[#71717a]"
            }`}
          >
            <div className="text-[10px] text-[#71717a] tracking-wider">COMPUTE TIER</div>
            <div className="font-semibold mt-0.5 flex items-center justify-center gap-1">
              <span className="text-[#10b981] text-xs">◎</span>
              <span>AI AGENT</span>
            </div>
            <div className="text-[10px] text-[#a1a1aa] mt-0.5">LangGraph Exec</div>
          </motion.div>
        </div>

        {/* CONNECTOR 4: Merging Split */}
        <div className="w-full flex justify-center py-1">
          <svg width="220" height="28" viewBox="0 0 220 28" className="overflow-visible">
            {/* Merging horizontal collector */}
            <path
              d="M55 0 L55 12 L165 12 L165 0"
              fill="none"
              stroke={activeStep >= 3 ? "#0ea5e9" : "#27272a"}
              strokeWidth="1.5"
              strokeOpacity={activeStep >= 3 ? 0.8 : 0.4}
            />
            {/* Center stem down */}
            <line
              x1="110"
              y1="12"
              x2="110"
              y2="22"
              stroke={activeStep >= 3 ? "#0ea5e9" : "#27272a"}
              strokeWidth="1.5"
              strokeOpacity={activeStep >= 3 ? 0.8 : 0.4}
            />
            {/* Merged Arrowhead */}
            <polygon
              points="106,22 110,27 114,22"
              fill={activeStep >= 3 ? "#0ea5e9" : "#71717a"}
            />

            {/* Merging animated circuit paths */}
            <path
              ref={particleMergeLeftRef}
              d="M55 0 L55 12 L110 12 L110 26"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="10 40"
            />
            <path
              ref={particleMergeRightRef}
              d="M165 0 L165 12 L110 12 L110 26"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="10 40"
            />
          </svg>
        </div>

        {/* ================================================================= */}
        {/* NODE 5: ARCHITECTURE SYNTHESIZED RESULT */}
        {/* ================================================================= */}
        <motion.div
          animate={{
            scale: activeStep === 4 ? 1.02 : 1,
            borderColor: activeStep === 4 ? "#0ea5e9" : "#27272a",
            boxShadow:
              activeStep === 4
                ? "0 0 24px rgba(14, 165, 233, 0.3), inset 0 0 12px rgba(14, 165, 233, 0.1)"
                : "0 0 0px transparent",
          }}
          transition={{ duration: 0.4 }}
          className={`px-5 py-3 rounded border w-full text-center transition-colors ${
            activeStep === 4
              ? "bg-[#0ea5e9]/10 text-[#0ea5e9]"
              : "bg-[#111113] text-[#71717a]"
          }`}
        >
          <div className="text-[10px] tracking-widest text-[#a1a1aa]">
            TOPOLOGY RESULT
          </div>
          <div className="font-bold text-sm text-[#f4f4f5] mt-0.5 flex items-center justify-center gap-2">
            <span
              className={`h-2 w-2 rounded-full transition-colors ${
                activeStep === 4
                  ? "bg-[#10b981] animate-pulse"
                  : "bg-neutral-600"
              }`}
            />
            <span>ARCHITECTURE SYNTHESIZED (12 NODES, 18 EDGES)</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Simulation Status Bar */}
      <div className="pt-3 border-t border-[#27272a] flex items-center justify-between text-[10px] text-[#71717a] relative z-10">
        <span ref={pulseTextRef} className="font-mono font-medium">
          PULSE CYCLE: {STEPS[activeStep].percent}%
        </span>
        <div className="flex items-center gap-1.5 text-[#10b981] font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-ping" />
          <span>DETERMINISTIC BFS VERIFIED</span>
        </div>
      </div>
    </div>
  );
}
