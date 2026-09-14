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

  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/workspace") ||
    pathname.startsWith("/tech-stack") ||
    pathname.startsWith("/settings");
  const showAuthenticatedUI = (!loading && isSignedIn) || isAppRoute;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showAuthenticatedUI ? (
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            onClick={onActionClick}
            className="h-8 px-3.5 rounded bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] text-xs font-mono font-medium border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#f97316]" />
            <span>New Sketch</span>
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <Link
              href="/settings"
              onClick={onActionClick}
              title="Account Settings & Profile"
              className="h-7 w-7 rounded-full bg-[#18181b] hover:border-[#f97316] hover:text-[#f97316] border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-[#f4f4f5] transition-colors"
            >
              {user?.email ? user.email.charAt(0).toUpperCase() : "S"}
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            onClick={onActionClick}
            className="px-3.5 py-1.5 text-xs font-medium text-[#a1a1aa] hover:text-white transition-colors"
          >
            Log In
          </Link>

          <Link
            href="/signup"
            onClick={onActionClick}
            className="h-8 px-4 bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm chai-btn-primary"
          >
            <span>Sign Up</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
