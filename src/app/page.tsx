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
  MoveRight
} from "lucide-react";

export default function LandingPage() {
  const [activePath, setActivePath] = useState<"no-docs" | "has-docs">("has-docs");

  // Selected node in interactive system preview
  const [selectedNode, setSelectedNode] = useState<"client" | "api" | "auth" | "backend" | "ai" | "db">("db");

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
            <Link href="/dashboard">
              <button className="bg-white hover:bg-neutral-200 text-black font-semibold text-xs h-9 px-4 transition-all duration-200 flex items-center shadow-sm chai-btn-primary cursor-pointer font-mono">
                Open Workspace →
              </button>
            </Link>
          </div>

          {/* Interactive Workspace Studio (ChaiCode Card Animation) */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ amount: 0.15, once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.008 }}
            className="rounded-2xl border border-white/10 bg-[#111111] overflow-hidden font-mono shadow-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer"
          >
            {/* Top Workspace Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#18181b] border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#f97316]">◈</span>
                <span className="font-semibold text-white">AI Learning Platform · Architecture</span>
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
              <div className="lg:col-span-3 border-r border-white/10 bg-black p-4 text-xs space-y-4">
                <div className="text-[10px] uppercase tracking-wider text-[#71717a] font-semibold">
                  Workspace Tools
                </div>
                <div className="space-y-1">
                  <div className="p-1.5 rounded bg-[#18181b] border border-white/10 text-white flex items-center gap-2">
                    <span className="text-[#f97316]">↖</span> Select
                  </div>
                  <div className="p-1.5 rounded bg-[#111111] text-[#a1a1aa] flex items-center gap-2">
                    <span>✋</span> Hand / Pan
                  </div>
                  <div className="p-1.5 rounded bg-[#111111] text-[#a1a1aa] flex items-center gap-2">
                    <span>□</span> Rectangle
                  </div>
                  <div className="p-1.5 rounded bg-[#111111] text-[#a1a1aa] flex items-center gap-2">
                    <span>○</span> Circle
                  </div>
                  <div className="p-1.5 rounded bg-[#111111] text-[#a1a1aa] flex items-center gap-2">
                    <span>T</span> Text Box
                  </div>
                  <div className="p-1.5 rounded bg-[#111111] text-[#a1a1aa] flex items-center gap-2">
                    <span>→</span> Connector
                  </div>
                </div>
              </div>

              {/* Center: Interactive Canvas Nodes (6 cols) */}
              <div className="lg:col-span-6 p-6 flex flex-col justify-center items-center relative bg-black bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px]">
                <div className="grid grid-cols-2 gap-5 w-full max-w-md">
                  {/* Node 1: Web Application */}
                  <div
                    onClick={() => setSelectedNode("client")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedNode === "client"
                        ? "bg-[#18181b] border-[#f97316] ring-1 ring-[#f97316]"
                        : "bg-[#111111] border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="text-[10px] text-[#f97316] uppercase flex items-center justify-between">
                      <span>◈ FRONTEND</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    </div>
                    <div className="text-xs font-semibold text-white mt-1">Web Application</div>
                    <div className="text-[10px] text-[#71717a] mt-0.5">Next.js / TypeScript</div>
                  </div>

                  {/* Node 2: API Gateway */}
                  <div
                    onClick={() => setSelectedNode("api")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedNode === "api"
                        ? "bg-[#18181b] border-[#f97316] ring-1 ring-[#f97316]"
                        : "bg-[#111111] border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="text-[10px] text-[#a1a1aa] uppercase flex items-center justify-between">
                      <span>↔ API</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    </div>
                    <div className="text-xs font-semibold text-white mt-1">API Router</div>
                    <div className="text-[10px] text-[#71717a] mt-0.5">Route Handlers</div>
                  </div>

                  {/* Node 3: AI Agent System */}
                  <div
                    onClick={() => setSelectedNode("ai")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedNode === "ai"
                        ? "bg-[#18181b] border-[#f97316] ring-1 ring-[#f97316]"
                        : "bg-[#111111] border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="text-[10px] text-[#f97316] uppercase flex items-center justify-between">
                      <span>◎ AI AGENT</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    </div>
                    <div className="text-xs font-semibold text-white mt-1">AI Tutor Engine</div>
                    <div className="text-[10px] text-[#71717a] mt-0.5">LangGraph.js + Gemini</div>
                  </div>

                  {/* Node 4: Database */}
                  <div
                    onClick={() => setSelectedNode("db")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedNode === "db"
                        ? "bg-[#18181b] border-[#f97316] ring-1 ring-[#f97316]"
                        : "bg-[#111111] border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="text-[10px] text-[#10b981] uppercase flex items-center justify-between">
                      <span>◉ DATABASE</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    </div>
                    <div className="text-xs font-semibold text-white mt-1">Primary Database</div>
                    <div className="text-[10px] text-[#71717a] mt-0.5">Supabase PostgreSQL</div>
                  </div>
                </div>
              </div>

              {/* Right: Component Inspector Panel (3 cols) */}
              <div className="lg:col-span-3 border-l border-white/10 bg-black p-4 text-xs space-y-4">
                <div className="text-[10px] uppercase tracking-wider text-[#71717a] font-semibold">
                  Inspector
                </div>

                {selectedNode === "db" && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-[#71717a]">NAME</div>
                      <div className="text-sm font-semibold text-white">Primary Database</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">TECHNOLOGY</div>
                      <div className="text-xs text-[#f97316]">Supabase PostgreSQL 16 + pgvector</div>
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
                      <div className="text-sm font-semibold text-white">Web Application</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">TECHNOLOGY</div>
                      <div className="text-xs text-[#f97316]">Next.js / TypeScript & React</div>
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
                      <div className="text-sm font-semibold text-white">API Router</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">TECHNOLOGY</div>
                      <div className="text-xs text-[#f97316]">Next.js Route Handlers</div>
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
                      <div className="text-sm font-semibold text-white">AI Tutor Engine</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a]">TECHNOLOGY</div>
                      <div className="text-xs text-[#f97316]">LangGraph.js + Gemini 1.5</div>
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
            <div className="p-3 bg-[#18181b] border-t border-white/10 flex items-center justify-between text-xs text-[#a1a1aa]">
              <div className="flex items-center gap-2">
                <span className="text-[#f97316]">✦</span>
                <span className="text-[#71717a]">Try command:</span>
                <span className="text-white bg-black px-2.5 py-0.5 rounded-md border border-white/15 font-mono">
                  &ldquo;Add Redis caching&rdquo;
                </span>
              </div>
              <Link href="/dashboard" className="text-[#f97316] hover:underline font-mono text-xs">
                Try in Workspace →
              </Link>
            </div>
          </motion.div>
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