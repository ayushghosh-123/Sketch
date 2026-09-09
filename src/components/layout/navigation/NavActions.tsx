"use client";

import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { ArrowUpRight } from "lucide-react";

interface NavActionsProps {
  className?: string;
  onActionClick?: () => void;
}

export function NavActions({ className = "", onActionClick }: NavActionsProps) {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {isLoaded && isSignedIn ? (
        /* Signed In State */
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            onClick={onActionClick}
            className="px-4 sm:px-5 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-medium transition-colors flex items-center gap-1 shadow-none"
          >
            <span>Dashboard</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-7 w-7 ring-1 ring-neutral-800 rounded-full",
              },
            }}
          />
        </div>
      ) : (
        /* Signed Out State - Dark pill Sign In + High-contrast White pill Sign Up */
        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            onClick={onActionClick}
            className="px-4 py-2 rounded-full bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] text-xs font-medium transition-colors border border-neutral-800/80"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            onClick={onActionClick}
            className="px-4 sm:px-5 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-medium transition-colors flex items-center gap-1 shadow-none"
          >
            <span>Sign Up</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
