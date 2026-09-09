import { NextRequest } from "next/server";
import { ProjectService } from "@/services/projectService";
import { ArchitectureService } from "@/services/architectureService";
import { RagService } from "@/services/ragService";
import { getGeminiClient, isGeminiConfigured } from "@/lib/gemini/client";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await props.params;
  const body = await request.json();
  const { message, messages = [] } = body;

  if (!message || typeof message !== "string") {
    return new Response(JSON.stringify({ error: "Message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 1. Load project context
  const projectData = await ProjectService.getProjectById(projectId);
  const archData = await ArchitectureService.getArchitecture(projectId);

  // 2. Retrieve relevant document chunks using pgvector RAG
  const relevantChunks = await RagService.retrieveRelevantContext({
    projectId,
    query: message,
    topK: 4,
  });

  const ragContext = RagService.formatChunksForPrompt(relevantChunks);

  // 3. Format Architecture Summary
  const componentsSummary = archData.components.length > 0
    ? archData.components
        .map((c) => `- ${c.name} (${c.component_type}): ${c.technology || "tech unassigned"} - ${c.description || ""}`)
        .join("\n")
    : "No components generated yet.";

  const dependenciesSummary = archData.dependencies.length > 0
    ? archData.dependencies
        .map((d) => `- ${d.source_component_id} -> ${d.target_component_id} [${d.dependency_type}]: ${d.description || ""}`)
        .join("\n")
    : "No dependencies recorded.";

  const systemInstruction = `
You are AGENTARCHITECT AI - a Principal Software Architect and Systems Design Assistant.
You are assisting a developer on this specific project:
Project: ${projectData?.project.name || "Software System"}
Description: ${projectData?.project.description || ""}
Project Type: ${projectData?.project.project_type || ""}

Target Users: ${projectData?.requirements?.target_users || "N/A"}
Functional Requirements: ${projectData?.requirements?.functional_requirements || "N/A"}
Scale Requirements: ${projectData?.requirements?.scalability_requirements || "N/A"}
Security Requirements: ${projectData?.requirements?.security_requirements || "N/A"}

Current Architecture Components:
${componentsSummary}

Current Component Dependencies:
${dependenciesSummary}

Retrieved Document Chunks (RAG Context):
${ragContext}

INSTRUCTIONS:
1. Answer directly and authoritatively with professional software architecture best practices.
2. Ground your reasoning in the actual components, dependencies, and retrieved project documentation above.
3. If discussing changing or replacing a component, highlight upstream and downstream impact.
4. Format with markdown headings, bullet points, and code/config blocks where helpful.
`;

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  (async () => {
    try {
      // Send sources event first
      const sourcesEvent = JSON.stringify({
        type: "sources",
        sources: relevantChunks.map((c) => ({
          fileName: (c.metadata as Record<string, string>)?.fileName || "PRD Document",
          chunkIndex: c.chunk_index,
          similarity: c.similarity,
          snippet: c.content.substring(0, 180) + "...",
        })),
      });
      await writer.write(encoder.encode(`data: ${sourcesEvent}\n\n`));

      if (!isGeminiConfigured()) {
        // Fallback intelligent response for demo testing
        const fallbackText = `### Architecture Advisory

Based on your system topology for **${projectData?.project.name}**:

1. **Current Blueprint State**: You have ${archData.components.length} components configured across your architecture.
2. **Context & RAG**: Evaluated against your project specifications and technical requirements.
3. **Recommendation**: For questions regarding "${message}", ensure that inter-service contracts are versioned and asynchronous queues are used for decoupling critical path operations.

*(Note: Connect your \`GOOGLE_GENERATIVE_AI_API_KEY\` in \`.env.local\` to activate continuous full-streaming Gemini 1.5 responses).*`;

        // Stream tokens in chunks
        const tokens = fallbackText.split(" ");
        for (const token of tokens) {
          await writer.write(encoder.encode(`data: ${JSON.stringify({ type: "chunk", text: token + " " })}\n\n`));
          await new Promise((r) => setTimeout(r, 25));
        }

        await writer.write(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
        await writer.close();
        return;
      }

      // Live Gemini Streaming
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: {
          role: "system",
          parts: [{ text: systemInstruction }],
        },
      });

      const chatHistory = messages
        .filter((m: { role: string; content: string }) => m.role === "user" || m.role === "assistant")
        .map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

      const chat = model.startChat({
        history: chatHistory.slice(-6),
      });

      const resultStream = await chat.sendMessageStream(message);

      for await (const chunk of resultStream.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ type: "chunk", text: chunkText })}\n\n`)
          );
        }
      }

      await writer.write(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
    } catch (err: unknown) {
      console.error("Chat streaming error:", err);
      const msg = err instanceof Error ? err.message : "Chat error";
      await writer.write(encoder.encode(`data: ${JSON.stringify({ type: "error", error: msg })}\n\n`));
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
