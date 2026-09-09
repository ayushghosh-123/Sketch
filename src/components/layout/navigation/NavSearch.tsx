"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Layers, FileText, Activity, Terminal } from "lucide-react";

interface NavSearchProps {
  className?: string;
}

export function NavSearch({ className = "" }: NavSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Keyboard shortcut listener (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const searchItems = [
    { label: "Interactive System Canvas", href: "/#system-map", category: "Product" },
    { label: "5-Step Autonomous Workflow", href: "/#workflow", category: "Workflow" },
    { label: "Directed Blast Radius Radar", href: "/#impact-preview", category: "Safety" },
    { label: "AI Architecture Generation", href: "/#features", category: "Capability" },
    { label: "Architecture Registry", href: "/projects", category: "Workspace" },
    { label: "Engineering Command Center", href: "/dashboard", category: "Workspace" },
  ];

  const filteredItems = query.trim()
    ? searchItems.filter((i) =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.category.toLowerCase().includes(query.toLowerCase())
      )
    : searchItems;

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded-full text-[#9ca3af] hover:text-white transition-colors duration-150 flex items-center justify-center ${className}`}
        aria-label="Search architecture resources (⌘K)"
        title="Search (⌘K)"
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Minimalist Command Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-xl bg-[#0d0d10] border border-neutral-800 text-[#f4f4f5] shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-neutral-800">
              <Search className="h-4 w-4 text-[#71717a] mr-3 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search systems, workflows, specs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-500 hover:text-white p-1 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1 text-xs">
              {filteredItems.length === 0 ? (
                <div className="p-4 text-center text-neutral-500">
                  No matching architecture specs found
                </div>
              ) : (
                filteredItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-colors"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2 border-t border-neutral-800/80 bg-neutral-900/50 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
              <span>Quick Navigation</span>
              <span>ESC to dismiss</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
