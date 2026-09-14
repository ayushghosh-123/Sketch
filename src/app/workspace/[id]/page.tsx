"use client";

import { useEffect, useState, useCallback, use } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  useViewport,
  type NodeTypes,
  type NodeMouseHandler,
  type EdgeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useArchitectureStore, type ArchitectureNode } from "@/features/architecture/store";
import { CustomNode } from "@/features/architecture/CustomNode";
import { LeftToolbar } from "@/features/architecture/LeftToolbar";
import { ComponentDetails } from "@/features/architecture/ComponentDetails";
import { BottomCommandBar } from "@/features/architecture/BottomCommandBar";
import { WorkspaceTopBar } from "@/features/architecture/WorkspaceTopBar";
import type { Project } from "@/types/database";
import { Plus, Minus, Maximize2 } from "lucide-react";

const nodeTypes: NodeTypes = {
  customComponent: CustomNode,
};

// Dedicated Canvas Zoom & Viewport HUD Panel
function CanvasZoomHud() {
  const { zoomIn, zoomOut, zoomTo, fitView } = useReactFlow();
  const { zoom } = useViewport();
  const zoomPercent = Math.round(zoom * 100);

  return (
    <Panel position="bottom-left" className="!m-3 z-20 select-none">
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#111111]/95 border border-white/10 shadow-xl backdrop-blur-md font-mono text-xs text-white">
        {/* Zoom Out (-) */}
        <button
          type="button"
          onClick={() => zoomOut({ duration: 250 })}
          className="h-7 w-7 rounded-lg hover:bg-[#18181b] text-[#a1a1aa] hover:text-white flex items-center justify-center transition-colors border border-transparent hover:border-white/10"
          title="Zoom Out (-)"
          aria-label="Zoom Out"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        {/* Zoom Percentage / Click to reset to 100% */}
        <button
          type="button"
          onClick={() => zoomTo(1, { duration: 250 })}
          className="h-7 px-2.5 rounded-lg hover:bg-[#18181b] text-[#f97316] font-semibold text-[11px] flex items-center justify-center transition-colors border border-transparent hover:border-white/10"
          title="Reset Zoom to 100% (Ctrl+0)"
        >
          {zoomPercent}%
        </button>

        {/* Zoom In (+) */}
        <button
          type="button"
          onClick={() => zoomIn({ duration: 250 })}
          className="h-7 w-7 rounded-lg hover:bg-[#18181b] text-[#a1a1aa] hover:text-white flex items-center justify-center transition-colors border border-transparent hover:border-white/10"
          title="Zoom In (+)"
          aria-label="Zoom In"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-white/10 mx-0.5" />

        {/* Fit View Button */}
        <button
          type="button"
          onClick={() => fitView({ padding: 0.2, duration: 350 })}
          className="h-7 px-2.5 rounded-lg hover:bg-[#18181b] text-[#a1a1aa] hover:text-white flex items-center gap-1.5 text-[11px] transition-colors border border-transparent hover:border-white/10"
          title="Fit All Nodes in View (F)"
        >
          <Maximize2 className="h-3.5 w-3.5 text-[#10b981]" />
          <span className="hidden sm:inline font-sans">Fit</span>
        </button>
      </div>
    </Panel>
  );
}

function WorkspaceCanvasInner({ projectId }: { projectId: string }) {
  const { fitView, zoomIn, zoomOut, zoomTo, screenToFlowPosition } = useReactFlow();

  const nodes = useArchitectureStore((state) => state.nodes);
  const edges = useArchitectureStore((state) => state.edges);
  const onNodesChange = useArchitectureStore((state) => state.onNodesChange);
  const onEdgesChange = useArchitectureStore((state) => state.onEdgesChange);
  const onConnect = useArchitectureStore((state) => state.onConnect);
  const setNodes = useArchitectureStore((state) => state.setNodes);
  const setEdges = useArchitectureStore((state) => state.setEdges);
  const setSelectedNode = useArchitectureStore((state) => state.setSelectedNode);
  const setSelectedEdge = useArchitectureStore((state) => state.setSelectedEdge);
  const selectedNode = useArchitectureStore((state) => state.selectedNode);
  const deleteNode = useArchitectureStore((state) => state.deleteNode);
  const undo = useArchitectureStore((state) => state.undo);
  const redo = useArchitectureStore((state) => state.redo);
  const resetDirty = useArchitectureStore((state) => state.resetDirty);
  const applyLayout = useArchitectureStore((state) => state.applyLayout);
  const activeTool = useArchitectureStore((state) => state.activeTool);
  const setActiveTool = useArchitectureStore((state) => state.setActiveTool);
  const connectingSourceId = useArchitectureStore((state) => state.connectingSourceId);
  const setConnectingSourceId = useArchitectureStore((state) => state.setConnectingSourceId);
  const connectNodes = useArchitectureStore((state) => state.connectNodes);
  const addNode = useArchitectureStore((state) => state.addNode);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load project & architecture
  useEffect(() => {
    async function loadData() {
      try {
        const pRes = await fetch(`/api/projects/${projectId}`);
        const pJson = await pRes.json();
        if (pJson.success && pJson.data?.project) {
          setProject(pJson.data.project);
        }

        const aRes = await fetch(`/api/projects/${projectId}/architecture`);
        const aJson = await aRes.json();
        if (aJson.success && aJson.data?.architecture?.graph_data) {
          const graphData = aJson.data.architecture.graph_data;
          if (Array.isArray(graphData.nodes) && graphData.nodes.length > 0) {
            setNodes(graphData.nodes);
            setEdges(graphData.edges || []);
            setTimeout(() => {
              applyLayout("LR");
              fitView({ padding: 0.2 });
            }, 250);
          }
        }
      } catch (err) {
        console.error("Failed to load workspace data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [projectId, setNodes, setEdges, fitView, applyLayout]);

  // Keyboard Shortcuts: Ctrl+Z, Ctrl+Y, Delete, Zoom (+/-), Fit View (F), Tool switching (V, H, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (isInput) return;

      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "Z"))) {
        e.preventDefault();
        redo();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedNode) {
          deleteNode(selectedNode.id);
        }
      } else if (e.key === "=" || e.key === "+") {
        e.preventDefault();
        zoomIn({ duration: 200 });
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        zoomOut({ duration: 200 });
      } else if (e.key === "0" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        zoomTo(1, { duration: 200 });
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        fitView({ padding: 0.2, duration: 300 });
      } else if (e.key === "v" || e.key === "V") {
        setActiveTool("select");
        setConnectingSourceId(null);
      } else if (e.key === "h" || e.key === "H") {
        setActiveTool("hand");
        setConnectingSourceId(null);
      } else if (e.key === "Escape") {
        setActiveTool("select");
        setConnectingSourceId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, deleteNode, selectedNode, zoomIn, zoomOut, zoomTo, fitView, setActiveTool, setConnectingSourceId]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      // If a connection tool is active, handle source/target two-click connection
      if (activeTool === "line" || activeTool === "arrow" || activeTool === "connector") {
        if (!connectingSourceId) {
          setConnectingSourceId(node.id);
        } else if (connectingSourceId !== node.id) {
          connectNodes(connectingSourceId, node.id, activeTool);
          setConnectingSourceId(null);
          setActiveTool("select");
        }
        return;
      }

      setSelectedNode(node as ArchitectureNode);
    },
    [activeTool, connectingSourceId, setConnectingSourceId, connectNodes, setActiveTool, setSelectedNode]
  );

  const onEdgeClick: EdgeMouseHandler = useCallback(
    (_, edge) => {
      setSelectedEdge(edge);
    },
    [setSelectedEdge]
  );

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      // Clear pending connection if user clicks empty canvas
      if (connectingSourceId) {
        setConnectingSourceId(null);
      }

      // If a shape tool is active, place it directly at clicked canvas coordinates
      if (activeTool === "rectangle" || activeTool === "circle" || activeTool === "text") {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const titles: Record<string, string> = {
          rectangle: "Service Group",
          circle: "Boundary",
          text: "Architecture Note",
        };

        const newNode: ArchitectureNode = {
          id: `shape-${activeTool}-${Date.now()}`,
          type: "customComponent",
          position,
          data: {
            label: titles[activeTool] || "Diagram Shape",
            componentType: "backend",
            technology: "Diagram Shape",
            shapeType: activeTool,
            status: "active",
          },
        };

        addNode(newNode);
        setSelectedNode(newNode);
        setActiveTool("select");
        return;
      }

      setSelectedNode(null);
      setSelectedEdge(null);
    },
    [
      activeTool,
      connectingSourceId,
      screenToFlowPosition,
      addNode,
      setSelectedNode,
      setSelectedEdge,
      setActiveTool,
      setConnectingSourceId,
    ]
  );

  // Save Architecture
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`/api/projects/${projectId}/architecture`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          graphData: { nodes, edges },
        }),
      });
      const json = await res.json();
      if (json.success) {
        resetDirty();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#000000] text-[#71717a] font-mono text-xs">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 rounded-full border-2 border-[#f97316] border-t-transparent animate-spin" />
          <span>Opening Sketch Workspace...</span>
        </div>
      </div>
    );
  }

  const sourceNodeLabel = nodes.find((n) => n.id === connectingSourceId)?.data?.label || "Selected Node";

  return (
    <div className="flex flex-col h-[calc(100vh-68px)] w-full overflow-hidden bg-[#000000] text-[#f4f4f5]">
      {/* Top Bar */}
      <WorkspaceTopBar
        projectId={projectId}
        projectName={project?.name || "Architecture Workspace"}
        onSave={handleSave}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
      />

      {/* Main Studio Area */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Toolbar */}
        <LeftToolbar />

        {/* Center: React Flow Canvas */}
        <div className="flex-1 h-full relative">
          {/* Active Tool Guidance HUD */}
          {activeTool !== "select" && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#111111]/95 border border-[#f97316]/50 shadow-2xl backdrop-blur-md text-xs font-mono text-white">
              <span className="h-2 w-2 rounded-full bg-[#f97316] animate-pulse" />
              <span>
                {activeTool === "hand" && "Hand Tool: Drag anywhere on canvas to pan viewport"}
                {activeTool === "rectangle" && "Rectangle Tool: Click canvas to place boundary box"}
                {activeTool === "circle" && "Circle Tool: Click canvas to place boundary circle"}
                {activeTool === "text" && "Text Tool: Click canvas to place text note"}
                {activeTool === "arrow" &&
                  (connectingSourceId
                    ? `Source: [${sourceNodeLabel}] → Click target node to draw arrow`
                    : "Arrow Tool: Click source node, then click target node")}
                {activeTool === "line" &&
                  (connectingSourceId
                    ? `Source: [${sourceNodeLabel}] → Click target node to draw straight line`
                    : "Line Tool: Click source node, then click target node")}
                {activeTool === "connector" &&
                  (connectingSourceId
                    ? `Source: [${sourceNodeLabel}] → Click target node to create bus connector`
                    : "Connector Tool: Click source node, then click target node")}
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveTool("select");
                  setConnectingSourceId(null);
                }}
                className="ml-2 text-[10px] text-[#a1a1aa] hover:text-white px-2 py-0.5 rounded bg-[#18181b] border border-white/10 transition-colors"
              >
                Done (Esc)
              </button>
            </div>
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            fitView
            minZoom={0.15}
            maxZoom={2.5}
            zoomOnScroll={true}
            zoomOnPinch={true}
            zoomOnDoubleClick={false}
            panOnDrag={activeTool === "hand" ? true : [1, 2]}
            selectionOnDrag={activeTool === "select"}
            elementsSelectable={activeTool !== "hand"}
            className={`bg-[#000000] ${
              activeTool === "hand"
                ? "!cursor-grab active:!cursor-grabbing"
                : activeTool === "select"
                ? "cursor-default"
                : "cursor-crosshair"
            }`}
          >
            <Background color="rgba(255, 255, 255, 0.08)" gap={20} size={1} />
            <Controls
              position="bottom-right"
              showZoom={true}
              showFitView={true}
              showInteractive={true}
              className="!bg-[#111111] !border-white/10 text-white !shadow-xl"
            />
            <CanvasZoomHud />
            <MiniMap
              nodeColor={(node) => {
                const comp = node.data as unknown as { componentType?: string; status?: string };
                if (comp.status === "changed") return "#ef4444";
                if (comp.status === "affected_direct") return "#f59e0b";
                if (comp.status === "affected_indirect") return "#eab308";
                switch (comp.componentType) {
                  case "frontend":
                    return "#38bdf8";
                  case "backend":
                    return "#6366f1";
                  case "database":
                    return "#10b981";
                  case "cache":
                    return "#f59e0b";
                  case "ai":
                    return "#f97316";
                  default:
                    return "#71717a";
                }
              }}
              className="!bg-[#111111]/90 !border-white/10"
            />
          </ReactFlow>
        </div>

        {/* Right Inspector Drawer */}
        <ComponentDetails
          projectId={projectId}
          projectName={project?.name || "Software System"}
        />
      </div>

      {/* Bottom AI Command Bar */}
      <BottomCommandBar projectId={projectId} />
    </div>
  );
}

export default function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);

  return (
    <ReactFlowProvider>
      <WorkspaceCanvasInner projectId={projectId} />
    </ReactFlowProvider>
  );
}
