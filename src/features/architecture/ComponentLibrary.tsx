"use client";

import { useArchitectureStore } from "./store";
import type { ComponentType } from "@/types/database";
import {
  Monitor,
  Server,
  Network,
  Database,
  Zap,
  Layers,
  HardDrive,
  Bot,
  Cpu,
  Lock,
  Globe,
  Cloud,
  Plus
} from "lucide-react";

interface ToolboxItem {
  type: ComponentType;
  label: string;
  defaultTech: string;
  defaultDesc: string;
  icon: React.ElementType;
}

interface ToolboxCategory {
  title: string;
  items: ToolboxItem[];
}

const TOOLBOX_CATEGORIES: ToolboxCategory[] = [
  {
    title: "APPLICATION",
    items: [
      {
        type: "frontend",
        label: "Frontend",
        defaultTech: "Next.js / TypeScript",
        defaultDesc: "User-facing interactive web application",
        icon: Monitor,
      },
      {
        type: "backend",
        label: "Backend",
        defaultTech: "Node.js / Express / Go",
        defaultDesc: "Domain business logic service",
        icon: Server,
      },
      {
        type: "api",
        label: "API Gateway",
        defaultTech: "REST / GraphQL / Edge",
        defaultDesc: "Ingress proxy, routing & rate limiting",
        icon: Network,
      },
    ],
  },
  {
    title: "DATA",
    items: [
      {
        type: "database",
        label: "Database",
        defaultTech: "PostgreSQL / Supabase",
        defaultDesc: "Primary transactional data store",
        icon: Database,
      },
      {
        type: "cache",
        label: "Cache",
        defaultTech: "Redis",
        defaultDesc: "In-memory cache & fast session store",
        icon: Zap,
      },
      {
        type: "queue",
        label: "Queue",
        defaultTech: "Kafka / BullMQ",
        defaultDesc: "Asynchronous distributed message bus",
        icon: Layers,
      },
      {
        type: "storage",
        label: "Storage",
        defaultTech: "S3 / Object Store",
        defaultDesc: "Blob and asset object storage",
        icon: HardDrive,
      },
    ],
  },
  {
    title: "AI",
    items: [
      {
        type: "ai",
        label: "AI Model",
        defaultTech: "Gemini 1.5 Pro / Flash",
        defaultDesc: "Foundation reasoning model endpoint",
        icon: Cpu,
      },
      {
        type: "agent",
        label: "AI Agent",
        defaultTech: "LangGraph.js",
        defaultDesc: "Autonomous multi-step state graph agent",
        icon: Bot,
      },
      {
        type: "ai",
        label: "Retriever (RAG)",
        defaultTech: "pgvector 768-dim",
        defaultDesc: "Vector similarity search engine",
        icon: Database,
      },
    ],
  },
  {
    title: "EXTERNAL",
    items: [
      {
        type: "authentication",
        label: "Authentication",
        defaultTech: "Clerk / OAuth2 / JWT",
        defaultDesc: "User authentication & identity provider",
        icon: Lock,
      },
      {
        type: "external_service",
        label: "External API",
        defaultTech: "Stripe / Twilio / GitHub",
        defaultDesc: "Third-party vendor API integration",
        icon: Globe,
      },
      {
        type: "devops",
        label: "Cloud Service",
        defaultTech: "AWS / Cloudflare / Docker",
        defaultDesc: "Managed cloud infrastructure service",
        icon: Cloud,
      },
    ],
  },
];

export function ComponentLibrary() {
  const { addNode } = useArchitectureStore();

  const handleDragStart = (e: React.DragEvent, item: ToolboxItem) => {
    e.dataTransfer.setData("application/reactflow", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleQuickAdd = (item: ToolboxItem) => {
    const randomOffset = Math.floor(Math.random() * 80);
    addNode({
      id: `comp-${item.type}-${Date.now()}`,
      type: "customComponent",
      position: {
        x: 350 + randomOffset,
        y: 250 + randomOffset,
      },
      data: {
        label: item.label,
        componentType: item.type,
        technology: item.defaultTech,
        description: item.defaultDesc,
        responsibilities: ["Core service responsibility"],
        status: "active",
      },
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] border-r border-[#27272a] select-none font-mono text-xs w-60">
      {/* Toolbox Header */}
      <div className="p-3 border-b border-[#27272a] bg-[#111113] flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider text-[#f4f4f5] uppercase">
          Toolbox
        </span>
        <span className="text-[10px] text-[#71717a]">DRAG & DROP</span>
      </div>

      {/* Category Groups */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {TOOLBOX_CATEGORIES.map((category) => (
          <div key={category.title} className="space-y-1.5">
            <div className="text-[10px] uppercase text-[#71717a] font-semibold tracking-wider px-1">
              {category.title}
            </div>

            <div className="space-y-1">
              {category.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onClick={() => handleQuickAdd(item)}
                    className="p-2 rounded bg-[#111113] border border-[#27272a] hover:border-[#0ea5e9]/60 hover:bg-[#18181b] transition-all cursor-grab active:cursor-grabbing flex items-center justify-between group"
                    title={`Click or drag to canvas: ${item.defaultDesc}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className="h-3.5 w-3.5 text-[#71717a] group-hover:text-[#0ea5e9] shrink-0" />
                      <span className="text-xs text-[#f4f4f5] truncate">{item.label}</span>
                    </div>
                    <Plus className="h-3 w-3 text-[#71717a] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
