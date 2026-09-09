import { NextRequest } from "next/server";
import { ProjectService } from "@/services/projectService";
import { runArchitectureWorkflow } from "@/lib/langgraph/workflow";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await props.params;
  const projectData = await ProjectService.getProjectById(projectId);

  if (!projectData) {
    return new Response(JSON.stringify({ error: "Project not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { project, requirements } = projectData;

  // Setup Server-Sent Events stream
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const sendEvent = async (data: Record<string, unknown>) => {
    try {
      await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    } catch {
      // Stream closed by client
    }
  };

  // Launch async execution in background of stream
  (async () => {
    try {
      await sendEvent({
        type: "init",
        message: "Initiating LangGraph.js Agent Architecture workflow...",
        timestamp: new Date().toISOString(),
      });

      const result = await runArchitectureWorkflow(
        {
          projectId: project.id,
          userId: project.user_id,
          userInput: {
            name: project.name,
            description: project.description || "",
            projectType: project.project_type,
          },
          projectRequirements: requirements || {},
        },
        async (update) => {
          await sendEvent({
            type: "node_status",
            ...update,
          });
        }
      );

      await sendEvent({
        type: "complete",
        message: "Architecture generation completed successfully!",
        data: result.finalArchitecture,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      console.error("LangGraph execution error:", err);
      const msg = err instanceof Error ? err.message : "Workflow execution failed";
      await sendEvent({
        type: "error",
        error: msg,
        timestamp: new Date().toISOString(),
      });
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
