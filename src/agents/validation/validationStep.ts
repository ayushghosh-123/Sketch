import type { ArchitectureSpecification, ValidationResult } from "../types";
import { AgentLogger } from "@/lib/logger/agentLogger";

export function runValidationStep(
  spec: ArchitectureSpecification
): ValidationResult {
  const missingComponents: string[] = [];
  const invalidCombinations: string[] = [];
  const brokenRelationships: string[] = [];
  const securityConcerns: string[] = [];
  const scalabilityConcerns: string[] = [];

  const compIds = new Set(spec.components.map((c) => c.id));
  const compTypes = new Set(spec.components.map((c) => c.category));

  // 1. Check required architectural tiers
  if (!compTypes.has("frontend") && !spec.components.some((c) => c.name.toLowerCase().includes("client") || c.name.toLowerCase().includes("web"))) {
    missingComponents.push("Missing user-facing client or frontend layer");
  }

  if (!compTypes.has("database") && !compTypes.has("storage")) {
    missingComponents.push("Missing persistent database or data storage layer");
  }

  if (!compTypes.has("authentication") && !spec.components.some((c) => c.name.toLowerCase().includes("auth"))) {
    securityConcerns.push("No dedicated authentication service or identity provider detected");
  }

  // 2. Check broken relationships / orphan connections
  spec.connections.forEach((conn) => {
    if (!compIds.has(conn.source)) {
      brokenRelationships.push(`Connection source '${conn.source}' does not exist in components`);
    }
    if (!compIds.has(conn.target)) {
      brokenRelationships.push(`Connection target '${conn.target}' does not exist in components`);
    }
  });

  // 3. Check scalability concerns
  const hasCache = compTypes.has("cache") || spec.components.some((c) => c.name.toLowerCase().includes("cache") || c.name.toLowerCase().includes("redis"));
  if (!hasCache && spec.components.length > 6) {
    scalabilityConcerns.push("High complexity system without an in-memory caching layer (consider Redis)");
  }

  // Compute score
  let score = 100;
  score -= missingComponents.length * 20;
  score -= brokenRelationships.length * 15;
  score -= invalidCombinations.length * 15;
  score -= securityConcerns.length * 10;
  score -= scalabilityConcerns.length * 5;
  score = Math.max(0, Math.min(100, score));

  const isValid = missingComponents.length === 0 && brokenRelationships.length === 0 && invalidCombinations.length === 0;

  let feedback = "";
  if (!isValid) {
    feedback = `Please fix: ${[...missingComponents, ...brokenRelationships, ...invalidCombinations].join("; ")}.`;
  }

  const result: ValidationResult = {
    isValid,
    score,
    missingComponents,
    invalidCombinations,
    brokenRelationships,
    securityConcerns,
    scalabilityConcerns,
    feedbackForDecisionAgent: feedback || undefined,
  };

  AgentLogger.agentAction("Validation Step", "VALIDATION RESULTS COMPUTED", {
    isValid,
    score: `${score}/100`,
    missingComponentsCount: missingComponents.length,
    brokenRelationshipsCount: brokenRelationships.length,
    securityConcernsCount: securityConcerns.length,
    scalabilityConcernsCount: scalabilityConcerns.length,
    feedback: feedback || "None (Architecture structurally sound)",
  });

  return result;
}
