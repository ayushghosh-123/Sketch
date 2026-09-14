"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";

interface NavBrandProps {
  className?: string;
  showTag?: boolean;
}

export function NavBrand({ className = "", showTag = false }: NavBrandProps) {
  const pathname = usePathname();
  const { isSignedIn, loading } = useUser();

  const isAppRoute = (!loading && isSignedIn) || pathname.startsWith("/dashboard") || pathname.startsWith("/workspace") || pathname.startsWith("/projects");
  const brandHref = isAppRoute ? "/dashboard" : "/";

  return (
    <Link
      href={brandHref}
      className={`flex items-center gap-2.5 group select-none transition-opacity hover:opacity-90 ${className}`}
      aria-label="Sketch Platform"
    >
      {/* Minimal Architectural Compass & Pencil Glyph */}
      <div className="h-8 w-8 rounded-md bg-[#18181b] border border-white/10 flex items-center justify-center text-white group-hover:border-[#f97316]/60 transition-colors shadow-xs">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#f97316]"
        >
          {/* Conceptual Sketch pencil + geometry */}
          <path d="m18 2 4 4-10 10H8v-4L18 2z" />
          <path d="m14 6 4 4" />
          <path d="M4 20h16" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex items-center gap-2">
        <span className="text-base font-bold tracking-tight text-[#f4f4f5] font-sans uppercase tracking-wider">
          SKETCH
        </span>
        {isAppRoute ? (
          <span className="text-[9px] font-mono tracking-wider uppercase text-[#a1a1aa] bg-[#18181b] border border-[#27272a] px-1.5 py-0.5 rounded">
            Workspace
          </span>
        ) : showTag ? (
          <span className="text-[10px] font-mono text-[#71717a] font-normal">
            Beta
          </span>
        ) : null}
      </div>
    </Link>
  );
}
