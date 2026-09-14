"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ChevronsDown } from "lucide-react";
import { HeroThinkingAnimation } from "@/components/home/HeroThinkingAnimation";

export function ChaiHeroSection() {
  return (
    <section className="relative pt-12 pb-24 md:pt-16 md:pb-32 w-full overflow-hidden">
      {/* ====================================================================
          BACKGROUND ATMOSPHERE: ChaiCode Signature Glow & Honeycomb Mesh
          ==================================================================== */}
      {/* 1. Amber / Orange Top-Right Radial Glow Spotlight */}
      <div className="absolute top-0 right-1/4 -translate-y-12 w-[650px] sm:w-[850px] h-[400px] sm:h-[500px] rounded-full bg-gradient-to-b from-orange-500/20 via-amber-600/10 to-transparent blur-[140px] pointer-events-none -z-10 animate-chai-pulse" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[450px] h-[300px] rounded-full bg-gradient-to-tr from-amber-600/15 via-orange-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* 2. Signature Honeycomb Wireframe Mesh Cluster (Exact ChaiCode Background Atmosphere) */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-6xl pointer-events-none select-none opacity-30 sm:opacity-40 -z-10 overflow-hidden">
        <svg
          viewBox="0 0 1200 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto max-h-[360px]"
        >
          <defs>
            <radialGradient
              id="chaiHexGlow"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Hexagon cluster floating behind hero headline */}
          {/* Column 1 */}
          <path
            d="M680 120 L710 102.5 L740 120 L740 155 L710 172.5 L680 155 Z"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.2"
            fill="url(#chaiHexGlow)"
            fillOpacity="0.08"
          />
          <path
            d="M745 157.5 L775 140 L805 157.5 L805 192.5 L775 210 L745 192.5 Z"
            stroke="rgba(249,115,22,0.4)"
            strokeWidth="1.2"
            fill="url(#chaiHexGlow)"
            fillOpacity="0.12"
          />
          <path
            d="M615 157.5 L645 140 L675 157.5 L675 192.5 L645 210 L615 192.5 Z"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1.2"
            fill="none"
          />

          {/* Column 2 */}
          <path
            d="M680 195 L710 177.5 L740 195 L740 230 L710 247.5 L680 230 Z"
            stroke="rgba(249,115,22,0.35)"
            strokeWidth="1.2"
            fill="url(#chaiHexGlow)"
            fillOpacity="0.09"
          />
          <path
            d="M810 120 L840 102.5 L870 120 L870 155 L840 172.5 L810 155 Z"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M810 195 L840 177.5 L870 195 L870 230 L840 247.5 L810 230 Z"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            fill="none"
          />

          {/* Column 3 - subtle drifting outliers */}
          <path
            d="M550 120 L580 102.5 L610 120 L610 155 L580 172.5 L550 155 Z"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M875 157.5 L905 140 L935 157.5 L935 192.5 L905 210 L875 192.5 Z"
            stroke="rgba(249,115,22,0.25)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      {/* ====================================================================
          HERO CONTENT CONTAINER
          ==================================================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center relative z-10">
        {/* 1. Subtle Animated Technical Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#111111]/90 border border-white/10 text-xs font-mono text-[#a1a1aa] shadow-inner backdrop-blur-md">
            {/* Animated Chai liquid tea wave beacon */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            <span className="tracking-wide">AI SOFTWARE ARCHITECTURE WORKSPACE</span>
          </div>
        </motion.div>

        {/* 2. Headline Masterpiece: Corinthia Cursive Flourish overlapping Massive Gradient "SKETCH" */}
        <div className="w-full max-w-5xl mx-auto select-none relative flex flex-col items-center">
          {/* Elegant Google Font Corinthia cursive text */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="font-corinthia text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-normal tracking-tight relative z-20 -mb-5 sm:-mb-8 md:-mb-10 lg:-mb-14 drop-shadow-md"
            style={{
              textShadow: "0 2px 20px rgba(0,0,0,0.8)",
            }}
          >
            Autonomous Architecture
          </motion.p>

          {/* Massive Display Title "SKETCH" matching ChaiCode "COHORT" */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="w-full relative z-10 animate-chai-float"
          >
            {/* SVG Vector Display Title with ChaiCode Gradient stops: #FEC48C -> #F77628 -> #CC4909 */}
            <svg
              viewBox="0 0 1600 280"
              className="w-full h-auto max-h-[130px] sm:max-h-[190px] md:max-h-[240px] lg:max-h-[280px] drop-shadow-[0_15px_40px_rgba(247,118,40,0.22)] select-none overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="chaiTitleGradient"
                  x1="80"
                  y1="140"
                  x2="1520"
                  y2="140"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#FEC48C" />
                  <stop offset="35.1%" stopColor="#F77628" />
                  <stop offset="100%" stopColor="#CC4909" />
                </linearGradient>

                <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="15" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* High-Impact Geometric Block Text "SKETCH" matching ChaiCode "COHORT" */}
              <text
                x="50%"
                y="80%"
                textAnchor="middle"
                fill="url(#chaiTitleGradient)"
                fontFamily="var(--font-anton), 'Anton', Impact, sans-serif"
                fontWeight="900"
                fontSize="245"
                letterSpacing="0.05em"
                transform="scale(1.22, 0.88)"
                style={{ transformOrigin: "center" }}
                className="select-none uppercase"
              >
                SKETCH
              </text>
            </svg>
          </motion.div>
        </div>

        {/* 3. Subtitle with White & Golden Highlights */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-8 max-w-4xl text-lg sm:text-xl md:text-2xl lg:text-[26px] leading-relaxed text-neutral-300 font-normal max-sm:px-2"
        >
          Master software architecture before writing code through{" "}
          <strong className="text-white font-medium">autonomous multi-agent research</strong>,
          intelligent system blueprints, and guidance from{" "}
          <strong className="text-white font-medium">Industry Best Practices</strong>.
        </motion.p>

        {/* 4. Dual Action CTAs (Exact ChaiCode Diagonal Pill Button Style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 w-full"
        >
          <Link href="/signup">
            <button className="h-11 sm:h-12 px-7 sm:px-9 rounded-none rounded-tr-lg rounded-bl-lg border border-transparent bg-white text-black font-semibold text-xs sm:text-sm hover:bg-neutral-200 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 cursor-pointer">
              <span>Launch Workspace</span>
              <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </Link>

          <a href="#pipeline-studio">
            <button className="h-11 sm:h-12 px-7 sm:px-9 rounded-none rounded-tl-lg rounded-br-lg border border-white/20 bg-transparent text-white hover:bg-white/5 font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer">
              <span>View Interactive Pipeline</span>
              <ChevronsDown className="h-4 w-4 text-[#f97316]" />
            </button>
          </a>
        </motion.div>

        {/* 5. Interactive Pipeline Showcase Card (Exact ChaiCode Hero Card Animation) */}
        <motion.div
          id="pipeline-studio"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.01 }}
          className="mt-14 sm:mt-18 w-full max-w-5xl mx-auto rounded-xl md:rounded-2xl border border-black/10 dark:border-white/10 bg-[#111111]/90 backdrop-blur-xs overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 dark:hover:shadow-orange-400/20 cursor-pointer"
        >
          <HeroThinkingAnimation />
        </motion.div>
      </div>
    </section>
  );
}
