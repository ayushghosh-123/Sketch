import { GeminiService } from "@/lib/gemini/model";
import { AgentLogger } from "@/lib/logger/agentLogger";
import type {
  RagProjectContext,
  ResearchFindings,
  UserPreferences,
  ArchitectureSpecification,
  ValidationResult,
} from "../types";

export interface DecisionAgentInput {
  idea: string;
  projectName: string;
  ragContext?: RagProjectContext | null;
  researchFindings: ResearchFindings;
  userPreferences?: UserPreferences;
  validationFeedback?: ValidationResult | null;
}

export async function runDecisionAgent(
  input: DecisionAgentInput
): Promise<ArchitectureSpecification> {
  const prompt = `
You are the Sketch Decision Agent.
You are the primary planning and decision-making layer of Sketch.

USER IDEA: "${input.idea}"
PROJECT NAME: "${input.projectName}"

RESEARCH FINDINGS:
- Project Type: ${input.researchFindings.projectType}
- Recommended Stack: Frontend: ${input.researchFindings.recommendedStack.frontend}, Backend: ${input.researchFindings.recommendedStack.backend}, Database: ${input.researchFindings.recommendedStack.database}, AI: ${input.researchFindings.recommendedStack.ai}, Orchestration: ${input.researchFindings.recommendedStack.orchestration}, Storage: ${input.researchFindings.recommendedStack.storage}
- Key Patterns: ${input.researchFindings.keyArchitecturalPatterns.join(", ")}
- Scalability Approach: ${input.researchFindings.scalabilityApproach}
- Security Approach: ${input.researchFindings.securityApproach}

${
  input.validationFeedback && !input.validationFeedback.isValid
    ? `PREVIOUS VALIDATION FEEDBACK TO RESOLVE:
- Missing Components: ${input.validationFeedback.missingComponents.join(", ")}
- Security Issues: ${input.validationFeedback.securityConcerns.join(", ")}
- Feedback: ${input.validationFeedback.feedbackForDecisionAgent}
Ensure you address these issues now!
`
    : ""
}

YOUR RESPONSIBILITY:
Decide the complete system architecture:
1. Architecture Layers (Client Layer, Application Layer, Data Layer, AI Layer, Infrastructure Layer)
2. Components needed (7 to 10 discrete components, e.g. Web App, Mobile App, API Gateway, Auth Service, Backend Service, AI Agent, Primary Database, Cache, Storage)
3. Direct connections between components with technical labels
4. Architectural decisions with:
   - What was chosen
   - Why it was chosen
   - Plain English simple explanation for non-technical users
   - Alternatives evaluated
   - Trade-offs

Return valid JSON conforming to:
{
  "projectName": string,
  "overview": string,
  "overviewSimple": string,
  "architecturePattern": string,
  "layers": [
    { "id": "client", "name": "Client Layer", "description": "User facing applications", "order": 0 },
    { "id": "application", "name": "Application Layer", "description": "Core routing and API logic", "order": 1 },
    { "id": "ai", "name": "AI & Compute Layer", "description": "Intelligent agent orchestration", "order": 2 },
    { "id": "data", "name": "Data Layer", "description": "Persistent and memory storage", "order": 3 },
    { "id": "infra", "name": "Infrastructure Layer", "description": "Deployment and external services", "order": 4 }
  ],
  "components": [
    {
      "id": string,
      "name": string,
      "technology": string,
      "category": "frontend" | "backend" | "database" | "cache" | "queue" | "api" | "authentication" | "storage" | "ai" | "agent" | "external_service" | "devops",
      "layerId": "client" | "application" | "ai" | "data" | "infra",
      "description": string,
      "responsibilities": string[]
    }
  ],
  "connections": [
    {
      "source": string,
      "target": string,
      "label": string,
      "type": "sync" | "async" | "auth" | "data_stream",
      "description": string
    }
  ],
  "technologyStack": {
    "frontend": { "name": string, "reason": string, "simpleReason": string },
    "backend": { "name": string, "reason": string, "simpleReason": string },
    "database": { "name": string, "reason": string, "simpleReason": string },
    "ai": { "name": string, "reason": string, "simpleReason": string },
    "storage": { "name": string, "reason": string, "simpleReason": string },
    "deployment": { "name": string, "reason": string, "simpleReason": string }
  },
  "decisions": [
    {
      "id": string,
      "title": string,
      "category": string,
      "chosen": string,
      "why": string,
      "whySimple": string,
      "alternatives": string[],
      "tradeoffs": string,
      "status": "accepted"
    }
  ],
  "aiRequestsFlow": string[],
  "documentFlow": string[]
}
`;

  const fallback: ArchitectureSpecification = {
    projectName: input.projectName,
    overview: `Tiered modern cloud architecture designed for high availability, transactional integrity, and AI augmentation. Built around Next.js, Supabase, and LangGraph.js.`,
    overviewSimple: `A structured web system that splits your website, user login, database, and AI assistant into organized pieces that work smoothly together.`,
    architecturePattern: "Modular Cloud-Native Layered Architecture",
    layers: [
      { id: "client", name: "Client Layer", description: "User interface and client experiences", order: 0 },
      { id: "application", name: "Application Layer", description: "API ingress, routing, and business logic", order: 1 },
      { id: "ai", name: "AI & Intelligence Layer", description: "Agent orchestration and embeddings", order: 2 },
      { id: "data", name: "Data Layer", description: "Relational persistence, cache, and vector memory", order: 3 },
      { id: "infra", name: "Infrastructure Layer", description: "Global CDN, storage, and deployment", order: 4 },
    ],
    components: [
      {
        id: "comp-frontend",
        name: "Web Application",
        technology: "Next.js / TypeScript & React",
        category: "frontend",
        layerId: "client",
        description: "Responsive user-facing web client with server components and real-time state.",
        responsibilities: ["User interface", "Client routing", "SSR streaming"],
      },
      {
        id: "comp-api",
        name: "API Gateway & Router",
        technology: "Next.js Route Handlers / Edge Middleware",
        category: "api",
        layerId: "application",
        description: "Unified entry point handling CORS, rate limiting, and request routing.",
        responsibilities: ["Rate limiting", "Request dispatch", "Header validation"],
      },
      {
        id: "comp-auth",
        name: "Authentication Service",
        technology: "Supabase Auth / JWT / OAuth",
        category: "authentication",
        layerId: "application",
        description: "Identity provider managing session tokens, social OAuth, and role permissions.",
        responsibilities: ["User authentication", "Session token issuance", "RLS access tokens"],
      },
      {
        id: "comp-backend",
        name: "Core Business Logic",
        technology: "Node.js / TypeScript Services",
        category: "backend",
        layerId: "application",
        description: "Domain services executing business operations and transactional workflows.",
        responsibilities: ["Core operations", "Workflow orchestration", "Data mutations"],
      },
      {
        id: "comp-ai",
        name: "AI Agent System",
        technology: "LangGraph.js & Gemini 1.5",
        category: "ai",
        layerId: "ai",
        description: "Multi-agent engine performing autonomous reasoning and context retrieval.",
        responsibilities: ["State graph execution", "Semantic retrieval", "Reasoning synthesis"],
      },
      {
        id: "comp-db",
        name: "Primary Database",
        technology: "Supabase PostgreSQL 16",
        category: "database",
        layerId: "data",
        description: "ACID transactional relational database storing core application entities.",
        responsibilities: ["Entity storage", "Row-Level Security", "Relational integrity"],
      },
      {
        id: "comp-vector",
        name: "Vector Memory Index",
        technology: "Supabase pgvector (768-dim)",
        category: "database",
        layerId: "data",
        description: "Vector database for semantic similarity and knowledge retrieval.",
        responsibilities: ["Cosine similarity", "Chunk embeddings index", "Knowledge recall"],
      },
      {
        id: "comp-cache",
        name: "Redis Cache",
        technology: "Redis (In-Memory Key-Value)",
        category: "cache",
        layerId: "data",
        description: "High-speed in-memory store for session caching and rate limit counters.",
        responsibilities: ["Fast data retrieval", "Session state", "Throttling limits"],
      },
      {
        id: "comp-storage",
        name: "File & Asset Storage",
        technology: "Vercel Blob / S3",
        category: "storage",
        layerId: "infra",
        description: "Scalable object storage for user uploads, PDFs, and binary assets.",
        responsibilities: ["File uploads", "CDN distribution", "Signed download URLs"],
      },
    ],
    connections: [
      { source: "comp-frontend", target: "comp-api", label: "HTTPS / RPC", type: "sync", description: "Browser requests" },
      { source: "comp-api", target: "comp-auth", label: "Verify Session", type: "auth", description: "Authentication check" },
      { source: "comp-api", target: "comp-backend", label: "Routed Calls", type: "sync", description: "Business action routing" },
      { source: "comp-backend", target: "comp-db", label: "SQL Queries", type: "sync", description: "Read/write database" },
      { source: "comp-backend", target: "comp-cache", label: "Cache Get/Set", type: "sync", description: "Fast read lookup" },
      { source: "comp-backend", target: "comp-ai", label: "Agent Task", type: "async", description: "Trigger AI reasoning" },
      { source: "comp-ai", target: "comp-vector", label: "Similarity Search", type: "sync", description: "Query vector chunks" },
      { source: "comp-backend", target: "comp-storage", label: "Blob Upload", type: "sync", description: "Upload/fetch assets" },
    ],
    technologyStack: {
      frontend: {
        name: "Next.js",
        reason: "Full-stack React framework with server components, streaming SSR, and edge deployment.",
        simpleReason: "Builds fast, interactive web screens that load smoothly for users.",
      },
      backend: {
        name: "Node.js & Next.js Server Actions",
        reason: "High concurrency asynchronous I/O sharing TypeScript types across the entire project.",
        simpleReason: "Runs the background engine that processes orders and requests.",
      },
      database: {
        name: "Supabase PostgreSQL",
        reason: "Rock-solid relational consistency, built-in Row-Level Security, and pgvector extension.",
        simpleReason: "Safely stores all user accounts, records, and tables in organized storage.",
      },
      ai: {
        name: "Groq (LPU) & LangGraph.js",
        reason: "Ultra-fast low-latency LPU inference paired with deterministic multi-agent state machines.",
        simpleReason: "The ultra-fast AI engine that thinks, reasons, and organizes your project in milliseconds.",
      },
      storage: {
        name: "Vercel Blob",
        reason: "Serverless edge object storage tightly integrated with deployment.",
        simpleReason: "Stores uploaded PDFs, images, and documents securely in the cloud.",
      },
      deployment: {
        name: "Vercel",
        reason: "Zero-config edge CDN deployment with automated preview branches and instant rollback.",
        simpleReason: "Keeps your website running online 24/7 without configuring complex servers.",
      },
    },
    decisions: [
      {
        id: "dec-db-supabase",
        title: "Database Selection: Supabase PostgreSQL",
        category: "Database",
        chosen: "Supabase PostgreSQL with pgvector",
        why: "Provides relational ACID consistency, integrated Auth, and in-database vector indexing in a single managed service.",
        whySimple: "Supabase gives you database, user logins, and AI search in one easy place.",
        alternatives: ["Neon PostgreSQL", "MongoDB Atlas", "Firebase Firestore"],
        tradeoffs: "Requires connection pooling under extreme serverless cold start concurrency.",
        status: "accepted",
      },
      {
        id: "dec-ai-langgraph",
        title: "AI Orchestration: LangGraph.js",
        category: "AI & Agents",
        chosen: "LangGraph.js State Graph",
        why: "Enables cyclical multi-agent workflows, branching logic, and deterministic validation stages.",
        whySimple: "Guides AI agents to work like a team, checking each other's work step by step.",
        alternatives: ["Standard Chatbot Prompts", "AutoGPT", "Custom Python Worker"],
        tradeoffs: "Requires defining formal state schemas and TypeScript annotations.",
        status: "accepted",
      },
      {
        id: "dec-cache-redis",
        title: "In-Memory Caching: Redis",
        category: "Performance",
        chosen: "Redis Key-Value Cache",
        why: "Prevents duplicate database lookups on frequently accessed items and provides fast distributed locks.",
        whySimple: "Memorizes common answers so your website opens instantly.",
        alternatives: ["In-process Node Memory", "Memcached", "Direct DB queries"],
        tradeoffs: "Introduces cache invalidation synchronization logic.",
        status: "accepted",
      },
    ],
    aiRequestsFlow: [
      "User submits prompt in Web Application",
      "API Gateway forwards request to AI Agent System",
      "LangGraph invokes Gemini with contextual system prompt",
      "Vector index retrieves semantically matched knowledge",
      "Structured output streamed back to client",
    ],
    documentFlow: [
      "User uploads technical documents via Web Application",
      "Document is stored in Vercel Blob with signed URL",
      "Parser extracts raw text and chunks into 500-token blocks",
      "Embeddings are computed via Gemini embedding model",
      "Chunks and embeddings stored in Supabase pgvector",
    ],
  };

  AgentLogger.agentAction("Decision Agent", "FORMULATING ARCHITECTURE BLUEPRINT", {
    projectName: input.projectName,
    projectType: input.researchFindings.projectType,
    hasValidationFeedback: Boolean(input.validationFeedback && !input.validationFeedback.isValid),
  });

  const result = await GeminiService.generateStructuredJson<ArchitectureSpecification>(
    prompt,
    "You are the Sketch Decision Agent, designing verified production architectures. You MUST return complete JSON with layers, components, connections, technologyStack, and decisions.",
    fallback,
    "Decision Agent"
  );

  const rawComponents = result?.components?.length ? result.components : fallback.components;
  let rawConnections = result?.connections?.length ? result.connections : [];

  if (rawConnections.length === 0 && rawComponents.length > 1) {
    const compIds = new Set(rawComponents.map((c) => c.id));
    const matchingFallback = fallback.connections.filter(
      (fc) => compIds.has(fc.source) && compIds.has(fc.target)
    );
    if (matchingFallback.length > 0) {
      rawConnections = matchingFallback;
    } else {
      for (let i = 0; i < rawComponents.length - 1; i++) {
        rawConnections.push({
          source: rawComponents[i].id,
          target: rawComponents[i + 1].id,
          label: "Inter-service RPC",
          type: "sync",
          description: `${rawComponents[i].name} to ${rawComponents[i + 1].name}`,
        });
      }
    }
  }

  const finalSpec: ArchitectureSpecification = {
    ...fallback,
    ...result,
    layers: result?.layers?.length ? result.layers : fallback.layers,
    components: rawComponents,
    connections: rawConnections.length ? rawConnections : fallback.connections,
    decisions: result?.decisions?.length ? result.decisions : fallback.decisions,
    technologyStack:
      result?.technologyStack && Object.keys(result.technologyStack).length
        ? result.technologyStack
        : fallback.technologyStack,
  };

  AgentLogger.agentAction("Decision Agent", "BLUEPRINT FORMULATED", {
    layersCount: finalSpec.layers?.length || 0,
    componentsCount: finalSpec.components?.length || 0,
    connectionsCount: finalSpec.connections?.length || 0,
    decisionsCount: finalSpec.decisions?.length || 0,
    technologyStack: Object.keys(finalSpec.technologyStack || {}),
  });

  return finalSpec;
}
