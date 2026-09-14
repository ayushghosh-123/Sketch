import { GeminiService } from "@/lib/gemini/model";
import { AgentLogger } from "@/lib/logger/agentLogger";
import type { RagProjectContext, ResearchFindings, UserPreferences } from "../types";

export interface ResearchAgentInput {
  idea: string;
  projectName: string;
  ragContext?: RagProjectContext | null;
  userPreferences?: UserPreferences;
}

export async function runResearchAgent(input: ResearchAgentInput): Promise<ResearchFindings> {
  const hasRag = Boolean(input.ragContext);
  const ragDetails = hasRag
    ? `
RAG EXTRACTED CONTEXT:
- Target Users: ${input.ragContext?.targetUsers.join(", ")}
- Core Requirements: ${input.ragContext?.coreRequirements.join("; ")}
- Existing Research: ${input.ragContext?.existingResearch.join("; ")}
- Constraints: ${input.ragContext?.technicalConstraints.join("; ")}
- Considered Tech: ${input.ragContext?.identifiedTechnologies.join(", ")}
`
    : `
NO DOCUMENTS UPLOADED:
The user is starting purely from an idea. Conduct thorough, foundational architectural research from first principles.
`;

  const prefs = input.userPreferences
    ? `
USER PREFERENCES:
- Preferred Frontend: ${input.userPreferences.preferredFrontend || "None"}
- Preferred Backend: ${input.userPreferences.preferredBackend || "None"}
- Preferred Database: ${input.userPreferences.preferredDatabase || "None"}
- Preferred Cloud: ${input.userPreferences.preferredCloud || "None"}
- Budget Priority: ${input.userPreferences.budgetPriority || "balanced"}
- Security Priority: ${input.userPreferences.securityPriority || "standard"}
- Scalability Priority: ${input.userPreferences.scalabilityPriority || "standard"}
- Performance Priority: ${input.userPreferences.performancePriority || "standard"}
`
    : "";

  const prompt = `
You are the Sketch Research Agent.
You are the main research intelligence of Sketch.

USER IDEA: "${input.idea}"
PROJECT NAME: "${input.projectName}"

${ragDetails}
${prefs}

YOUR CORE RESPONSIBILITY:
Answer: WHAT IS THE BEST SOLUTION FOR THIS IDEA?
Do NOT blindly recommend the same technology every time.
Evaluate multiple options for Frontend, Backend, Database, AI Orchestration, and Storage.
Assess project complexity, budget, scalability, security, and developer experience.

Return valid JSON conforming to this structure:
{
  "projectType": string,
  "complexityAssessment": "low" | "medium" | "high" | "enterprise",
  "frontendOptions": [
    { "name": string, "category": "frontend", "recommended": boolean, "reason": string, "pros": string[], "cons": string[] }
  ],
  "backendOptions": [
    { "name": string, "category": "backend", "recommended": boolean, "reason": string, "pros": string[], "cons": string[] }
  ],
  "databaseOptions": [
    { "name": string, "category": "database", "recommended": boolean, "reason": string, "pros": string[], "cons": string[] }
  ],
  "aiOrchestration": [
    { "name": string, "category": "ai", "recommended": boolean, "reason": string, "pros": string[], "cons": string[] }
  ],
  "storageOptions": [
    { "name": string, "category": "storage", "recommended": boolean, "reason": string, "pros": string[], "cons": string[] }
  ],
  "recommendedStack": {
    "frontend": string,
    "backend": string,
    "database": string,
    "ai": string,
    "orchestration": string,
    "storage": string,
    "deployment": string
  },
  "keyArchitecturalPatterns": string[],
  "scalabilityApproach": string,
  "securityApproach": string
}
`;

  const fallback: ResearchFindings = {
    projectType: "Modern Full-Stack & AI Web Platform",
    complexityAssessment: "medium",
    frontendOptions: [
      {
        name: "Next.js (App Router)",
        category: "frontend",
        recommended: true,
        reason: "Full-stack React framework with server components, streaming SSR, and edge deployment.",
        pros: ["Server-side rendering", "First-class TypeScript support", "Strong SaaS ecosystem"],
        cons: ["Slightly steeper learning curve than pure client React"],
      },
      {
        name: "React + Vite (SPA)",
        category: "frontend",
        recommended: false,
        reason: "Fast development build tool for pure single page applications.",
        pros: ["Lightning fast HMR", "Simple client-only architecture"],
        cons: ["Requires separate backend API deployment and lacks built-in SSR SEO"],
      },
    ],
    backendOptions: [
      {
        name: "Node.js / Hono / Express",
        category: "backend",
        recommended: true,
        reason: "Lightweight, ultra-fast TypeScript micro-framework compatible with edge and Node runtimes.",
        pros: ["Shared TypeScript types with frontend", "Great concurrency", "Extensive middleware"],
        cons: ["Single-threaded CPU bound tasks require worker threads or microservices"],
      },
      {
        name: "Go (Golang)",
        category: "backend",
        recommended: false,
        reason: "High concurrency compiled language suitable for ultra-high throughput.",
        pros: ["Very low memory footprint", "High concurrency with Goroutines"],
        cons: ["Different language stack from TypeScript frontend"],
      },
    ],
    databaseOptions: [
      {
        name: "Supabase PostgreSQL + pgvector",
        category: "database",
        recommended: true,
        reason: "Relational ACID consistency with built-in Auth, Row-Level Security, and 768-dim vector embeddings.",
        pros: ["All-in-one database, auth, and vectors", "PostgreSQL robustness", "Easy scaling"],
        cons: ["Connection pooling required for high concurrency serverless"],
      },
      {
        name: "Neon Serverless PostgreSQL",
        category: "database",
        recommended: false,
        reason: "Autoscaling serverless PostgreSQL branching database.",
        pros: ["Scale to zero", "Database branching for CI/CD"],
        cons: ["Requires separate auth and vector indexing management"],
      },
    ],
    aiOrchestration: [
      {
        name: "LangGraph.js + Gemini",
        category: "ai",
        recommended: true,
        reason: "Supports deterministic multi-agent state machines, cyclical graphs, and Zod validation.",
        pros: ["Native TypeScript state graph", "Cycle support", "High speed with Gemini"],
        cons: ["State schema discipline required"],
      },
    ],
    storageOptions: [
      {
        name: "Vercel Blob / Supabase Storage",
        category: "storage",
        recommended: true,
        reason: "Global edge CDN object storage with minimal config and signed URL security.",
        pros: ["Zero server maintenance", "Fast uploads", "Direct CDN streaming"],
        cons: ["Bandwidth pricing on massive files"],
      },
    ],
    recommendedStack: {
      frontend: "Next.js",
      backend: "Node.js & Next.js Server Actions",
      database: "Supabase PostgreSQL + pgvector",
      ai: "Gemini 3.8 Flash",
      orchestration: "LangGraph.js",
      storage: "Vercel Blob",
      deployment: "Vercel",
    },
    keyArchitecturalPatterns: [
      "Layered Microservices / Modular Monolith",
      "Event-driven decoupling with Pub/Sub",
      "Semantic RAG with Vector Embeddings",
    ],
    scalabilityApproach: "Stateless horizontally scalable compute nodes with Redis caching for high-frequency reads and CDN edge caching.",
    securityApproach: "Row-Level Security (RLS) policies, JWT session validation, TLS 1.3 transit encryption, and least-privilege IAM roles.",
  };

  AgentLogger.agentAction("Research Agent", "EVALUATING ARCHITECTURAL ALTERNATIVES", {
    idea: input.idea,
    hasRagContext: hasRag,
    userPreferences: input.userPreferences || "None",
  });

  const result = await GeminiService.generateStructuredJson<ResearchFindings>(
    prompt,
    "You are the Sketch Research Agent, an elite systems researcher evaluating technological alternatives.",
    fallback,
    "Research Agent"
  );

  const finalOutput = result || fallback;
  AgentLogger.agentAction("Research Agent", "RESEARCH SYNTHESIZED", {
    projectType: finalOutput.projectType,
    complexity: finalOutput.complexityAssessment,
    recommendedStack: finalOutput.recommendedStack,
    keyPatterns: finalOutput.keyArchitecturalPatterns,
  });

  return finalOutput;
}
