"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import {
  Layers,
  FolderKanban,
  Network,
  Settings,
  LucideIcon
} from "lucide-react";

export interface NavLinkItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export const LANDING_NAV_LINKS: NavLinkItem[] = [
  { label: "Product", href: "/#product" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "Documentation", href: "/docs" },
];

export const DEFAULT_NAV_LINKS = LANDING_NAV_LINKS;

export const APP_NAV_LINKS: NavLinkItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Layers },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Canvas Board", href: "/workspace/demo-project-e-commerce", icon: Network },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface NavLinksProps {
  links?: NavLinkItem[];
  className?: string;
  onLinkClick?: () => void;
}

export function NavLinks({ links: customLinks, className = "", onLinkClick }: NavLinksProps) {
  const pathname = usePathname();
  const { isSignedIn, loading } = useUser();
  const [activeProjectId, setActiveProjectId] = useState<string>("demo-project-e-commerce");

  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/workspace") ||
    pathname.startsWith("/tech-stack") ||
    pathname.startsWith("/settings");

  const isWorkspace = pathname.startsWith("/workspace/") || pathname.startsWith("/tech-stack/");
  const routeProjectId = isWorkspace ? pathname.split("/")[2] : null;

  // Persist and load active workspace ID
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (routeProjectId) {
        setActiveProjectId(routeProjectId);
        localStorage.setItem("sketch_active_workspace", routeProjectId);
      } else {
        const saved = localStorage.getItem("sketch_active_workspace");
        if (saved) {
          setActiveProjectId(saved);
        }
      }
    }
  }, [routeProjectId, pathname]);

  const showAppNav = (!loading && isSignedIn) || isAppRoute;

  // Authenticated navigation links: Dashboard, Projects, Canvas Board, Settings
  const appLinks: NavLinkItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: Layers },
    { label: "Projects", href: "/projects", icon: FolderKanban },
    { label: "Canvas Board", href: `/workspace/${routeProjectId || activeProjectId}`, icon: Network },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const currentLinks = customLinks || (showAppNav ? appLinks : LANDING_NAV_LINKS);

  if (showAppNav) {
    return (
      <nav className={`flex items-center gap-1 sm:gap-1.5 ${className}`} aria-label="Application Navigation">
        {currentLinks.map((link) => {
          const isCanvasLink = link.label === "Canvas Board";
          const isActive = isCanvasLink
            ? pathname.startsWith("/workspace") || pathname.startsWith("/tech-stack")
            : pathname === link.href;

          const Icon = link.icon;

          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={onLinkClick}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#18181b] text-[#f4f4f5] border border-[#27272a] font-medium"
                  : "text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#111113]"
              }`}
            >
              {Icon && <Icon className="h-3.5 w-3.5 text-[#f97316]" />}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // Public Landing Page Navigation Links
  return (
    <nav className={`flex items-center gap-8 lg:gap-10 ${className}`} aria-label="Main Navigation">
      {LANDING_NAV_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.label}
            href={link.href}
            onClick={onLinkClick}
            className={`text-xs sm:text-sm font-normal transition-colors duration-150 ${
              isActive ? "text-[#f4f4f5] font-medium" : "text-[#a1a1aa] hover:text-[#f4f4f5]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
