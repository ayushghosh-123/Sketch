"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChaiHeroSection } from "@/components/home/ChaiHeroSection";
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
  MoveRight,
  MousePointer,
  Hand,
  Square,
  Circle,
  Type,
  Workflow,
  Monitor,
  Server,
  Bot,
  Activity,
  Wifi,
  Battery,
  Smartphone,
  Laptop
} from "lucide-react";

export default function LandingPage() {
  const [activePath, setActivePath] = useState<"no-docs" | "has-docs">("has-docs");

  // Selected node in interactive system preview
  const [selectedNode, setSelectedNode] = useState<"client" | "api" | "auth" | "backend" | "ai" | "db">("db");
  const [activeTool, setActiveTool] = useState<string>("select");
  const [devicePreview, setDevicePreview] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-orange-500/30 selection:text-orange-200 font-sans">
      {/* ====================================================================
          HERO SECTION (ChaiCode Design & Animation System)
          ==================================================================== */}
      <ChaiHeroSection />

      {/* ====================================================================
          SECTION: CORE PRODUCT WORKFLOW (TWO PATHS)
          ==================================================================== */}
      <section id="how-it-works" className="relative py-20 border-t border-white/10 bg-[#111111] before:absolute before:top-0 before:left-1/2 before:h-px before:w-full before:max-w-6xl before:-translate-x-1/2 before:bg-gradient-to-r before:from-transparent before:via-orange-500/30 before:to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#f97316]">
              The Core Principle
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2 font-mono uppercase">
              You do not need to have research documents.
            </h2>
            <p className="text-sm text-[#a1a1aa] mt-2 font-normal leading-relaxed">
              If you only have an idea, <strong className="text-white font-medium">Sketch researches the problem for you</strong>.
              If you already have research, Sketch understands and incorporates it.
            </p>

            {/* Path Switcher */}
            <div className="flex items-center gap-2 mt-6">
              <button
                onClick={() => setActivePath("has-docs")}
                className={`px-4 py-2 text-xs font-mono font-medium transition-colors cursor-pointer ${
                  activePath === "has-docs"
                    ? "bg-white text-black font-semibold chai-btn-primary"
                    : "bg-black text-[#71717a] border border-white/15 hover:text-white rounded-md"
                }`}
              >
                Path 1: User Has Documents
              </button>
              <button
                onClick={() => setActivePath("no-docs")}
                className={`px-4 py-2 text-xs font-mono font-medium transition-colors cursor-pointer ${
                  activePath === "no-docs"
                    ? "bg-white text-black font-semibold chai-btn-primary"
                    : "bg-black text-[#71717a] border border-white/15 hover:text-white rounded-md"
                }`}
              >
                Path 2: User Has No Documents
              </button>
            </div>
          </div>

          {/* Dynamic Path Diagram with Bento Grid & Pastel Pills (ChaiCode Card Animation) */}
          {activePath === "has-docs" ? (
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-2.5 font-mono text-xs">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ amount: 0.2, once: true }}
                transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                className="p-3.5 rounded-xl border border-white/10 bg-black hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer space-y-1.5"
              >
                <div className="inline-flex text-[10px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20 font-bold">01 / INPUT</div>
                <div className="font-semibold text-white">Idea + Documents</div>
                <p className="text-[10px] text-[#71717a]">PDF, DOCX, TXT, MD notes ingested.</p>
              </motion.div>
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ amount: 0.2, once: true }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                className="p-3.5 rounded-xl border border-white/10 bg-black hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer space-y-1.5"
              >
                <div className="inline-flex text-[10px] px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/20 font-bold">02 / RAG AGENT</div>
                <div className="font-semibold text-white">Project Context</div>
                <p className="text-[10px] text-[#71717a]">Semantic extraction answers key specs.</p>
              </motion.div>
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ amount: 0.2, once: true }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                className="p-3.5 rounded-xl border border-white/10 bg-black hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer space-y-1.5"
              >
                <div className="inline-flex text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 font-bold">03 / RESEARCH</div>
                <div className="font-semibold text-white">Research Agent</div>
                <p className="text-[10px] text-[#71717a]">Researches missing info & options.</p>
              </motion.div>
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ amount: 0.2, once: true }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                className="p-3.5 rounded-xl border border-white/10 bg-black hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer space-y-1.5"
              >
                <div className="inline-flex text-[10px] px-2 py-0.5 rounded bg-orange-500/15 text-[#f97316] border border-orange-500/20 font-bold">04 / DECISION</div>
                <div className="font-semibold text-white">Decision Agent</div>
                <p className="text-[10px] text-[#71717a]">Decides architecture & tech stack.</p>
              </motion.div>
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ amount: 0.2, once: true }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                className="p-3.5 rounded-xl border border-white/10 bg-black hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer space-y-1.5"
              >
                <div className="inline-flex text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 font-bold">05 / VALIDATE</div>
                <div className="font-semibold text-white">Validation Step</div>
                <p className="text-[10px] text-[#71717a]">Checks integrity before visual layout.</p>
              </motion.div>
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ amount: 0.2, once: true }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                className="p-3.5 rounded-xl border border-emerald-500/40 bg-black hover:border-emerald-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 cursor-pointer space-y-1.5"
              >
                <div className="inline-flex text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold">06 / CANVAS</div>
                <div className="font-semibold text-white">Editable Canvas</div>
                <p className="text-[10px] text-[#10b981]">Interactive React Flow studio ready.</p>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ amount: 0.2, once: true }}
                transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl border border-white/10 bg-black hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer space-y-1.5"
              >
                <div className="inline-flex text-[10px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20 font-bold">01 / INPUT</div>
                <div className="font-semibold text-white">Idea Only</div>
                <p className="text-[10px] text-[#71717a]">Describe what you want to build in plain text.</p>
              </motion.div>
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ amount: 0.2, once: true }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl border border-white/10 bg-black hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer space-y-1.5"
              >
                <div className="inline-flex text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 font-bold">02 / RESEARCH</div>
                <div className="font-semibold text-white">Autonomous Research</div>
                <p className="text-[10px] text-[#71717a]">Sketch researches best solutions from scratch.</p>
              </motion.div>
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ amount: 0.2, once: true }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl border border-white/10 bg-black hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer space-y-1.5"
              >
                <div className="inline-flex text-[10px] px-2 py-0.5 rounded bg-orange-500/15 text-[#f97316] border border-orange-500/20 font-bold">03 / DECISION</div>
                <div className="font-semibold text-white">Decision Agent</div>
                <p className="text-[10px] text-[#71717a]">Selects tiers, components, and trade-offs.</p>
              </motion.div>
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ amount: 0.2, once: true }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl border border-white/10 bg-black hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer space-y-1.5"
              >
                <div className="inline-flex text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 font-bold">04 / VALIDATE</div>
                <div className="font-semibold text-white">Validation Step</div>
                <p className="text-[10px] text-[#71717a]">Enforces security and scalability rules.</p>
              </motion.div>
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ amount: 0.2, once: true }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl border border-emerald-500/40 bg-black hover:border-emerald-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 cursor-pointer space-y-1.5"
              >
                <div className="inline-flex text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold">05 / CANVAS</div>
                <div className="font-semibold text-white">Editable Canvas</div>
                <p className="text-[10px] text-[#10b981]">Complete visual architecture generated.</p>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          SECTION: INTERACTIVE SYSTEM MAP STUDIO PREVIEW
          ==================================================================== */}
      <section id="product" className="py-20 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#f97316]">
                Interactive Architecture Editor
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1 font-mono uppercase">
                Explore the Sketch Workspace
              </h2>
              <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1">
                Click components in the visual canvas below to inspect technical details and connections.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Device Preview Switcher (Desktop Canvas vs Floating Mobile Phone) */}
              <div className="flex items-center p-1 rounded-xl bg-[#141417] border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setDevicePreview("desktop")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-mono text-[11px] cursor-pointer ${
                    devicePreview === "desktop"
                      ? "bg-white/10 text-white font-semibold shadow-sm"
                      : "text-[#71717a] hover:text-white"
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" /> Desktop Studio
                </button>
                <button
                  type="button"
                  onClick={() => setDevicePreview("mobile")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-mono text-[11px] cursor-pointer ${
                    devicePreview === "mobile"
                      ? "bg-[#f97316] text-black font-semibold shadow-sm"
                      : "text-[#71717a] hover:text-white"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Mobile Phone
                </button>
              </div>

              <Link href="/dashboard">
                <button className="bg-white hover:bg-neutral-200 text-black font-semibold text-xs h-9 px-4 transition-all duration-200 flex items-center shadow-sm chai-btn-primary cursor-pointer font-mono">
                  Open Workspace →
                </button>
              </Link>
            </div>
          </div>

          {/* VIEW 1: FLOATING 3D SMARTPHONE PREVIEW (Visible on mobile view or when Mobile Phone is selected) */}
          <div className={devicePreview === "mobile" ? "block" : "block sm:hidden"}>
            <div className="relative py-8 flex flex-col items-center justify-center [perspective:1200px]">
              {/* Ambient radial glow aura */}
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tr from-orange-600/25 to-emerald-500/15 rounded-full blur-[100px] pointer-events-none -z-10" />

              {/* 3D Floating Mobile Phone Structure */}
              <motion.div
                animate={{
                  y: [-9, 9, -9],
                  rotateX: [2.5, -2.5, 2.5],
                  rotateY: [-3.5, 3.5, -3.5],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-full max-w-[325px] sm:max-w-[360px] rounded-[48px] p-[10px] bg-gradient-to-b from-[#2e2e33] via-[#151518] to-[#25252a] border border-white/25 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),0_0_50px_rgba(249,115,22,0.15)] font-mono select-none"
              >
                {/* Physical Hardware Buttons */}
                {/* Action button */}
                <div className="absolute -left-[13px] top-24 w-[3px] h-6 bg-[#404047] rounded-l-sm" />
                {/* Volume Up */}
                <div className="absolute -left-[13px] top-34 w-[3px] h-9 bg-[#404047] rounded-l-sm" />
                {/* Volume Down */}
                <div className="absolute -left-[13px] top-47 w-[3px] h-9 bg-[#404047] rounded-l-sm" />
                {/* Power Button */}
                <div className="absolute -right-[13px] top-34 w-[3px] h-12 bg-[#404047] rounded-r-sm" />

                {/* Inner Bezel Screen */}
                <div className="relative rounded-[38px] overflow-hidden bg-[#09090b] border border-black min-h-[570px] flex flex-col justify-between">
                  {/* Status Bar with Dynamic Island */}
                  <div className="relative z-30 pt-3 px-5 pb-2 bg-[#09090b] flex items-center justify-between text-[11px] text-white">
                    <span className="font-semibold tracking-tighter text-xs">9:41</span>

                    {/* Dynamic Island pill */}
                    <div className="w-24 h-5 bg-black rounded-full border border-white/10 flex items-center justify-between px-2 shadow-inner">
                      <div className="w-2 h-2 rounded-full bg-[#18181b] border border-white/20" />
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                        <span className="text-[8px] text-emerald-400 font-mono">LIVE</span>
                      </div>
                    </div>

                    {/* Battery & Wifi */}
                    <div className="flex items-center gap-1.5 text-white/80">
                      <Wifi className="w-3 h-3" />
                      <Battery className="w-3.5 h-3.5 text-white fill-white/80" />
                    </div>
                  </div>

                  {/* Glass Glare Sheen Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none z-20" />

                  {/* Mobile Canvas Viewport */}
                  <div className="relative flex-1 px-3 py-2 flex flex-col justify-between overflow-hidden bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:14px_14px]">
                    {/* Top Mini Workspace Title & Floating Tools Pill */}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className="flex items-center justify-between w-full px-1 text-[10px] text-[#a1a1aa]">
                        <span className="text-[#f97316] font-semibold flex items-center gap-1">
                          ◈ Architecture Canvas
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-[#a1a1aa]">
                          Mobile Studio
                        </span>
                      </div>

                      {/* Floating Mobile Toolbar Dock */}
                      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#18181b]/95 backdrop-blur-md border border-white/10 shadow-lg">
                        {[
                          { id: "select", label: "Select", icon: MousePointer },
                          { id: "hand", label: "Pan", icon: Hand },
                          { id: "rect", label: "Box", icon: Square },
                          { id: "circle", label: "Circle", icon: Circle },
                          { id: "connector", label: "Wire", icon: Workflow },
                        ].map((tool) => {
                          const Icon = tool.icon;
                          const isActive = activeTool === tool.id;
                          return (
                            <button
                              key={tool.id}
                              type="button"
                              onClick={() => setActiveTool(tool.id)}
                              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                isActive
                                  ? "bg-[#f97316] text-black shadow-sm"
                                  : "text-[#a1a1aa] hover:text-white"
                              }`}
                              title={tool.label}
                            >
                              <Icon className="w-3 h-3" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Nodes Canvas with Animated SVG Connector Wires */}
                    <div className="relative w-full my-auto py-2">
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
                        viewBox="0 0 300 170"
                        preserveAspectRatio="none"
                      >
                        {/* Wire 1: Client to API */}
                        <path
                          d="M 120 40 C 135 40, 155 40, 175 40"
                          stroke="#f97316"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                          fill="none"
                        />
                        <circle cx="148" cy="40" r="2.5" fill="#f97316" className="animate-pulse" />

                        {/* Wire 2: API to DB */}
                        <path
                          d="M 235 75 C 235 90, 235 100, 235 115"
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                          fill="none"
                        />
                        <circle cx="235" cy="95" r="2.5" fill="#10b981" className="animate-pulse" />

                        {/* Wire 3: API to AI */}
                        <path
                          d="M 215 75 C 190 95, 140 95, 100 115"
                          stroke="#f97316"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                          fill="none"
                          opacity="0.5"
                        />

                        {/* Wire 4: AI to DB */}
                        <path
                          d="M 120 135 C 135 135, 155 135, 175 135"
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                          fill="none"
                        />
                      </svg>

                      {/* 4 Interactive Touch Nodes */}
                      <div className="relative z-10 grid grid-cols-2 gap-3">
                        {/* Node 1: Web App */}
                        <div
                          onClick={() => setSelectedNode("client")}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            selectedNode === "client"
                              ? "bg-[#18181b] border-[#f97316] ring-2 ring-[#f97316]/30 shadow-[0_0_15px_rgba(249,115,22,0.25)]"
                              : "bg-[#111113]/90 border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="text-[9px] text-[#f97316] uppercase flex items-center justify-between font-semibold">
                            <span className="flex items-center gap-1"><Monitor className="w-2.5 h-2.5" /> Client</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                          </div>
                          <div className="text-[11px] font-bold text-white mt-1">Web App</div>
                          <div className="text-[9px] text-[#71717a]">Next.js 16</div>
                        </div>

                        {/* Node 2: API Router */}
                        <div
                          onClick={() => setSelectedNode("api")}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            selectedNode === "api"
                              ? "bg-[#18181b] border-[#f97316] ring-2 ring-[#f97316]/30 shadow-[0_0_15px_rgba(249,115,22,0.25)]"
                              : "bg-[#111113]/90 border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="text-[9px] text-[#a1a1aa] uppercase flex items-center justify-between font-semibold">
                            <span className="flex items-center gap-1"><Server className="w-2.5 h-2.5" /> API</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                          </div>
                          <div className="text-[11px] font-bold text-white mt-1">API Router</div>
                          <div className="text-[9px] text-[#71717a]">Handlers</div>
                        </div>

                        {/* Node 3: AI Tutor Engine */}
                        <div
                          onClick={() => setSelectedNode("ai")}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            selectedNode === "ai"
                              ? "bg-[#18181b] border-[#f97316] ring-2 ring-[#f97316]/30 shadow-[0_0_15px_rgba(249,115,22,0.25)]"
                              : "bg-[#111113]/90 border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="text-[9px] text-[#f97316] uppercase flex items-center justify-between font-semibold">
                            <span className="flex items-center gap-1"><Bot className="w-2.5 h-2.5" /> Agent</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                          </div>
                          <div className="text-[11px] font-bold text-white mt-1">AI Engine</div>
                          <div className="text-[9px] text-[#71717a]">LangGraph</div>
                        </div>

                        {/* Node 4: Database */}
                        <div
                          onClick={() => setSelectedNode("db")}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            selectedNode === "db"
                              ? "bg-[#18181b] border-[#f97316] ring-2 ring-[#f97316]/30 shadow-[0_0_15px_rgba(249,115,22,0.25)]"
                              : "bg-[#111113]/90 border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="text-[9px] text-[#10b981] uppercase flex items-center justify-between font-semibold">
                            <span className="flex items-center gap-1"><Database className="w-2.5 h-2.5" /> DB</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                          </div>
                          <div className="text-[11px] font-bold text-white mt-1">Primary DB</div>
                          <div className="text-[9px] text-[#71717a]">PostgreSQL</div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Inspector Drawer Sheet */}
                    <div className="relative z-10 p-3 rounded-2xl bg-[#141417]/95 border border-white/10 backdrop-blur-md shadow-lg text-[10px]">
                      <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                        <div className="flex items-center gap-1 text-[9px] font-bold uppercase text-[#71717a]">
                          <Sliders className="w-2.5 h-2.5 text-[#f97316]" /> Inspector
                        </div>
                        <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                          LIVE SYNC
                        </span>
                      </div>

                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[#71717a]">NODE:</span>
                          <span className="font-bold text-white">
                            {selectedNode === "client" && "Web Application"}
                            {selectedNode === "api" && "API Router"}
                            {selectedNode === "ai" && "AI Tutor Engine"}
                            {selectedNode === "db" && "Primary Database"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#71717a]">TECH:</span>
                          <span className="text-[#f97316] font-mono">
                            {selectedNode === "client" && "Next.js / TypeScript"}
                            {selectedNode === "api" && "Route Handlers"}
                            {selectedNode === "ai" && "LangGraph + Gemini"}
                            {selectedNode === "db" && "Supabase + pgvector"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#71717a]">LATENCY:</span>
                          <span className="text-white font-mono">&lt; 14ms (p95)</span>
                        </div>
                      </div>
                    </div>

                    {/* Mini Command Prompt */}
                    <div className="relative z-10 mt-2 p-2 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between text-[9px]">
                      <div className="flex items-center gap-1 text-[#a1a1aa] truncate">
                        <span className="text-[#f97316]">✦</span>
                        <span className="truncate">&ldquo;Add Redis caching&rdquo;</span>
                      </div>
                      <Link href="/dashboard" className="text-[#f97316] font-semibold hover:underline shrink-0 ml-1">
                        Try →
                      </Link>
                    </div>
                  </div>

                  {/* iOS Home Indicator Bar */}
                  <div className="pb-2 pt-1 flex justify-center bg-[#09090b]">
                    <div className="w-28 h-1 bg-white/40 rounded-full" />
                  </div>
                </div>
              </motion.div>

              {/* Dynamic Soft Ambient Shadow Beneath Floating Phone */}
              <motion.div
                animate={{
                  scale: [0.85, 1.05, 0.85],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-44 sm:w-56 h-4 bg-orange-500/20 rounded-full blur-xl mt-4 pointer-events-none"
              />
            </div>
          </div>

          {/* VIEW 2: DESKTOP STUDIO CANVAS (Visible on sm: screens when Desktop Studio is active) */}
          <div className={devicePreview === "desktop" ? "hidden sm:block" : "hidden"}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ amount: 0.15, once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="rounded-2xl border border-white/10 bg-[#0d0d0f] overflow-hidden font-mono shadow-2xl transition-all duration-300 hover:border-orange-500/30"
            >
              {/* Top Workspace Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#141417] border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#f97316] animate-pulse">◈</span>
                  <span className="font-semibold text-white tracking-wide">AI Learning Platform · Architecture Studio</span>
                  <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#a1a1aa]">
                    Canvas v2.4
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-[#10b981] flex items-center gap-1.5 font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                    </span>
                    TOPOLOGY LIVE
                  </span>
                  <span className="text-[#71717a] hidden md:inline">4 NODES · 4 EDGES ACTIVE</span>
                </div>
              </div>

              {/* Studio Body: Canvas + Inspector */}
              <div className="flex flex-col lg:flex-row min-h-[460px]">
                {/* Main Interactive Canvas Area */}
                <div className="relative flex-1 p-6 sm:p-10 flex flex-col justify-center items-center bg-[#09090b] bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] overflow-hidden min-h-[360px]">
                  {/* Floating Canvas Toolbar (Figma / tldraw style) */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 rounded-xl bg-[#18181b]/90 backdrop-blur-md border border-white/10 shadow-2xl max-w-[95%]">
                    {[
                      { id: "select", label: "Select", icon: MousePointer },
                      { id: "hand", label: "Hand", icon: Hand },
                      { id: "rect", label: "Box", icon: Square },
                      { id: "circle", label: "Circle", icon: Circle },
                      { id: "text", label: "Text", icon: Type },
                      { id: "connector", label: "Wire", icon: Workflow },
                    ].map((tool) => {
                      const Icon = tool.icon;
                      const isActive = activeTool === tool.id;
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => setActiveTool(tool.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#f97316] text-black font-semibold shadow-md shadow-orange-500/20"
                              : "text-[#a1a1aa] hover:text-white hover:bg-white/10"
                          }`}
                          title={tool.label}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[11px]">{tool.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Nodes Container with Connecting Wires */}
                  <div className="relative w-full max-w-lg mt-8 mb-4">
                    {/* SVG Connector Wires Overlay */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
                      viewBox="0 0 480 220"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="glowOrange" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#fb923c" stopOpacity="0.6" />
                        </linearGradient>
                        <linearGradient id="glowGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#34d399" stopOpacity="0.5" />
                        </linearGradient>
                      </defs>

                      {/* Edge 1: Web Application -> API Router */}
                      <path
                        d="M 190 48 C 215 48, 235 48, 260 48"
                        stroke="#f97316"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        fill="none"
                        opacity="0.75"
                      />
                      <circle cx="225" cy="48" r="3" fill="#f97316" className="animate-pulse" />

                      {/* Edge 2: API Router -> AI Tutor Engine */}
                      <path
                        d="M 350 95 C 330 130, 200 120, 150 145"
                        stroke="#f97316"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        fill="none"
                        opacity="0.4"
                      />

                      {/* Edge 3: API Router -> Primary Database */}
                      <path
                        d="M 370 95 C 370 115, 370 125, 370 145"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        fill="none"
                        opacity="0.75"
                      />
                      <circle cx="370" cy="120" r="3" fill="#10b981" className="animate-pulse" />

                      {/* Edge 4: AI Tutor Engine -> Primary Database */}
                      <path
                        d="M 190 180 C 215 180, 235 180, 260 180"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        fill="none"
                        opacity="0.6"
                      />
                    </svg>

                    {/* Nodes Grid */}
                    <div className="relative z-10 grid grid-cols-2 gap-x-8 sm:gap-x-14 gap-y-8">
                      {/* Node 1: Web Application */}
                      <div
                        onClick={() => setSelectedNode("client")}
                        className={`relative p-3.5 rounded-xl border transition-all cursor-pointer backdrop-blur-sm ${
                          selectedNode === "client"
                            ? "bg-[#18181b] border-[#f97316] ring-2 ring-[#f97316]/40 shadow-[0_0_20px_rgba(249,115,22,0.25)]"
                            : "bg-[#111113]/90 border-white/10 hover:border-white/25 hover:bg-[#161619]"
                        }`}
                      >
                        {/* Port Right */}
                        <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0d0d0f] border-2 border-[#f97316] flex items-center justify-center">
                          <span className="w-1 h-1 rounded-full bg-[#f97316]" />
                        </span>
                        <div className="text-[10px] text-[#f97316] uppercase flex items-center justify-between tracking-wider font-semibold">
                          <span className="flex items-center gap-1.5">
                            <Monitor className="w-3 h-3" /> FRONTEND
                          </span>
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                        </div>
                        <div className="text-xs font-bold text-white mt-1.5">Web Application</div>
                        <div className="text-[10px] text-[#71717a] mt-0.5">Next.js / TypeScript</div>
                      </div>

                      {/* Node 2: API Gateway */}
                      <div
                        onClick={() => setSelectedNode("api")}
                        className={`relative p-3.5 rounded-xl border transition-all cursor-pointer backdrop-blur-sm ${
                          selectedNode === "api"
                            ? "bg-[#18181b] border-[#f97316] ring-2 ring-[#f97316]/40 shadow-[0_0_20px_rgba(249,115,22,0.25)]"
                            : "bg-[#111113]/90 border-white/10 hover:border-white/25 hover:bg-[#161619]"
                        }`}
                      >
                        {/* Port Left & Bottom */}
                        <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0d0d0f] border-2 border-[#f97316] flex items-center justify-center">
                          <span className="w-1 h-1 rounded-full bg-[#f97316]" />
                        </span>
                        <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#0d0d0f] border-2 border-[#10b981] flex items-center justify-center">
                          <span className="w-1 h-1 rounded-full bg-[#10b981]" />
                        </span>
                        <div className="text-[10px] text-[#a1a1aa] uppercase flex items-center justify-between tracking-wider font-semibold">
                          <span className="flex items-center gap-1.5">
                            <Server className="w-3 h-3" /> API
                          </span>
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                        </div>
                        <div className="text-xs font-bold text-white mt-1.5">API Router</div>
                        <div className="text-[10px] text-[#71717a] mt-0.5">Route Handlers</div>
                      </div>

                      {/* Node 3: AI Agent System */}
                      <div
                        onClick={() => setSelectedNode("ai")}
                        className={`relative p-3.5 rounded-xl border transition-all cursor-pointer backdrop-blur-sm ${
                          selectedNode === "ai"
                            ? "bg-[#18181b] border-[#f97316] ring-2 ring-[#f97316]/40 shadow-[0_0_20px_rgba(249,115,22,0.25)]"
                            : "bg-[#111113]/90 border-white/10 hover:border-white/25 hover:bg-[#161619]"
                        }`}
                      >
                        {/* Port Right */}
                        <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0d0d0f] border-2 border-[#10b981] flex items-center justify-center">
                          <span className="w-1 h-1 rounded-full bg-[#10b981]" />
                        </span>
                        <div className="text-[10px] text-[#f97316] uppercase flex items-center justify-between tracking-wider font-semibold">
                          <span className="flex items-center gap-1.5">
                            <Bot className="w-3 h-3" /> AI AGENT
                          </span>
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                        </div>
                        <div className="text-xs font-bold text-white mt-1.5">AI Tutor Engine</div>
                        <div className="text-[10px] text-[#71717a] mt-0.5">LangGraph.js + Gemini</div>
                      </div>

                      {/* Node 4: Database */}
                      <div
                        onClick={() => setSelectedNode("db")}
                        className={`relative p-3.5 rounded-xl border transition-all cursor-pointer backdrop-blur-sm ${
                          selectedNode === "db"
                            ? "bg-[#18181b] border-[#f97316] ring-2 ring-[#f97316]/40 shadow-[0_0_20px_rgba(249,115,22,0.25)]"
                            : "bg-[#111113]/90 border-white/10 hover:border-white/25 hover:bg-[#161619]"
                        }`}
                      >
                        {/* Port Left & Top */}
                        <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0d0d0f] border-2 border-[#10b981] flex items-center justify-center">
                          <span className="w-1 h-1 rounded-full bg-[#10b981]" />
                        </span>
                        <span className="absolute left-1/2 -top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#0d0d0f] border-2 border-[#10b981] flex items-center justify-center">
                          <span className="w-1 h-1 rounded-full bg-[#10b981]" />
                        </span>
                        <div className="text-[10px] text-[#10b981] uppercase flex items-center justify-between tracking-wider font-semibold">
                          <span className="flex items-center gap-1.5">
                            <Database className="w-3 h-3" /> DATABASE
                          </span>
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                        </div>
                        <div className="text-xs font-bold text-white mt-1.5">Primary Database</div>
                        <div className="text-[10px] text-[#71717a] mt-0.5">Supabase PostgreSQL</div>
                      </div>
                    </div>
                  </div>

                  {/* Micro-hint */}
                  <div className="text-[11px] text-[#71717a] text-center mt-2 flex items-center gap-1.5">
                    <span className="text-[#f97316]">✦</span> Click any node to inspect architecture specifications
                  </div>
                </div>

                {/* Right: Component Inspector Panel */}
                <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#121215] p-5 text-xs flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="text-[10px] uppercase tracking-wider text-[#71717a] font-bold flex items-center gap-1.5">
                        <Sliders className="w-3 h-3 text-[#f97316]" /> Component Inspector
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                        SYNCED
                      </span>
                    </div>

                    {selectedNode === "db" && (
                      <div className="space-y-3.5">
                        <div>
                          <div className="text-[10px] text-[#71717a] uppercase font-semibold">Node Name</div>
                          <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
                            Primary Database
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-[#a1a1aa]">Stateful</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#71717a] uppercase font-semibold">Engine & Schema</div>
                          <div className="text-xs text-[#f97316] font-mono mt-0.5">Supabase PostgreSQL 16 + pgvector</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#71717a] uppercase font-semibold">Specifications</div>
                          <p className="text-[11px] text-[#a1a1aa] leading-relaxed mt-0.5">
                            ACID relational database with Row-Level Security policies and vector embeddings for semantic search & retrieval.
                          </p>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#71717a] uppercase font-semibold mb-1">Incoming / Outgoing Edges</div>
                          <div className="flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedNode("api")}
                              className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#f97316] hover:bg-white/10 transition-all cursor-pointer"
                            >
                              ← API Router
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedNode("ai")}
                              className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#10b981] hover:bg-white/10 transition-all cursor-pointer"
                            >
                              ← AI Tutor Engine
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedNode === "client" && (
                      <div className="space-y-3.5">
                        <div>
                          <div className="text-[10px] text-[#71717a] uppercase font-semibold">Node Name</div>
                          <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
                            Web Application
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-[#a1a1aa]">Edge Ingress</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#71717a] uppercase font-semibold">Framework</div>
                          <div className="text-xs text-[#f97316] font-mono mt-0.5">Next.js 16 + React 19 + TypeScript</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#71717a] uppercase font-semibold">Specifications</div>
                          <p className="text-[11px] text-[#a1a1aa] leading-relaxed mt-0.5">
                            Responsive user interface with server components, client state, and streaming real-time chat with diagram renderers.
                          </p>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#71717a] uppercase font-semibold mb-1">Incoming / Outgoing Edges</div>
                          <div className="flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedNode("api")}
                              className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#f97316] hover:bg-white/10 transition-all cursor-pointer"
                            >
                              → API Router
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedNode === "api" && (
                      <div className="space-y-3.5">
                        <div>
                          <div className="text-[10px] text-[#71717a] uppercase font-semibold">Node Name</div>
                          <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
                            API Router
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-[#a1a1aa]">Gateway</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#71717a] uppercase font-semibold">Runtime Handler</div>
                          <div className="text-xs text-[#f97316] font-mono mt-0.5">Next.js App Route Handlers</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#71717a] uppercase font-semibold">Specifications</div>
                          <p className="text-[11px] text-[#a1a1aa] leading-relaxed mt-0.5">
                            Dispatches HTTP/WebSocket requests, validates JWT session tokens, and executes transactional operations.
                          </p>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#71717a] uppercase font-semibold mb-1">Incoming / Outgoing Edges</div>
                          <div className="flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedNode("client")}
                              className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#a1a1aa] hover:bg-white/10 transition-all cursor-pointer"
                            >
                              ← Web App
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedNode("ai")}
                              className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#f97316] hover:bg-white/10 transition-all cursor-pointer"
                            >
                              → AI Tutor Engine
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedNode("db")}
                              className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#10b981] hover:bg-white/10 transition-all cursor-pointer"
                            >
                              → Primary DB
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedNode === "ai" && (
                      <div className="space-y-3.5">
                        <div>
                          <div className="text-[10px] text-[#71717a] uppercase font-semibold">Node Name</div>
                          <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
                            AI Tutor Engine
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-[#a1a1aa]">Multi-Agent</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#71717a] uppercase font-semibold">Orchestration</div>
                          <div className="text-xs text-[#f97316] font-mono mt-0.5">LangGraph.js + Gemini 1.5 Pro</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#71717a] uppercase font-semibold">Specifications</div>
                          <p className="text-[11px] text-[#a1a1aa] leading-relaxed mt-0.5">
                            Autonomous multi-agent system executing curriculum retrieval, step-by-step code guidance, and validation checks.
                          </p>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#71717a] uppercase font-semibold mb-1">Incoming / Outgoing Edges</div>
                          <div className="flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedNode("api")}
                              className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#f97316] hover:bg-white/10 transition-all cursor-pointer"
                            >
                              ← API Router
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedNode("db")}
                              className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#10b981] hover:bg-white/10 transition-all cursor-pointer"
                            >
                              → Primary DB (vector)
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10 text-[11px] text-[#71717a] flex items-center justify-between">
                    <span>Latency: <strong className="text-white font-mono">&lt; 14ms</strong></span>
                    <span className="text-[#10b981]">99.9% Uptime</span>
                  </div>
                </div>
              </div>

              {/* Bottom AI Command Bar Preview */}
              <div className="p-3 bg-[#141417] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#a1a1aa]">
                <div className="flex items-center gap-2">
                  <span className="text-[#f97316]">✦</span>
                  <span className="text-[#71717a]">Try prompt in studio:</span>
                  <span className="text-white bg-black/60 px-2.5 py-0.5 rounded-md border border-white/15 font-mono text-[11px]">
                    &ldquo;Add Redis caching tier between API and DB&rdquo;
                  </span>
                </div>
                <Link href="/dashboard" className="text-[#f97316] hover:text-orange-400 hover:underline font-mono text-xs flex items-center gap-1">
                  Open Full Studio <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION: 7-STEP PRODUCT STORY (FEATURES)
          ==================================================================== */}
      {/* ====================================================================
          SECTION: 7-STEP PRODUCT STORY (FEATURES)
          ==================================================================== */}
      <section id="features" className="relative py-20 border-t border-white/10 bg-[#111111]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#f97316]">
              The 7-Step Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1 font-mono uppercase">
              How Sketch Works
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1">
              Simple enough for a beginner to understand. Powerful enough for senior architects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-5 rounded-xl border border-white/10 bg-black hover:border-white/20 transition-all space-y-2.5">
              <span className="inline-flex text-[10px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20 font-bold">
                STEP 1
              </span>
              <h3 className="text-sm font-semibold text-white">Tell Sketch what you want to build.</h3>
              <p className="text-[#71717a] leading-relaxed">
                Describe your software idea in simple words. No formal architecture degree required.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-black hover:border-white/20 transition-all space-y-2.5">
              <span className="inline-flex text-[10px] px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/20 font-bold">
                STEP 2
              </span>
              <h3 className="text-sm font-semibold text-white">Upload research if you have it.</h3>
              <p className="text-[#71717a] leading-relaxed">
                Add PDFs, technical RFCs, or notes. If you don&apos;t have any, Sketch handles it.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-black hover:border-white/20 transition-all space-y-2.5">
              <span className="inline-flex text-[10px] px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 font-bold">
                STEP 3
              </span>
              <h3 className="text-sm font-semibold text-white">Sketch understands your information.</h3>
              <p className="text-[#71717a] leading-relaxed">
                RAG agent extracts requirements, existing decisions, and constraints from your documents.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-black hover:border-white/20 transition-all space-y-2.5">
              <span className="inline-flex text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 font-bold">
                STEP 4
              </span>
              <h3 className="text-sm font-semibold text-white">Sketch researches anything missing.</h3>
              <p className="text-[#71717a] leading-relaxed">
                Research agent evaluates current technologies, frameworks, and architecture patterns.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-black hover:border-white/20 transition-all space-y-2.5">
              <span className="inline-flex text-[10px] px-2 py-0.5 rounded bg-orange-500/15 text-[#f97316] border border-orange-500/20 font-bold">
                STEP 5
              </span>
              <h3 className="text-sm font-semibold text-white">Sketch decides how your system works.</h3>
              <p className="text-[#71717a] leading-relaxed">
                Decision agent specifies layers, components, connections, and trade-offs.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-black hover:border-white/20 transition-all space-y-2.5">
              <span className="inline-flex text-[10px] px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/20 font-bold">
                STEP 6
              </span>
              <h3 className="text-sm font-semibold text-white">Sketch creates your visual architecture.</h3>
              <p className="text-[#71717a] leading-relaxed">
                Canvas agent renders an organized React Flow diagram with automated Dagre layout.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-emerald-500/40 bg-black hover:border-emerald-500/60 transition-all space-y-2.5 md:col-span-2">
              <span className="inline-flex text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold">
                STEP 7 · FULL CONTROL
              </span>
              <h3 className="text-sm font-semibold text-white">You can edit everything.</h3>
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
      <section className="relative py-24 border-t border-white/10 bg-black overflow-hidden">
        {/* Ambient ChaiCode Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] rounded-full bg-gradient-to-r from-amber-600/15 via-orange-500/15 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111111] border border-white/15 text-xs font-mono text-[#f97316]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span>DESCRIBE IT · RESEARCH IT · SKETCH IT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-sans">
            You bring the idea.<br />
            Sketch figures out the rest.
          </h2>

          <p className="text-sm sm:text-base text-[#a1a1aa] max-w-xl mx-auto leading-relaxed">
            Turn your software idea into an intelligent, editable architecture canvas in seconds.
          </p>

          <div className="pt-4 flex justify-center">
            <Link href="/signup">
              <button className="bg-white hover:bg-neutral-200 text-black font-semibold text-xs h-12 px-8 transition-all duration-200 flex items-center shadow-lg chai-btn-primary cursor-pointer font-mono">
                Sign Up & Start Sketching →
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}