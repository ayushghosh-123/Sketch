"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  type NodeTypes,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useArchitectureStore, type ArchitectureNode } from "./store";
import { CustomNode } from "./CustomNode";
import { ComponentLibrary } from "./ComponentLibrary";
import { ComponentDetails } from "./ComponentDetails";
import { AgentWorkflowVisualizer } from "@/features/agents/AgentWorkflowVisualizer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Save,
  RotateCw,
  LayoutGrid,
  Activity,
  Layers,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const nodeTypes: NodeTypes = {
  customComponent: CustomNode,
};

interface ArchitectureCanvasProps {
  projectId: string;
}

function ArchitectureCanvasInner({ projectId }: ArchitectureCanvasProps) {
  const { fitView, screenToFlowPosition } = useReactFlow();

  const nodes = useArchitectureStore((state) => state.nodes);
  const edges = useArchitectureStore((state) => state.edges);
  const onNodesChange = useArchitectureStore((state) => state.onNodesChange);
  const onEdgesChange = useArchitectureStore((state) => state.onEdgesChange);
  const onConnect = useArchitectureStore((state) => state.onConnect);
  const setNodes = useArchitectureStore((state) => state.setNodes);
  const setEdges = useArchitectureStore((state) => state.setEdges);
  const setSelectedNode = useArchitectureStore((state) => state.setSelectedNode);
  const applyLayout = useArchitectureStore((state) => state.applyLayout);
  const addNode = useArchitectureStore((state) => state.addNode);
  const isDirty = useArchitectureStore((state) => state.isDirty);
  const resetDirty = useArchitectureStore((state) => state.resetDirty);

  // AI Workflow generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, "idle" | "running" | "completed" | "failed">>({});
  const [logs, setLogs] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load existing architecture on mount
  useEffect(() => {
    async function loadArchitecture() {
      try {
        const res = await fetch(`/api/projects/${projectId}/architecture`);
        const json = await res.json();
        if (json.success && json.data?.architecture?.graph_data) {
          const graphData = json.data.architecture.graph_data;
          if (Array.isArray(graphData.nodes) && graphData.nodes.length > 0) {
            setNodes(graphData.nodes);
            setEdges(graphData.edges || []);
            setTimeout(() => fitView({ padding: 0.2 }), 200);
          }
        }
      } catch (err) {
        console.error("Failed to load architecture:", err);
      }
    }

    loadArchitecture();
  }, [projectId, setNodes, setEdges, fitView]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      setSelectedNode(node as ArchitectureNode);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  // Handle Drag and Drop from ComponentLibrary
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const rawData = event.dataTransfer.getData("application/reactflow");
      if (!rawData) return;

      try {
        const preset = JSON.parse(rawData);
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode: ArchitectureNode = {
          id: `comp-${preset.type}-${Date.now()}`,
          type: "customComponent",
          position,
          data: {
            label: preset.label,
            componentType: preset.type,
            technology: preset.defaultTech,
            description: preset.defaultDesc,
            responsibilities: ["Core service responsibility"],
            status: "active",
          },
        };

        addNode(newNode);
      } catch (e) {
        console.error("Drop parsing failed:", e);
      }
    },
    [screenToFlowPosition, addNode]
  );

  // Save Architecture Graph
  const handleSaveArchitecture = async () => {
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
      console.error("Failed to save architecture:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Run LangGraph Autonomous Workflow
  const handleGenerateArchitecture = async () => {
    setIsGenerating(true);
    setCurrentNode(null);
    setNodeStatuses({});
    setLogs(["Connecting to LangGraph.js Agent Orchestrator..."]);

    try {
      const response = await fetch(`/api/projects/${projectId}/architecture/generate`, {
        method: "POST",
      });

      if (!response.body) throw new Error("No response stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (!dataStr) continue;

            try {
              const event = JSON.parse(dataStr);

              if (event.type === "node_status") {
                setCurrentNode(event.nodeName);
                setNodeStatuses((prev) => ({
                  ...prev,
                  [event.nodeName]: event.status,
                }));
                if (event.message) {
                  setLogs((prev) => [...prev, `${event.message}`]);
                }
              } else if (event.type === "complete") {
                setLogs((prev) => [...prev, "? Architecture Blueprint Synthesized!"]);

                // Reload the updated architecture graph
                const res = await fetch(`/api/projects/${projectId}/architecture`);
                const json = await res.json();
                if (json.success && json.data?.architecture?.graph_data) {
                  setNodes(json.data.architecture.graph_data.nodes);
                  setEdges(json.data.architecture.graph_data.edges || []);
                  setTimeout(() => {
                    applyLayout("LR");
                    fitView({ padding: 0.2 });
                  }, 300);
                }
              } else if (event.type === "error") {
                setLogs((prev) => [...prev, `Error: ${event.error}`]);
              }
            } catch (pErr) {
              console.warn("Event parse error:", pErr);
            }
          }
        }
      }
    } catch (err: unknown) {
      console.error("Generation failed:", err);
      setLogs((prev) => [...prev, `Workflow failed: ${err instanceof Error ? err.message : "Unknown error"}`]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] w-full overflow-hidden bg-slate-950">
      {/* Canvas Work Area */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left: Component Library */}
        <ComponentLibrary />

        {/* Center: React Flow Canvas */}
        <div className="flex-1 h-full relative" onDragOver={onDragOver} onDrop={onDrop}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            className="bg-slate-950"
          >
            <Background color="#1e293b" gap={20} size={1} />
            <Controls className="!bg-slate-900 !border-slate-800 text-slate-300" />
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
                    return "#a855f7";
                  default:
                    return "#64748b";
                }
              }}
              className="!bg-slate-900/90 !border-slate-800"
            />

            {/* Top Canvas Toolbar Panel */}
            <Panel position="top-right" className="flex items-center gap-2 m-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyLayout("LR")}
                className="bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-800 text-xs shadow-lg backdrop-blur-md"
              >
                <LayoutGrid className="h-3.5 w-3.5 mr-1.5 text-sky-400" />
                Auto-Layout
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveArchitecture}
                disabled={isSaving}
                className="bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-800 text-xs shadow-lg backdrop-blur-md"
              >
                {saveSuccess ? (
                  <span className="flex items-center text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    Saved
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                    {isSaving ? "Saving..." : isDirty ? "Save Changes *" : "Save"}
                  </span>
                )}
              </Button>

              <Button
                size="sm"
                onClick={handleGenerateArchitecture}
                disabled={isGenerating}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/25"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                {isGenerating ? "Synthesizing..." : "Generate with LangGraph"}
              </Button>
            </Panel>
          </ReactFlow>
        </div>

        {/* Right: Component Details & Impact Simulator Drawer */}
        <ComponentDetails projectId={projectId} />
      </div>

      {/* Bottom: Live LangGraph Execution Visualizer */}
      <AgentWorkflowVisualizer
        currentNode={currentNode}
        nodeStatuses={nodeStatuses}
        isGenerating={isGenerating}
        logs={logs}
      />
    </div>
  );
}

export function ArchitectureCanvas({ projectId }: ArchitectureCanvasProps) {
  return (
    <ReactFlowProvider>
      <ArchitectureCanvasInner projectId={projectId} />
    </ReactFlowProvider>
  );
}
