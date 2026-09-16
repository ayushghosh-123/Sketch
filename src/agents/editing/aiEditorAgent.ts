import { GeminiService } from "@/lib/gemini/model";
import { AgentLogger } from "@/lib/logger/agentLogger";
import type { ProposedArchitectureChange } from "../types";
import type { ArchitectureGraphData } from "@/types/database";

export interface AIEditorInput {
  command: string;
  currentGraph: ArchitectureGraphData;
  projectName: string;
}

export async function runAIEditorAgent(input: AIEditorInput): Promise<ProposedArchitectureChange> {
  AgentLogger.agentAction("AI Editor Agent", "COMMAND RECEIVED", {
    command: input.command,
    existingNodesCount: input.currentGraph?.nodes?.length || 0,
    existingEdgesCount: input.currentGraph?.edges?.length || 0,
  });
  const currentNodes = input.currentGraph.nodes.map(
    (n) => `${n.id} (${n.data.label} - ${n.data.componentType} - ${n.data.technology})`
  );
  const currentEdges = input.currentGraph.edges.map(
    (e) => `${e.source} -> ${e.target} [${e.label || "link"}]`
  );

  const prompt = `
You are the Sketch Architecture Editing Agent.
The user wants to modify their existing software architecture with a natural language command.

USER COMMAND: "${input.command}"
PROJECT: "${input.projectName}"

CURRENT SYSTEM COMPONENTS:
${currentNodes.join("\n")}

CURRENT CONNECTIONS:
${currentEdges.join("\n")}

YOUR RESPONSIBILITY:
Analyze the impact of the user's command and plan the exact structural changes needed.
Identify:
1. What components should be ADDED?
2. What components should be MODIFIED?
3. What components should be REMOVED?
4. What new connections should be created?
5. What is the risk level (low, medium, high)?
6. Provide a concise summary of the architectural impact.

Return valid JSON conforming to:
{
  "command": ${JSON.stringify(input.command)},
  "summary": string,
  "riskLevel": "low" | "medium" | "high",
  "add": [
    {
      "name": string,
      "category": "frontend" | "backend" | "database" | "cache" | "queue" | "api" | "authentication" | "storage" | "ai" | "agent" | "external_service" | "devops",
      "technology": string,
      "description": string,
      "layerId": "client" | "application" | "ai" | "data" | "infra"
    }
  ],
  "modify": [
    {
      "componentId": string,
      "name": string,
      "changes": string
    }
  ],
  "remove": [
    {
      "componentId": string,
      "name": string
    }
  ],
  "newConnections": [
    {
      "source": string,
      "target": string,
      "label": string
    }
  ]
}
`;

  const lowerCmd = input.command.toLowerCase();
  let fallback: ProposedArchitectureChange = {
    command: input.command,
    summary: `Add and wire up components according to request: "${input.command}".`,
    riskLevel: "medium",
    add: [],
    modify: [],
    remove: [],
    newConnections: [],
  };

  if (lowerCmd.includes("redis") || lowerCmd.includes("cache")) {
    fallback = {
      command: input.command,
      summary: "Add Redis In-Memory Cache and update Backend API to route hot read queries to cache before hit database.",
      riskLevel: "low",
      add: [
        {
          name: "Redis Cache Cluster",
          category: "cache",
          technology: "Redis (In-Memory Key-Value)",
          description: "Sub-millisecond query cache and distributed session lock manager.",
          layerId: "data",
        },
      ],
      modify: [
        {
          componentId: "comp-backend",
          name: "Backend API",
          changes: "Add Redis client driver, cache lookup middleware, and automatic TTL invalidation on mutations.",
        },
      ],
      remove: [],
      newConnections: [
        {
          source: "comp-backend",
          target: "comp-cache-cluster",
          label: "Cache Get/Set",
        },
      ],
    };
  } else if (lowerCmd.includes("mobile") || lowerCmd.includes("ios") || lowerCmd.includes("android")) {
    fallback = {
      command: input.command,
      summary: "Add React Native Mobile Application to Client Layer and connect to API Gateway with offline cache.",
      riskLevel: "medium",
      add: [
        {
          name: "Mobile Application",
          category: "frontend",
          technology: "React Native / Expo",
          description: "Cross-platform iOS and Android native client app with push notifications.",
          layerId: "client",
        },
      ],
      modify: [
        {
          componentId: "comp-api",
          name: "API Gateway",
          changes: "Enable Mobile User-Agent headers, push notification webhook endpoints, and device token storage.",
        },
      ],
      remove: [],
      newConnections: [
        {
          source: "comp-mobile",
          target: "comp-api",
          label: "REST / WebSocket",
        },
      ],
    };
  } else if (lowerCmd.includes("scale") || lowerCmd.includes("scalable") || lowerCmd.includes("queue")) {
    fallback = {
      command: input.command,
      summary: "Add asynchronous message queue (BullMQ / Kafka) to buffer spikes and decouple heavy background operations.",
      riskLevel: "medium",
      add: [
        {
          name: "Asynchronous Message Queue",
          category: "queue",
          technology: "Apache Kafka / BullMQ",
          description: "Event stream buffer decoupling synchronous API requests from long-running jobs.",
          layerId: "data",
        },
      ],
      modify: [
        {
          componentId: "comp-backend",
          name: "Backend API",
          changes: "Emit asynchronous task events to queue instead of processing blocking jobs in HTTP cycle.",
        },
      ],
      remove: [],
      newConnections: [
        {
          source: "comp-backend",
          target: "comp-queue",
          label: "Enqueue Job",
        },
      ],
    };
  }

  const result = await GeminiService.generateStructuredJson<ProposedArchitectureChange>(
    prompt,
    "You are the Sketch Architecture Editing Agent providing safe, impact-aware architecture modifications.",
    fallback,
    "AI Editor Agent"
  );

  const finalOutput = result || fallback;
  AgentLogger.agentAction("AI Editor Agent", "PROPOSED ARCHITECTURE CHANGE", {
    command: finalOutput.command,
    summary: finalOutput.summary,
    riskLevel: finalOutput.riskLevel,
    componentsToAdd: finalOutput.add?.length || 0,
    componentsToModify: finalOutput.modify?.length || 0,
    componentsToRemove: finalOutput.remove?.length || 0,
    newConnections: finalOutput.newConnections?.length || 0,
  });

  return finalOutput;
}
