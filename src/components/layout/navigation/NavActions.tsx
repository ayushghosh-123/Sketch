"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { ArrowRight, Sparkles } from "lucide-react";

interface NavActionsProps {
  className?: string;
  onActionClick?: () => void;
}

export function NavActions({ className = "", onActionClick }: NavActionsProps) {
  const pathname = usePathname();
  const { isSignedIn, loading, user } = useUser();

  const isAppRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/projects") || pathname.startsWith("/workspace") || pathname.startsWith("/tech-stack");
  const showAuthenticatedUI = (!loading && isSignedIn) || isAppRoute;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showAuthenticatedUI ? (
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            onClick={onActionClick}
            className="h-8 px-3.5 rounded bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] text-xs font-mono font-medium border border-[#27272a] transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#0ea5e9]" />
            <span>New Sketch</span>
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-[#27272a]">
            <div className="h-7 w-7 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center text-xs font-mono font-bold text-[#f4f4f5]">
              {user?.email ? user.email.charAt(0).toUpperCase() : "S"}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            onClick={onActionClick}
            className="px-3.5 py-1.5 text-xs font-medium text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors"
          >
            Log In
          </Link>

          <Link
            href="/signup"
            onClick={onActionClick}
            className="h-8 px-4 rounded bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] text-xs font-medium font-mono transition-colors flex items-center gap-1.5 shadow-none"
          >
            <span>Sign Up</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
