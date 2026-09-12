import { z } from "zod";


export const ComponentTypeSchema = z.enum([
  "frontend",
  "backend",
  "database",
  "cache",
  "queue",
  "api",
  "authentication",
  "storage",
  "ai",
  "agent",
  "external_service",
  "devops",
]);

export const GeneratedComponentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: ComponentTypeSchema,
  description: z.string(),
  technology: z.string(),
  responsibilities: z.array(z.string()).default([]),
});

export const GeneratedDependencySchema = z.object({
  source: z.string(),
  target: z.string(),
  type: z.string().default("sync"),
  description: z.string().default("Direct communication"),
});

export const ArchitectureOutputSchema = z.object({
  projectSummary: z.string(),
  architectureOverview: z.string(),
  components: z.array(GeneratedComponentSchema),
  dependencies: z.array(GeneratedDependencySchema),
  technologyStack: z.array(z.string()).default([]),
  securityRecommendations: z.array(z.string()).default([]),
  scalabilityRecommendations: z.array(z.string()).default([]),
});

export type GeneratedComponent = z.infer<typeof GeneratedComponentSchema>;
export type GeneratedDependency = z.infer<typeof GeneratedDependencySchema>;
export type ArchitectureOutput = z.infer<typeof ArchitectureOutputSchema>;

export interface NodeExecutionUpdate {
  nodeName: string;
  status: "idle" | "running" | "completed" | "failed";
  timestamp: string;
  message?: string;
  data?: unknown;
}
