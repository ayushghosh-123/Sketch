import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative w-full border-t border-white/10 bg-black text-[#a1a1aa] py-10 px-6 sm:px-10 lg:px-14 font-mono text-xs before:absolute before:top-0 before:left-1/2 before:h-px before:w-full before:max-w-6xl before:-translate-x-1/2 before:bg-gradient-to-r before:from-transparent before:via-orange-500/30 before:to-transparent">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group select-none">
            <div className="h-6 w-6 rounded bg-[#111111] border border-white/10 flex items-center justify-center text-[#f97316]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m18 2 4 4-10 10H8v-4L18 2z" />
                <path d="m14 6 4 4" />
                <path d="M4 20h16" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-wider text-white uppercase font-sans">
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
