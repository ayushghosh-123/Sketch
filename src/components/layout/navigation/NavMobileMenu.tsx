"use client";

import { X, Menu } from "lucide-react";
import { NavLinks, NavLinkItem } from "./NavLinks";
import { NavActions } from "./NavActions";

interface NavMobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  links?: NavLinkItem[];
}

export function NavMobileMenu({
  isOpen,
  onToggle,
  onClose,
  links,
}: NavMobileMenuProps) {
  return (
    <div className="md:hidden flex items-center">
      <button
        type="button"
        onClick={onToggle}
        className="p-2 rounded-md text-[#9ca3af] hover:text-white transition-colors"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div className="absolute top-[68px] left-0 right-0 w-full bg-[#09090b] border-b border-neutral-900 p-6 space-y-6 animate-in fade-in-50 duration-150 shadow-none">
          <NavLinks
            links={links}
            className="flex-col items-start gap-5 text-base"
            onLinkClick={onClose}
          />

          <div className="pt-4 border-t border-neutral-900">
            <NavActions onActionClick={onClose} />
          </div>
        </div>
      )}
    </div>
  );
}
