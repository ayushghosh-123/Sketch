"use client";

import { useState } from "react";
import { NavBrand } from "./navigation/NavBrand";
import { NavLinks } from "./navigation/NavLinks";
import { NavSearch } from "./navigation/NavSearch";
import { NavActions } from "./navigation/NavActions";
import { NavMobileMenu } from "./navigation/NavMobileMenu";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full h-[68px] bg-black/90 backdrop-blur-md text-white border-b border-white/10 shadow-none">
      <div className="w-full h-full px-6 sm:px-10 lg:px-16 flex items-center justify-between">
        {/* LEFT: AgentArchitect logo and wordmark */}
        <div className="flex items-center">
          <NavBrand />
        </div>

        {/* CENTER: Minimal navigation links with generous spacing */}
        <div className="hidden md:flex items-center justify-center">
          <NavLinks />
        </div>

        {/* RIGHT: Theme toggle, Search icon, Actions, and Mobile Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <NavSearch />
          {/* ChaiCode Signature Theme Toggle Pill/Button */}
          <button
            type="button"
            className="p-2 rounded-full text-[#a1a1aa] hover:text-white transition-colors flex items-center justify-center cursor-pointer"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" />
            </svg>
          </button>

          <div className="hidden sm:flex items-center">
            <NavActions />
          </div>
          <NavMobileMenu
            isOpen={mobileMenuOpen}
            onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            onClose={() => setMobileMenuOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}