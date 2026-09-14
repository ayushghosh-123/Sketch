import dagre from "dagre";
import type { ArchitectureSpecification } from "../types";
import type { ArchitectureGraphData, ComponentType } from "@/types/database";
import { AgentLogger } from "@/lib/logger/agentLogger";

export interface CanvasAgentOutput {
  graphData: ArchitectureGraphData;
  layerGroups: Array<{
    id: string;
    name: string;
    description: string;
    nodeIds: string[];
  }>;
}

const NODE_WIDTH = 240;
const NODE_HEIGHT = 130;

/**
 * CANVAS AGENT
 * Converts a structured ArchitectureSpecification into an optimized,
 * beautiful React Flow graph layout using Dagre hierarchical placement.
 */
export function runCanvasAgent(spec: ArchitectureSpecification): CanvasAgentOutput {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: "LR",
    nodesep: 60,
    ranksep: 100,
    align: "UL",
  });

  // Add nodes to Dagre graph
  spec.components.forEach((comp) => {
    dagreGraph.setNode(comp.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  // Add edges to Dagre graph
  spec.connections.forEach((conn) => {
    dagreGraph.setEdge(conn.source, conn.target);
  });

  // Compute Dagre layout
  dagre.layout(dagreGraph);

  // Map into React Flow Nodes
  const nodes: ArchitectureGraphData["nodes"] = spec.components.map((comp) => {
    const nodeWithPos = dagreGraph.node(comp.id);
    const x = nodeWithPos ? nodeWithPos.x - NODE_WIDTH / 2 : 50;
    const y = nodeWithPos ? nodeWithPos.y - NODE_HEIGHT / 2 : 50;

    return {
      id: comp.id,
      type: "customComponent",
      position: { x: Math.round(x), y: Math.round(y) },
      data: {
        label: comp.name,
        componentType: comp.category as ComponentType,
        technology: comp.technology,
        description: comp.description,
        responsibilities: comp.responsibilities || [],
        status: "active",
      },
    };
  });

  // Map into React Flow Edges
  const edges: ArchitectureGraphData["edges"] = spec.connections.map((conn, idx) => {
    const isAuth = conn.type === "auth" || conn.label.toLowerCase().includes("auth");
    const isAsync = conn.type === "async" || conn.type === "data_stream";

    let strokeColor = "#38bdf8"; // Technical blue
    if (isAuth) strokeColor = "#f43f5e"; // Auth rose
    if (isAsync) strokeColor = "#f59e0b"; // Async amber

    return {
      id: `edge-${conn.source}-${conn.target}-${idx}`,
      source: conn.source,
      target: conn.target,
      label: conn.label,
      type: "smoothstep",
      animated: isAsync,
      style: {
        stroke: strokeColor,
        strokeWidth: 2,
      },
    };
  });

  // Layer groups for visual containers
  const layerGroups = spec.layers.map((layer) => ({
    id: layer.id,
    name: layer.name,
    description: layer.description,
    nodeIds: spec.components.filter((c) => c.layerId === layer.id).map((c) => c.id),
  }));

  const output: CanvasAgentOutput = {
    graphData: { nodes, edges },
    layerGroups,
  };

  AgentLogger.agentAction("Canvas Agent", "REACT FLOW TOPOLOGY COMPUTED", {
    totalVisualNodes: nodes.length,
    totalVisualEdges: edges.length,
    layerGroupsCount: layerGroups.length,
    layoutOrientation: "Left-to-Right (LR)",
  });

  return output;
}
