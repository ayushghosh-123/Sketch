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

        {/* RIGHT: Search icon, Sign In button, Primary CTA button */}
        <div className="flex items-center gap-3.5">
          <NavSearch />
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