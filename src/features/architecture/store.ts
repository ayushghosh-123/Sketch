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
}

export type ArchitectureNode = Node<ComponentNodeData>;

interface ArchitectureState {
  nodes: ArchitectureNode[];
  edges: Edge[];
  selectedNode: ArchitectureNode | null;
  editorMode: "select" | "connect" | "simulate_impact";
  isDirty: boolean;
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
  setEditorMode: (mode: "select" | "connect" | "simulate_impact") => void;
  addNode: (node: ArchitectureNode) => void;
  updateNodeData: (id: string, data: Partial<ComponentNodeData>) => void;
  deleteNode: (id: string) => void;
  applyLayout: (direction?: "LR" | "TB") => void;
  highlightImpact: (changedId: string, direct: string[], indirect: string[]) => void;
  clearImpact: () => void;
  resetDirty: () => void;
}

export const useArchitectureStore = create<ArchitectureState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  editorMode: "select",
  isDirty: false,
  impactResult: null,

  setNodes: (nodes) => set({ nodes, isDirty: false }),
  setEdges: (edges) => set({ edges, isDirty: false }),

  onNodesChange: (changes) =>
    set({
      nodes: applyNodeChanges(changes, get().nodes),
      isDirty: true,
    }),

  onEdgesChange: (changes) =>
    set({
      edges: applyEdgeChanges(changes, get().edges),
      isDirty: true,
    }),

  onConnect: (connection) =>
    set({
      edges: addEdge(
        {
          ...connection,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#38bdf8", strokeWidth: 2 },
          label: "sync call",
        },
        get().edges
      ),
      isDirty: true,
    }),

  setSelectedNode: (node) => set({ selectedNode: node }),

  setEditorMode: (editorMode) => set({ editorMode }),

  addNode: (node) =>
    set({
      nodes: [...get().nodes, node],
      isDirty: true,
    }),

  updateNodeData: (id, data) =>
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, ...data },
          };
        }
        return node;
      }),
      isDirty: true,
    }),

  deleteNode: (id) =>
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNode: get().selectedNode?.id === id ? null : get().selectedNode,
      isDirty: true,
    }),

  applyLayout: (direction = "LR") => {
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
      style: { stroke: "#38bdf8", strokeWidth: 2 },
    }));

    set({
      nodes: updatedNodes,
      edges: updatedEdges,
      impactResult: null,
    });
  },

  resetDirty: () => set({ isDirty: false }),
}));
