"use client";

import Link from "next/link";

interface NavBrandProps {
  className?: string;
  showTag?: boolean;
}

export function NavBrand({ className = "", showTag = false }: NavBrandProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-3 group select-none transition-opacity hover:opacity-90 ${className}`}
      aria-label="AgentArchitect Home"
    >
      {/* Minimal Geometric Architecture Glyph */}
      <div className="h-7 w-7 rounded-md bg-[#18181b] border border-neutral-800 flex items-center justify-center text-white group-hover:border-neutral-700 transition-colors">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M10 6.5h4" />
          <path d="M6.5 10v4" />
          <path d="M17.5 10v4" />
          <path d="M10 17.5h4" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-semibold tracking-tight text-white font-sans">
          AgentArchitect
        </span>
        {showTag && (
          <span className="text-[10px] font-mono text-neutral-500 font-normal">
            v1.0
          </span>
        )}
      </div>
    </Link>
  );
}
