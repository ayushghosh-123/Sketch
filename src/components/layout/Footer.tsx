import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#27272a] bg-[#09090b] text-[#a1a1aa] py-8 px-6 sm:px-10 lg:px-14 font-mono text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group select-none">
            <div className="h-6 w-6 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#0ea5e9]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m18 2 4 4-10 10H8v-4L18 2z" />
                <path d="m14 6 4 4" />
                <path d="M4 20h16" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-wider text-[#f4f4f5] uppercase font-sans">
              SKETCH
            </span>
          </Link>
          <span className="hidden sm:inline text-[#71717a]">·</span>
          <span className="text-[11px] text-[#71717a]">
            Describe it. Research it. Sketch it.
          </span>
        </div>

       

        {/* Copyright */}
        <div className="text-[11px] text-[#71717a]">
          © {new Date().getFullYear()} Sketch. Turn your idea into software architecture.
        </div>
      </div>
    </footer>
  );
}
