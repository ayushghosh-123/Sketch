import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div className="flex-1 w-full bg-[#FAFAFA] flex flex-col items-center justify-center min-h-[60vh] text-[#0D0D0D]">
      <div className="flex flex-col items-center gap-3">
        {/* Brand glyph */}
        <div className="h-9 w-9 rounded-lg bg-[#0D0D0D] flex items-center justify-center text-white shadow-sm animate-pulse">
          <svg
            width="18"
            height="18"
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
        <p className="text-xs font-mono tracking-wider text-neutral-500 uppercase">
          Completing authentication...
        </p>
      </div>

      {/* Headless Clerk redirect handler */}
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
