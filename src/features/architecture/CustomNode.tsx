"use client";

import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useArchitectureStore, type ComponentNodeData } from "./store";
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
  const {
    label,
    componentType,
    technology,
    description,
    status,
    colorPreset = "neutral",
    customBg,
    customBorder,
    shapeType = "component",
  } = nodeData;

  const updateNodeData = useArchitectureStore((state) => state.updateNodeData);

  // Inline editing state on double click
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(label);
  const [editTech, setEditTech] = useState(technology || "");

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    updateNodeData(id, {
      label: editLabel.trim() || label,
      technology: editTech.trim() || technology,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditLabel(label);
      setEditTech(technology || "");
    }
  };

  const typeLower = componentType?.toLowerCase() || "backend";

  // Category glyph and icon
  const getTypeMeta = (type: string) => {
    switch (type) {
      case "frontend":
        return { glyph: "◈", category: "FRONTEND", icon: Monitor };
      case "database":
        return { glyph: "◉", category: "DATABASE", icon: Database };
      case "ai":
      case "agent":
        return { glyph: "◎", category: "AI AGENT", icon: Bot };
      case "api":
        return { glyph: "↔", category: "API", icon: Network };
      case "cache":
        return { glyph: "⚡", category: "CACHE", icon: Zap };
      case "queue":
        return { glyph: "◫", category: "QUEUE", icon: Layers };
      case "authentication":
        return { glyph: "⚿", category: "AUTH", icon: Lock };
      case "storage":
        return { glyph: "▣", category: "STORAGE", icon: HardDrive };
      default:
        return { glyph: "⌘", category: "BACKEND", icon: Server };
    }
  };

  const meta = getTypeMeta(typeLower);

  // Color preset mapping
  const getColorClasses = (preset: string) => {
    switch (preset) {
      case "blue":
        return "border-[#0ea5e9]/50 bg-[#0ea5e9]/10 text-[#f4f4f5]";
      case "green":
        return "border-[#10b981]/50 bg-[#10b981]/10 text-[#f4f4f5]";
      case "purple":
        return "border-[#a855f7]/50 bg-[#a855f7]/10 text-[#f4f4f5]";
      case "orange":
        return "border-[#f97316]/50 bg-[#f97316]/10 text-[#f4f4f5]";
      case "red":
        return "border-[#ef4444]/50 bg-[#ef4444]/10 text-white";
      default:
        return "border-white/10 bg-[#111111] text-white";
    }
  };

  // Status highlights
  const isChanged = status === "changed";
  const isDirect = status === "affected_direct";
  const isIndirect = status === "affected_indirect";

  let statusClass = getColorClasses(colorPreset);
  if (isChanged) {
    statusClass = "border-[#ef4444] bg-[#ef4444]/15 ring-2 ring-[#ef4444] animate-pulse";
  } else if (isDirect) {
    statusClass = "border-[#f59e0b] bg-[#f59e0b]/15 ring-1 ring-[#f59e0b]";
  } else if (isIndirect) {
    statusClass = "border-[#f59e0b]/50 bg-[#18181b] border-dashed";
  } else if (selected) {
    statusClass = "border-[#f97316] bg-[#18181b] ring-1 ring-[#f97316]";
  }

  // 1. Text Object Shape
  if (shapeType === "text") {
    return (
      <div
        onDoubleClick={handleDoubleClick}
        className={`p-2 rounded font-mono transition-all select-none cursor-pointer ${
          selected ? "ring-1 ring-[#f97316]" : ""
        }`}
      >
        {isEditing ? (
          <input
            type="text"
            autoFocus
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            className="bg-[#18181b] text-sm text-white border border-[#f97316] rounded px-1.5 py-0.5 focus:outline-none"
          />
        ) : (
          <span className="text-sm font-semibold text-white">{label}</span>
        )}
      </div>
    );
  }

  // 2. Circle Shape
  if (shapeType === "circle") {
    return (
      <div
        onDoubleClick={handleDoubleClick}
        className={`relative h-28 w-28 rounded-full border p-3 font-mono flex flex-col items-center justify-center text-center cursor-pointer transition-all ${statusClass}`}
        style={{
          backgroundColor: customBg,
          borderColor: customBorder,
        }}
      >
        <Handle type="target" position={Position.Left} className="!h-2 !w-2 !bg-[#f97316] !border-0" />
        <Handle type="source" position={Position.Right} className="!h-2 !w-2 !bg-[#f97316] !border-0" />
        {isEditing ? (
          <input
            type="text"
            autoFocus
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            className="w-20 bg-[#18181b] text-[11px] text-center text-white border border-[#f97316] rounded px-1"
          />
        ) : (
          <span className="text-xs font-semibold truncate max-w-[90px] text-white">{label}</span>
        )}
      </div>
    );
  }

  // 3. Rectangle Boundary / Container Shape
  if (shapeType === "rectangle") {
    return (
      <div
        onDoubleClick={handleDoubleClick}
        className={`group relative min-w-[200px] min-h-[110px] rounded-xl border-2 border-dashed p-3 font-mono transition-all duration-150 cursor-pointer select-none ${statusClass}`}
        style={{
          backgroundColor: customBg || "rgba(24, 24, 27, 0.45)",
          borderColor: customBorder || (selected ? "#f97316" : "rgba(255, 255, 255, 0.15)"),
        }}
      >
        <Handle type="target" position={Position.Left} className="!h-2.5 !w-2.5 !bg-[#f97316] !border-0" />
        <Handle type="source" position={Position.Right} className="!h-2.5 !w-2.5 !bg-[#f97316] !border-0" />
        <Handle type="target" position={Position.Top} id="top" className="!h-2 !w-2 !bg-[#f97316] !border-0 opacity-0 group-hover:opacity-100" />
        <Handle type="source" position={Position.Bottom} id="bottom" className="!h-2 !w-2 !bg-[#f97316] !border-0 opacity-0 group-hover:opacity-100" />
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          {isEditing ? (
            <input
              type="text"
              autoFocus
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className="bg-[#18181b] border border-[#f97316] rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
            />
          ) : (
            <span className="text-[11px] font-semibold text-[#a1a1aa] tracking-wider uppercase">{label}</span>
          )}
        </div>
      </div>
    );
  }

  // 4. Standard Component Node
  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`group relative min-w-[210px] max-w-[250px] rounded-xl border p-3.5 font-mono transition-all duration-150 cursor-pointer shadow-xs select-none ${statusClass}`}
      style={{
        backgroundColor: customBg,
        borderColor: customBorder,
      }}
    >
      {/* React Flow Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !rounded-none !border-0 !bg-[#f97316] transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !rounded-none !border-0 !bg-[#f97316] transition-transform"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!h-2 !w-2 !rounded-none !border-0 !bg-[#f97316] opacity-0 group-hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!h-2 !w-2 !rounded-none !border-0 !bg-[#f97316] opacity-0 group-hover:opacity-100"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between gap-1 pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5 text-[10px] text-[#a1a1aa]">
          <span className="text-[#f97316] font-bold">{meta.glyph}</span>
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

      {/* Component Title (Inline editable on double-click) */}
      <div className="mt-2.5">
        {isEditing ? (
          <div className="space-y-1.5">
            <input
              type="text"
              autoFocus
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className="w-full bg-[#18181b] border border-[#f97316] rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
            />
            <input
              type="text"
              placeholder="Technology (e.g. Next.js)"
              value={editTech}
              onChange={(e) => setEditTech(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className="w-full bg-[#18181b] border border-white/10 rounded px-1.5 py-0.5 text-[10px] text-[#a1a1aa] focus:outline-none focus:border-[#f97316]"
            />
          </div>
        ) : (
          <div>
            <div className="text-xs font-bold text-[#f4f4f5] leading-tight truncate">
              {label}
            </div>
            {technology && (
              <div className="text-[10px] text-[#a1a1aa] mt-1 truncate">
                {technology}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description / Summary */}
      {description && !isEditing && (
        <p className="mt-2 text-[10px] text-[#71717a] line-clamp-2 leading-relaxed pt-1.5 border-t border-[#27272a]/40">
          {description}
        </p>
      )}
    </div>
  );
});

CustomNode.displayName = "CustomNode";
