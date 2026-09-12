import { create } from "zustand";
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
} from "@xyflow/react";
import { getLayoutedElements } from "@/lib/utils/layout";
import type { ComponentType } from "@/types/database";

export interface ComponentNodeData extends Record<string, unknown> {
  label: string;
  componentType: ComponentType;
  technology?: string;
  description?: string;
  responsibilities?: string[];
  status?: "active" | "changed" | "affected_direct" | "affected_indirect";
  colorPreset?: "neutral" | "blue" | "green" | "purple" | "orange" | "red" | "custom";
  customBg?: string;
  customBorder?: string;
  shapeType?: "component" | "rectangle" | "circle" | "text";
}

export type ArchitectureNode = Node<ComponentNodeData>;

export type WorkspaceTool =
  | "select"
  | "hand"
  | "rectangle"
  | "circle"
  | "text"
  | "line"
  | "arrow"
  | "connector"
  | "delete";

interface Snapshot {
  nodes: ArchitectureNode[];
  edges: Edge[];
}

interface ArchitectureState {
  nodes: ArchitectureNode[];
  edges: Edge[];
  selectedNode: ArchitectureNode | null;
  selectedEdge: Edge | null;
  activeTool: WorkspaceTool;
  editorMode: "select" | "connect" | "simulate_impact";
  connectingSourceId: string | null;
  isDirty: boolean;
  history: Snapshot[];
  future: Snapshot[];
  impactResult: {
    changedId: string | null;
    direct: string[];
    indirect: string[];
  } | null;

  // Actions
  setNodes: (nodes: ArchitectureNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: OnNodesChange<ArchitectureNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setSelectedNode: (node: ArchitectureNode | null) => void;
  setSelectedEdge: (edge: Edge | null) => void;
  setActiveTool: (tool: WorkspaceTool) => void;
  setConnectingSourceId: (id: string | null) => void;
  connectNodes: (sourceId: string, targetId: string, tool?: "line" | "arrow" | "connector") => void;
  setEditorMode: (mode: "select" | "connect" | "simulate_impact") => void;
  addNode: (node: ArchitectureNode) => void;
  updateNodeData: (id: string, data: Partial<ComponentNodeData>) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  updateEdge: (id: string, updates: Partial<Edge>) => void;
  deleteEdge: (id: string) => void;
  applyLayout: (direction?: "LR" | "TB") => void;
  highlightImpact: (changedId: string, direct: string[], indirect: string[]) => void;
  clearImpact: () => void;
  resetDirty: () => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
}

export const useArchitectureStore = create<ArchitectureState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdge: null,
  activeTool: "select",
  editorMode: "select",
  connectingSourceId: null,
  isDirty: false,
  history: [],
  future: [],
  impactResult: null,

  pushHistory: () => {
    const { nodes, edges, history } = get();
    set({
      history: [...history.slice(-25), { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }],
      future: [],
    });
  },

  undo: () => {
    const { history, future, nodes, edges } = get();
    if (history.length === 0) return;

    const previous = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    set({
      history: newHistory,
      future: [{ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }, ...future],
      nodes: previous.nodes,
      edges: previous.edges,
      selectedNode: null,
      selectedEdge: null,
      isDirty: true,
    });
  },

  redo: () => {
    const { history, future, nodes, edges } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      history: [...history, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }],
      future: newFuture,
      nodes: next.nodes,
      edges: next.edges,
      selectedNode: null,
      selectedEdge: null,
      isDirty: true,
    });
  },

  setNodes: (nodes) => set({ nodes, isDirty: false }),
  setEdges: (edges) => set({ edges, isDirty: false }),

  onNodesChange: (changes) => {
    const updated = applyNodeChanges(changes, get().nodes);
    set({ nodes: updated, isDirty: true });
  },

  onEdgesChange: (changes) => {
    const updated = applyEdgeChanges(changes, get().edges);
    set({ edges: updated, isDirty: true });
  },

  onConnect: (connection) => {
    get().pushHistory();
    const tool = get().activeTool;
    let edgeConfig: Partial<Edge> = {
      type: "smoothstep",
      animated: true,
      style: { stroke: "#0ea5e9", strokeWidth: 2 },
      label: "Request / Flow",
    };

    if (tool === "line") {
      edgeConfig = {
        type: "straight",
        animated: false,
        style: { stroke: "#a1a1aa", strokeWidth: 2 },
      };
    } else if (tool === "arrow") {
      edgeConfig = {
        type: "smoothstep",
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: "#0ea5e9",
        },
        style: { stroke: "#0ea5e9", strokeWidth: 2 },
      };
    }

    set({
      edges: addEdge(
        {
          ...connection,
          ...edgeConfig,
        },
        get().edges
      ),
      isDirty: true,
    });
  },

  connectNodes: (sourceId, targetId, tool = "connector") => {
    if (sourceId === targetId) return;
    get().pushHistory();
    let edgeConfig: Partial<Edge> = {
      type: "smoothstep",
      animated: true,
      style: { stroke: "#0ea5e9", strokeWidth: 2 },
      label: "Request / Flow",
    };

    if (tool === "line") {
      edgeConfig = {
        type: "straight",
        animated: false,
        style: { stroke: "#a1a1aa", strokeWidth: 2 },
      };
    } else if (tool === "arrow") {
      edgeConfig = {
        type: "smoothstep",
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: "#0ea5e9",
        },
        style: { stroke: "#0ea5e9", strokeWidth: 2 },
      };
    }

    const newEdge: Edge = {
      id: `edge-${sourceId}-${targetId}-${Date.now()}`,
      source: sourceId,
      target: targetId,
      ...edgeConfig,
    };

    set({
      edges: addEdge(newEdge, get().edges),
      connectingSourceId: null,
      isDirty: true,
    });
  },

  setSelectedNode: (node) => set({ selectedNode: node, selectedEdge: null }),
  setSelectedEdge: (edge) => set({ selectedEdge: edge, selectedNode: null }),

  setActiveTool: (tool) => set({ activeTool: tool, connectingSourceId: null }),
  setConnectingSourceId: (id) => set({ connectingSourceId: id }),
  setEditorMode: (editorMode) => set({ editorMode }),

  addNode: (node) => {
    get().pushHistory();
    set({
      nodes: [...get().nodes, node],
      selectedNode: node,
      isDirty: true,
    });
  },

  updateNodeData: (id, data) => {
    get().pushHistory();
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          const updatedData = { ...node.data, ...data };
          return {
            ...node,
            data: updatedData,
          };
        }
        return node;
      }),
      isDirty: true,
    });

    if (get().selectedNode?.id === id) {
      const updated = get().nodes.find((n) => n.id === id) || null;
      set({ selectedNode: updated });
    }
  },

  deleteNode: (id) => {
    get().pushHistory();
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNode: get().selectedNode?.id === id ? null : get().selectedNode,
      isDirty: true,
    });
  },

  duplicateNode: (id) => {
    get().pushHistory();
    const target = get().nodes.find((n) => n.id === id);
    if (!target) return;

    const newNode: ArchitectureNode = {
      ...target,
      id: `comp-${target.data.componentType}-${Date.now()}`,
      position: {
        x: target.position.x + 40,
        y: target.position.y + 40,
      },
      data: {
        ...target.data,
        label: `${target.data.label} (Copy)`,
      },
    };

    set({
      nodes: [...get().nodes, newNode],
      selectedNode: newNode,
      isDirty: true,
    });
  },

  updateEdge: (id, updates) => {
    get().pushHistory();
    set({
      edges: get().edges.map((edge) => {
        if (edge.id === id) {
          return { ...edge, ...updates };
        }
        return edge;
      }),
      isDirty: true,
    });

    if (get().selectedEdge?.id === id) {
      const updated = get().edges.find((e) => e.id === id) || null;
      set({ selectedEdge: updated });
    }
  },

  deleteEdge: (id) => {
    get().pushHistory();
    set({
      edges: get().edges.filter((e) => e.id !== id),
      selectedEdge: get().selectedEdge?.id === id ? null : get().selectedEdge,
      isDirty: true,
    });
  },

  applyLayout: (direction = "LR") => {
    get().pushHistory();
    const { nodes, edges } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      direction
    );
    set({ nodes: layoutedNodes, edges: layoutedEdges, isDirty: true });
  },

  highlightImpact: (changedId, direct, indirect) => {
    const directSet = new Set(direct);
    const indirectSet = new Set(indirect);

    const updatedNodes = get().nodes.map((node) => {
      let status: "active" | "changed" | "affected_direct" | "affected_indirect" = "active";
      if (node.id === changedId) {
        status = "changed";
      } else if (directSet.has(node.id)) {
        status = "affected_direct";
      } else if (indirectSet.has(node.id)) {
        status = "affected_indirect";
      }

      return {
        ...node,
        data: { ...node.data, status },
      };
    });

    const updatedEdges = get().edges.map((edge) => {
      const isDirect = (edge.source === changedId && directSet.has(edge.target)) ||
                       (directSet.has(edge.source) && edge.target === changedId);
      const isIndirect = indirectSet.has(edge.source) || indirectSet.has(edge.target);

      return {
        ...edge,
        animated: isDirect || isIndirect,
        style: {
          stroke: isDirect ? "#f43f5e" : isIndirect ? "#f59e0b" : "#334155",
          strokeWidth: isDirect ? 3 : isIndirect ? 2.5 : 1.5,
        },
      };
    });

    set({
      nodes: updatedNodes,
      edges: updatedEdges,
      impactResult: { changedId, direct, indirect },
    });
  },

  clearImpact: () => {
    const updatedNodes = get().nodes.map((node) => ({
      ...node,
      data: { ...node.data, status: "active" as const },
    }));

    const updatedEdges = get().edges.map((edge) => ({
      ...edge,
      style: { stroke: "#0ea5e9", strokeWidth: 2 },
    }));

    set({
      nodes: updatedNodes,
      edges: updatedEdges,
      impactResult: null,
    });
  },

  resetDirty: () => set({ isDirty: false }),
}));
