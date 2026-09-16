"use client";

import { useArchitectureStore, type WorkspaceTool, type ArchitectureNode } from "./store";
import {
  MousePointer,
  Hand,
  Square,
  Circle,
  Type,
  Minus,
  MoveRight,
  Network,
  Plus,
  Trash2,
  Database,
  Server,
  Monitor,
  Zap,
  Bot
} from "lucide-react";

// todo: Add node types
export function LeftToolbar() {

  // 
  const activeTool = useArchitectureStore((state) => state.activeTool);
  const setActiveTool = useArchitectureStore((state) => state.setActiveTool);
  const selectedNode = useArchitectureStore((state) => state.selectedNode);
  const deleteNode = useArchitectureStore((state) => state.deleteNode);
  const addNode = useArchitectureStore((state) => state.addNode);

  const tools: Array<{ id: WorkspaceTool; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "select", label: "Select & Box Marquee (V)", icon: MousePointer },
    { id: "hand", label: "Hand / Pan Viewport (H)", icon: Hand },
    { id: "rectangle", label: "Rectangle Box (Click canvas to place)", icon: Square },
    { id: "circle", label: "Circle Boundary (Click canvas to place)", icon: Circle },
    { id: "text", label: "Text Note (Click canvas to place)", icon: Type },
    { id: "connector", label: "Bus Connector (Click 2 nodes)", icon: Network },
  ];

  // Quick Add preset component
  const handleQuickAdd = (type: "frontend" | "backend" | "database" | "ai" | "cache") => {
    const titles = {
      frontend: "Client App",
      backend: "Service API",
      database: "PostgreSQL DB",
      ai: "AI Agent",
      cache: "Redis Cache",
    };
    const techs = {
      frontend: "Next.js",
      backend: "Node.js",
      database: "Supabase PostgreSQL",
      ai: "Gemini / LangGraph",
      cache: "Redis",
    };

    const newNode: ArchitectureNode = {
      id: `comp-${type}-${Date.now()}`,
      type: "customComponent",
      position: { x: 300 + Math.random() * 80, y: 150 + Math.random() * 80 },
      data: {
        label: titles[type],
        componentType: type,
        technology: techs[type],
        description: `Custom ${type} component`,
        responsibilities: ["Domain operation"],
        status: "active",
      },
    };

    addNode(newNode);
  };

  return (
    <div className="w-14 bg-[#000000] border-r border-white/10 flex flex-col items-center py-3 gap-1 z-10 select-none">
      {/* Tool items */}
      {tools.map((t) => {
        const Icon = t.icon;
        const isActive = activeTool === t.id;

        return (
          <button
            key={t.id}
            onClick={() => {
              // Toggle back to select if clicking the already active tool, otherwise set tool
              if (isActive && t.id !== "select") {
                setActiveTool("select");
              } else {
                setActiveTool(t.id);
              }
            }}
            title={t.label}
            className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
              isActive
                ? "bg-[#18181b] text-[#f97316] border border-[#f97316]/50 shadow-xs"
                : "text-[#a1a1aa] hover:text-white hover:bg-[#18181b]"
            }`}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}

      <div className="w-8 h-px bg-white/10 my-2" />

      {/* Quick Add Components */}
      <button
        onClick={() => handleQuickAdd("frontend")}
        title="Add Frontend Node"
        className="h-9 w-9 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#38bdf8] hover:bg-[#18181b] transition-colors"
      >
        <Monitor className="h-4 w-4" />
      </button>

      <button
        onClick={() => handleQuickAdd("backend")}
        title="Add Backend Node"
        className="h-9 w-9 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#818cf8] hover:bg-[#18181b] transition-colors"
      >
        <Server className="h-4 w-4" />
      </button>

      <button
        onClick={() => handleQuickAdd("database")}
        title="Add Database Node"
        className="h-9 w-9 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#10b981] hover:bg-[#18181b] transition-colors"
      >
        <Database className="h-4 w-4" />
      </button>

      <button
        onClick={() => handleQuickAdd("ai")}
        title="Add AI Agent Node"
        className="h-9 w-9 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#a855f7] hover:bg-[#111113] transition-colors"
      >
        <Bot className="h-4 w-4" />
      </button>

      <button
        onClick={() => handleQuickAdd("cache")}
        title="Add Cache Node"
        className="h-9 w-9 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#f59e0b] hover:bg-[#111113] transition-colors"
      >
        <Zap className="h-4 w-4" />
      </button>

      {/* Delete trigger */}
      {selectedNode && (
        <>
          <div className="w-8 h-px bg-[#27272a] my-2" />
          <button
            onClick={() => deleteNode(selectedNode.id)}
            title="Delete Selected Node"
            className="h-9 w-9 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-950/30 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
