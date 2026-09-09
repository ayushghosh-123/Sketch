import type { ProjectStateType } from "../state";
import { GeminiService } from "@/lib/gemini/model";
import type { GeneratedDependency } from "@/types/architecture";

export async function dependencyGeneratorNode(state: ProjectStateType): Promise<Partial<ProjectStateType>> {
  const components = state.components || [];
  if (components.length === 0) {
    return { dependencies: [], analysisStatus: "dependencies_empty" };
  }

  const compList = components.map((c) => `${c.id} (${c.name}, type: ${c.type})`).join("\n");

  const prompt = `
Given these architectural components:
${compList}

Generate realistic directed dependencies where Component A calls or depends on Component B.
Valid types: 'sync', 'async', 'event', 'data_stream', 'auth'.
Return JSON with key "dependencies": array of objects with { source, target, type, description }.
`;

  // Deterministic fallback dependency generator based on component types
  const fallbackDeps: GeneratedDependency[] = [];
  const compIds = components.map((c) => c.id);

  const findCompByType = (type: string) => components.find((c) => c.type === type)?.id;

  const frontend = findCompByType("frontend");
  const api = findCompByType("api");
  const auth = findCompByType("authentication");
  const backend = findCompByType("backend");
  const db = findCompByType("database");
  const cache = findCompByType("cache");
  const queue = findCompByType("queue");
  const ai = findCompByType("ai") || findCompByType("agent");

  if (frontend && api) {
    fallbackDeps.push({ source: frontend, target: api, type: "sync", description: "HTTPS / REST / GraphQL requests" });
  } else if (frontend && backend) {
    fallbackDeps.push({ source: frontend, target: backend, type: "sync", description: "HTTP Client API calls" });
  }

  if (api && auth) {
    fallbackDeps.push({ source: api, target: auth, type: "auth", description: "Bearer token validation & RBAC" });
  }

  if (api && backend) {
    fallbackDeps.push({ source: api, target: backend, type: "sync", description: "Reverse proxy routed requests" });
  }

  if (backend && db) {
    fallbackDeps.push({ source: backend, target: db, type: "sync", description: "SQL connection pool & ACID transactions" });
  }

  if (backend && cache) {
    fallbackDeps.push({ source: backend, target: cache, type: "sync", description: "Key-value query cache & session lookups" });
  }

  if (backend && queue) {
    fallbackDeps.push({ source: backend, target: queue, type: "async", description: "Publishes domain events" });
  }

  if (backend && ai) {
    fallbackDeps.push({ source: backend, target: ai, type: "sync", description: "Invokes autonomous agent workflows" });
  }

  if (ai && db) {
    fallbackDeps.push({ source: ai, target: db, type: "data_stream", description: "pgvector similarity search queries" });
  }

  const result = await GeminiService.generateStructuredJson<{ dependencies: GeneratedDependency[] }>(
    prompt,
    "You are a Senior System Architect generating component dependency topologies.",
    { dependencies: fallbackDeps }
  );

  // Validate that source and target exist in components
  const validDeps = (result?.dependencies || fallbackDeps).filter(
    (d) => compIds.includes(d.source) && compIds.includes(d.target) && d.source !== d.target
  );

  return {
    dependencies: validDeps.length > 0 ? validDeps : fallbackDeps,
    analysisStatus: "dependencies_generated",
  };
}
