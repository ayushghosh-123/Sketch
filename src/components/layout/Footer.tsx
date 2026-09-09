   import { Cpu, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/60 py-8 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-sky-400" />
          <span className="text-slate-300 font-semibold tracking-wider">
            AGENT<span className="text-sky-400">ARCHITECT</span>
          </span>
          <span>- Autonomous AI Software Architecture Studio</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Powered by Gemini & LangGraph.js
          </span>
          
        </div>
      </div>
    </footer>
  );
}
