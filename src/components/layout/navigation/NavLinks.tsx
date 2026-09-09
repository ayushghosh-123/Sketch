"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavLinkItem {
  label: string;
  href: string;
}

export const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { label: "Product", href: "/#system-map" },
  { label: "Workflow", href: "/#workflow" },
  { label: "Features", href: "/#features" },
  { label: "Documentation", href: "/#documentation" },
];

interface NavLinksProps {
  links?: NavLinkItem[];
  className?: string;
  onLinkClick?: () => void;
}

export function NavLinks({
  links = DEFAULT_NAV_LINKS,
  className = "",
  onLinkClick,
}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className={`flex items-center gap-8 lg:gap-10 ${className}`} aria-label="Main Navigation">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.label}
            href={link.href}
            onClick={onLinkClick}
            className={`text-sm font-normal transition-colors duration-150 ${
              isActive
                ? "text-white"
                : "text-[#9ca3af] hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
