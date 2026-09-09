"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { ComponentNodeData } from "./store";
import {
  Monitor,
  Server,
  Database,
  Zap,
  Layers,
  Network,
  Lock,
  HardDrive,
  Bot,
  Globe,
  Radio,
  AlertTriangle
} from "lucide-react";

export const CustomNode = memo(({ id, data, selected }: NodeProps) => {
  const nodeData = data as unknown as ComponentNodeData;
  const { label, componentType, technology, status } = nodeData;

  const typeLower = componentType?.toLowerCase() || "backend";

  // Technical category glyph and label based on Section 24
  const getTypeMeta = (type: string) => {
    switch (type) {
      case "frontend":
        return {
          glyph: "◈",
          category: "FRONTEND",
          icon: Monitor,
        };
      case "database":
        return {
          glyph: "◉",
          category: "DATABASE",
          icon: Database,
        };
      case "ai":
      case "agent":
        return {
          glyph: "◎",
          category: "AI AGENT",
          icon: Bot,
        };
      case "api":
        return {
          glyph: "↔",
          category: "API",
          icon: Network,
        };
      case "cache":
        return {
          glyph: "⚡",
          category: "CACHE",
          icon: Zap,
        };
      case "queue":
        return {
          glyph: "◫",
          category: "QUEUE",
          icon: Layers,
        };
      case "authentication":
        return {
          glyph: "⚿",
          category: "AUTH",
          icon: Lock,
        };
      case "storage":
        return {
          glyph: "▣",
          category: "STORAGE",
          icon: HardDrive,
        };
      default:
        return {
          glyph: "⌘",
          category: "BACKEND",
          icon: Server,
        };
    }
  };

  const meta = getTypeMeta(typeLower);
  const IconComponent = meta.icon;

  // Impact states
  const isChanged = status === "changed";
  const isDirect = status === "affected_direct";
  const isIndirect = status === "affected_indirect";

  let containerBorderClass = "border-[#27272a] bg-[#111113]";
  if (isChanged) {
    containerBorderClass = "border-[#ef4444] bg-[#ef4444]/15 ring-2 ring-[#ef4444] animate-pulse";
  } else if (isDirect) {
    containerBorderClass = "border-[#f59e0b] bg-[#f59e0b]/15 ring-1 ring-[#f59e0b]";
  } else if (isIndirect) {
    containerBorderClass = "border-[#f59e0b]/50 bg-[#18181b] border-dashed";
  } else if (selected) {
    containerBorderClass = "border-[#0ea5e9] bg-[#18181b] ring-1 ring-[#0ea5e9]";
  }

  return (
    <div
      className={`group relative min-w-[210px] max-w-[250px] rounded border p-3 font-mono transition-all duration-150 cursor-pointer shadow-xs ${containerBorderClass}`}
    >
      {/* React Flow Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !rounded-none !border-0 !bg-[#0ea5e9] transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !rounded-none !border-0 !bg-[#0ea5e9] transition-transform"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!h-2 !w-2 !rounded-none !border-0 !bg-[#0ea5e9] opacity-0 group-hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!h-2 !w-2 !rounded-none !border-0 !bg-[#0ea5e9] opacity-0 group-hover:opacity-100"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-[#27272a]/60">
        <div className="flex items-center gap-1.5 text-[10px] text-[#a1a1aa]">
          <span className="text-[#0ea5e9] font-bold">{meta.glyph}</span>
          <span className="tracking-wider uppercase font-semibold">{meta.category}</span>
        </div>

        {/* Status Indicators */}
        {isChanged && (
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#ef4444] text-[#09090b]">
            ● CHANGED
          </span>
        )}
        {isDirect && (
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#f59e0b] text-[#09090b]">
            ▲ DIRECT
          </span>
        )}
        {isIndirect && (
          <span className="text-[9px] px-1 py-0.2 rounded bg-[#27272a] text-[#f59e0b]">
            ○ INDIRECT
          </span>
        )}
        {!isChanged && !isDirect && !isIndirect && (
          <span className="text-[9px] text-[#10b981] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            ACTIVE
          </span>
        )}
      </div>

      {/* Component Title */}
      <div className="mt-2 text-xs font-bold text-[#f4f4f5] leading-tight truncate">
        {label}
      </div>

      {/* Technology Spec */}
      {technology && (
        <div className="mt-2 text-[10px] text-[#71717a] truncate flex items-center gap-1 pt-1.5 border-t border-[#27272a]/40">
          <span className="text-[#a1a1aa] truncate">{technology}</span>
        </div>
      )}
    </div>
  );
});

CustomNode.displayName = "CustomNode";
