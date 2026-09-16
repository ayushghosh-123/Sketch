import { NextRequest, NextResponse } from "next/server";
import { ArchitectureService } from "@/services/architectureService";
import { ProjectService } from "@/services/projectService";
import { runAIEditorAgent } from "@/agents/editing/aiEditorAgent";
import { AgentLogger } from "@/lib/logger/agentLogger";
import { rateLimit, getClientIp } from "@/lib/security/rateLimiter";
import { sanitizePromptInput } from "@/lib/security/sanitizer";
import type { ArchitectureGraphData, ComponentType } from "@/types/database";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  // Rate limit: 20 edit requests per minute per IP
  const clientIp = getClientIp(request);
  const limitResult = rateLimit(`arch_edit:${clientIp}`, { limit: 20, windowMs: 60 * 1000 });
  if (!limitResult.success) {
    return NextResponse.json(
      { success: false, error: "Too many edit requests. Please wait a moment." },
      { status: 429 }
    );
  }

  const { id: projectId } = await props.params;

  try {
    const body = await request.json();
    const { command: rawCommand, apply = false } = body;

    if (!rawCommand || typeof rawCommand !== "string" || !rawCommand.trim()) {
      return NextResponse.json(
        { success: false, error: "Command is required." },
        { status: 400 }
      );
    }

    const command = sanitizePromptInput(rawCommand.trim(), 1000);

    AgentLogger.banner("API /architecture/edit TRIGGERED", {
      projectId,
      command,
      applyMode: apply ? "APPLY_CHANGES" : "PREVIEW_ONLY",
    });

    const projectData = await ProjectService.getProjectById(projectId);
    if (!projectData) {
      return NextResponse.json(
        { success: false, error: "Project not found." },
        { status: 404 }
      );
    }

    const { architecture } = await ArchitectureService.getArchitecture(projectId);
    const currentGraph: ArchitectureGraphData = architecture?.graph_data || { nodes: [], edges: [] };

    // 1. Run AI Editor Agent to analyze command and draft changes
    const proposedChange = await runAIEditorAgent({
      command,
      currentGraph,
      projectName: projectData.project.name,
    });

    // If apply is false, return the proposed changes preview
    if (!apply) {
      return NextResponse.json({
        success: true,
        data: {
          proposedChange,
          previewOnly: true,
        },
      });
    }

    // 2. If apply is true, synthesize new nodes and edges into the graph
    const updatedNodes = [...currentGraph.nodes];
    const updatedEdges = [...currentGraph.edges];

    // Remove components
    if (proposedChange.remove && proposedChange.remove.length > 0) {
      const removeIds = new Set(proposedChange.remove.map((r) => r.componentId));
      const filteredNodes = updatedNodes.filter((n) => !removeIds.has(n.id));
      const filteredEdges = updatedEdges.filter(
        (e) => !removeIds.has(e.source) && !removeIds.has(e.target)
      );
      updatedNodes.length = 0;
      updatedNodes.push(...filteredNodes);
      updatedEdges.length = 0;
      updatedEdges.push(...filteredEdges);
    }

    // Add components
    if (proposedChange.add && proposedChange.add.length > 0) {
      proposedChange.add.forEach((newComp, idx) => {
        const id = `comp-${newComp.category}-${Date.now()}-${idx}`;
        // Calculate safe position near related nodes
        const avgX = updatedNodes.length > 0
          ? Math.round(updatedNodes.reduce((acc, n) => acc + n.position.x, 0) / updatedNodes.length) + 120
          : 300;
        const avgY = updatedNodes.length > 0
          ? Math.round(updatedNodes.reduce((acc, n) => acc + n.position.y, 0) / updatedNodes.length) + 40
          : 200;

        updatedNodes.push({
          id,
          type: "customComponent",
          position: { x: avgX, y: avgY },
          data: {
            label: newComp.name,
            componentType: newComp.category as ComponentType,
            technology: newComp.technology,
            description: newComp.description,
            responsibilities: ["Added via AI Command: " + command],
            status: "active",
          },
        });

        // Wire connections to/from this new component
        if (proposedChange.newConnections && proposedChange.newConnections.length > 0) {
          proposedChange.newConnections.forEach((nc, cIdx) => {
            const sourceId = nc.source.startsWith("comp-") ? nc.source : id;
            const targetId = nc.target.startsWith("comp-") ? nc.target : id;

            updatedEdges.push({
              id: `edge-${sourceId}-${targetId}-${Date.now()}-${cIdx}`,
              source: sourceId,
              target: targetId,
              label: nc.label || "Communication",
              type: "smoothstep",
              animated: true,
              style: { stroke: "#0ea5e9", strokeWidth: 2 },
            });
          });
        }
      });
    }

    // Save updated graph data
    const newGraphData: ArchitectureGraphData = {
      nodes: updatedNodes,
      edges: updatedEdges,
    };

    await ArchitectureService.updateGraphData(projectId, newGraphData);
    await ArchitectureService.createVersion(
      projectId,
      `AI Edit: "${command}"`
    );

    return NextResponse.json({
      success: true,
      data: {
        proposedChange,
        applied: true,
        graphData: newGraphData,
        message: `Applied changes: ${proposedChange.summary}`,
      },
    });
  } catch (err: unknown) {
    console.error("AI editing error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to process AI edit command.",
      },
      { status: 500 }
    );
  }
}
