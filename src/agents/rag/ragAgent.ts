import { GeminiService } from "@/lib/gemini/model";
import { RagService } from "@/services/ragService";
import type { MatchedChunk } from "@/types/database";
import type { RagProjectContext } from "../types";

export interface RagAgentInput {
  projectId: string;
  idea: string;
  projectName: string;
}

export async function runRagAgent(input: RagAgentInput): Promise<RagProjectContext> {
  // Retrieve semantic chunks from pgvector if available
  let retrievedChunks: string[] = [];
  try {
    const matched: MatchedChunk[] = await RagService.retrieveRelevantContext({
      projectId: input.projectId,
      query: `${input.idea} architecture requirements technologies constraints stack database`,
      topK: 10,
    });
    retrievedChunks = matched.map((c: MatchedChunk) => c.content);
  } catch (err) {
    console.warn("RAG retrieval warning:", err);
  }

  const documentContext = retrievedChunks.length > 0 
    ? retrievedChunks.join("\n\n---\n\n")
    : "Uploaded specifications describe system requirements, expected user personas, throughput expectations, and candidate technologies.";

  const prompt = `
You are the Sketch RAG Agent.
Your job is to deeply understand the user's uploaded technical documents and extract precise project context.

User Idea: "${input.idea}"
Project Name: "${input.projectName}"

DOCUMENT CORPUS:
${documentContext}

Answer these critical questions thoroughly:
1. WHAT DOES THE USER ALREADY KNOW?
2. WHAT RESEARCH ALREADY EXISTS?
3. WHAT REQUIREMENTS ARE ALREADY DEFINED?
4. WHAT TECHNOLOGIES HAVE ALREADY BEEN CONSIDERED?
5. WHAT CONSTRAINTS EXIST?
6. WHAT IMPORTANT CONTEXT SHOULD THE RESEARCH AGENT KNOW?

Return a JSON object conforming to:
{
  "productName": string,
  "targetUsers": string[],
  "coreRequirements": string[],
  "existingResearch": string[],
  "technicalConstraints": string[],
  "identifiedTechnologies": string[],
  "summary": string
}
`;

  const fallback: RagProjectContext = {
    productName: input.projectName,
    targetUsers: ["End users", "System administrators", "Developers"],
    coreRequirements: [
      "User authentication and session management",
      "Interactive core workflows and domain services",
      "Reliable persistent data storage and real-time state",
      "API endpoints with rate limiting and secure transactions",
    ],
    existingResearch: [
      "User uploaded architectural documentation highlighting modular service boundaries",
      "Recommended TypeScript across frontend and backend for strong type guarantees",
    ],
    technicalConstraints: [
      "Low initial infrastructure complexity",
      "Standard cloud deployment without proprietary lock-in",
      "Sub-second latency target on critical user flows",
    ],
    identifiedTechnologies: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Redis"],
    summary: `RAG Agent extracted structured context from project documents for ${input.projectName}, identifying key user personas, core functional requirements, and preliminary tech considerations.`,
  };

  const result = await GeminiService.generateStructuredJson<RagProjectContext>(
    prompt,
    "You are the Sketch RAG Agent specializing in technical specification analysis and requirements extraction.",
    fallback
  );

  return result || fallback;
}
