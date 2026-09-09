import type { ProjectStateType } from "../state";
import { GeminiService } from "@/lib/gemini/model";
import { RagService } from "@/services/ragService";
import type { GeneratedComponent } from "@/types/architecture";

export async function architectureDesignerNode(state: ProjectStateType): Promise<Partial<ProjectStateType>> {
  const ragContext = RagService.formatChunksForPrompt(state.retrievedDocuments || []);

  const prompt = `
You are a Principal Enterprise Systems Architect.
Design a software architecture for the following project:

Project: ${state.userInput.name}
Description: ${state.userInput.description || "N/A"}
Type: ${state.userInput.projectType || "microservices"}
Target Users: ${state.projectRequirements?.target_users || "General users"}
Functional Requirements: ${state.projectRequirements?.functional_requirements || "Core CRUD & API services"}
Preferred Technologies: ${state.technologyRecommendations?.join(", ") || "Next.js, Node.js, PostgreSQL, Redis"}
Security: ${state.securityRecommendations?.join("; ")}

RAG Documentation Context:
${ragContext}

Generate 6 to 9 distinct architectural components across appropriate tiers.
Component types MUST be one of: 'frontend' | 'backend' | 'database' | 'cache' | 'queue' | 'api' | 'authentication' | 'storage' | 'ai' | 'agent' | 'external_service' | 'devops'.
Return JSON with key "components": array of objects with { id, name, type, description, technology, responsibilities }.
`;

  const fallbackComponents: GeneratedComponent[] = [
    {
      id: "comp-frontend",
      name: "Web Application UI",
      type: "frontend",
      description: "Interactive responsive user interface and client dashboard",
      technology: "Next.js / React & Tailwind CSS",
      responsibilities: ["Client-side rendering", "State management", "API communication"],
    },
    {
      id: "comp-api-gateway",
      name: "API Gateway & Router",
      type: "api",
      description: "Reverse proxy, rate limiting, routing, and SSL termination",
      technology: "Kong / Traefik / Next.js Edge",
      responsibilities: ["Request routing", "Token verification", "Rate limiting"],
    },
    {
      id: "comp-auth-service",
      name: "Authentication & Identity",
      type: "authentication",
      description: "Session management, OAuth2 integration, and role-based policies",
      technology: "Supabase Auth / JWT",
      responsibilities: ["User sign-up/login", "Token issuance", "Permission validation"],
    },
    {
      id: "comp-core-backend",
      name: "Core Business Engine",
      type: "backend",
      description: "Primary business logic, transactional workflows, and domain services",
      technology: "Node.js / Express / TypeScript",
      responsibilities: ["Data processing", "Domain business logic", "Event dispatching"],
    },
    {
      id: "comp-ai-agent",
      name: "AI Orchestrator & RAG Engine",
      type: "ai",
      description: "Autonomous agent execution, semantic vector search, and Gemini integration",
      technology: "LangGraph.js & Google Gemini",
      responsibilities: ["Context retrieval", "Prompt orchestration", "Structured generation"],
    },
    {
      id: "comp-primary-db",
      name: "Primary Relational Database",
      type: "database",
      description: "ACID transactional database with Row-Level Security and pgvector extension",
      technology: "Supabase PostgreSQL + pgvector",
      responsibilities: ["Data persistence", "Vector embeddings", "Relational integrity"],
    },
    {
      id: "comp-cache",
      name: "In-Memory Cache & Session Store",
      type: "cache",
      description: "High-speed caching for hot queries and distributed locks",
      technology: "Redis Cluster",
      responsibilities: ["Query result caching", "Rate limit counters", "Session state"],
    },
    {
      id: "comp-event-queue",
      name: "Asynchronous Message Broker",
      type: "queue",
      description: "Reliable event streaming and decoupled inter-service communications",
      technology: "Apache Kafka / RabbitMQ",
      responsibilities: ["Event streaming", "Task queueing", "Dead letter processing"],
    },
    {
      id: "comp-devops",
      name: "Observability & CI/CD",
      type: "devops",
      description: "Centralized logging, Prometheus metrics, and automated container deployments",
      technology: "Docker, Prometheus & Grafana",
      responsibilities: ["Telemetry metrics", "Health checks", "Distributed tracing"],
    },
  ];

  const result = await GeminiService.generateStructuredJson<{ components: GeneratedComponent[] }>(
    prompt,
    "You are a Senior System Architect generating structured component topologies.",
    { components: fallbackComponents }
  );

  const components = (result && result.components && result.components.length > 0)
    ? result.components
    : fallbackComponents;

  return {
    components,
    analysisStatus: "components_designed",
  };
}
