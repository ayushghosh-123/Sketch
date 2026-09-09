import { createAdminClient } from "@/lib/supabase/admin";
import { GeminiService } from "@/lib/gemini/model";
import type { 
  ImpactAnalysisRecord, 
  ArchitectureComponent, 
  ComponentDependency 
} from "@/types/database";

export interface ImpactAnalysisResult {
  changedComponentId: string;
  changedComponentName: string;
  directAffectedIds: string[];
  indirectAffectedIds: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
  summary: string;
  affectedComponents: Array<{
    id: string;
    name: string;
    type: "direct" | "indirect";
    impactDescription: string;
  }>;
  recommendations: string[];
}

export class ImpactAnalysisService {
  private static isConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return !!url && !url.includes("placeholder") && !url.includes("your-project");
  }

  /**
   * Run Breadth-First Search (BFS) on the directed dependency graph to detect directly
   * and indirectly impacted components when a node is modified.
   */
  static runGraphBFS({
    changedId,
    components,
    dependencies,
  }: {
    changedId: string;
    components: ArchitectureComponent[];
    dependencies: ComponentDependency[];
  }): { direct: string[]; indirect: string[] } {
    // Build reverse adjacency list: target -> array of sources that depend on target
    // e.g. If Backend -> Database, when Database changes, Backend is affected.
    // Also include forward adjacency list if caller changes contract.
    const callersMap = new Map<string, string[]>();
    const downstreamMap = new Map<string, string[]>();

    components.forEach((c) => {
      callersMap.set(c.id, []);
      downstreamMap.set(c.id, []);
    });

    dependencies.forEach((d) => {
      // Caller depends on target
      const callers = callersMap.get(d.target_component_id) || [];
      callers.push(d.source_component_id);
      callersMap.set(d.target_component_id, callers);

      // Downstream
      const downstream = downstreamMap.get(d.source_component_id) || [];
      downstream.push(d.target_component_id);
      downstreamMap.set(d.source_component_id, downstream);
    });

    const direct = new Set<string>();
    const indirect = new Set<string>();
    const visited = new Set<string>([changedId]);

    // Queue of { id, distance }
    const queue: Array<{ id: string; distance: number }> = [];

    // Enqueue immediate callers (who call the changed component)
    const immediateCallers = callersMap.get(changedId) || [];
    immediateCallers.forEach((callerId) => {
      if (!visited.has(callerId)) {
        visited.add(callerId);
        direct.add(callerId);
        queue.push({ id: callerId, distance: 1 });
      }
    });

    // BFS Traversal
    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentCallers = callersMap.get(current.id) || [];

      for (const nextCaller of currentCallers) {
        if (!visited.has(nextCaller)) {
          visited.add(nextCaller);
          indirect.add(nextCaller);
          queue.push({ id: nextCaller, distance: current.distance + 1 });
        }
      }
    }

    return {
      direct: Array.from(direct),
      indirect: Array.from(indirect),
    };
  }

  /**
   * Orchestrates full impact analysis: BFS graph traversal + Gemini risk assessment
   */
  static async analyzeImpact({
    projectId,
    changedComponentId,
    changeDescription,
    components,
    dependencies,
  }: {
    projectId: string;
    changedComponentId: string;
    changeDescription?: string;
    components: ArchitectureComponent[];
    dependencies: ComponentDependency[];
  }): Promise<ImpactAnalysisResult> {
    const changedComp = components.find((c) => c.id === changedComponentId);
    const changedName = changedComp?.name || "Target Component";

    // 1. Run BFS Graph Traversal
    const { direct, indirect } = this.runGraphBFS({
      changedId: changedComponentId,
      components,
      dependencies,
    });

    // 2. Map affected components with details
    const affectedList = [
      ...direct.map((id) => {
        const c = components.find((comp) => comp.id === id);
        return {
          id,
          name: c?.name || id,
          type: "direct" as const,
          impactDescription: `Direct caller of ${changedName}. Breaking schema changes or latency spikes will immediately disrupt this service.`,
        };
      }),
      ...indirect.map((id) => {
        const c = components.find((comp) => comp.id === id);
        return {
          id,
          name: c?.name || id,
          type: "indirect" as const,
          impactDescription: `Downstream cascade recipient. Propagates failures or requires updated client contracts.`,
        };
      }),
    ];

    // Determine default risk based on blast radius
    const totalAffected = direct.length + indirect.length;
    let fallbackRisk: "low" | "medium" | "high" | "critical" = "medium";
    if (totalAffected >= 4 || changedComp?.component_type === "database" || changedComp?.component_type === "authentication") {
      fallbackRisk = "high";
    } else if (totalAffected === 0) {
      fallbackRisk = "low";
    }

    const fallbackResult: ImpactAnalysisResult = {
      changedComponentId,
      changedComponentName: changedName,
      directAffectedIds: direct,
      indirectAffectedIds: indirect,
      riskLevel: fallbackRisk,
      summary: `Modifying ${changedName} (${changedComp?.technology || "service"}) affects ${direct.length} direct dependencies and ${indirect.length} cascaded downstream consumers.`,
      affectedComponents: affectedList,
      recommendations: [
        `Implement semantic versioning (v1 -> v2) on ${changedName} interfaces.`,
        `Maintain backward compatibility contracts during rollout window.`,
        `Deploy dual-write or blue/green canary deployments to verify dependent service health.`,
        `Run contract regression testing on: ${affectedList.map((a) => a.name).join(", ") || "all dependent services"}.`,
      ],
    };

    // 3. Ask Gemini for nuanced architectural risk analysis
    const prompt = `
Architecture Component Modification Impact Analysis:
Changed Component: ${changedName} (Type: ${changedComp?.component_type}, Tech: ${changedComp?.technology})
Change Context: ${changeDescription || "Replacing or modifying core interface/technology"}
Directly Affected Services: ${direct.map((id) => components.find((c) => c.id === id)?.name).join(", ") || "None"}
Indirectly Affected Services: ${indirect.map((id) => components.find((c) => c.id === id)?.name).join(", ") || "None"}

Evaluate failure scenarios, blast radius, risk level ('low', 'medium', 'high', 'critical'), and 4 concrete migration recommendations.
`;

    const aiResult = await GeminiService.generateStructuredJson<{
      riskLevel: "low" | "medium" | "high" | "critical";
      summary: string;
      recommendations: string[];
    }>(
      prompt,
      "You are a Principal Software Architect and Site Reliability Engineer performing change blast radius analysis.",
      {
        riskLevel: fallbackRisk,
        summary: fallbackResult.summary,
        recommendations: fallbackResult.recommendations,
      }
    );

    const finalResult: ImpactAnalysisResult = {
      ...fallbackResult,
      riskLevel: aiResult?.riskLevel || fallbackRisk,
      summary: aiResult?.summary || fallbackResult.summary,
      recommendations: aiResult?.recommendations || fallbackResult.recommendations,
    };

    // 4. Save to Database if configured
    if (this.isConfigured() && !projectId.startsWith("demo-")) {
      try {
        const supabase = createAdminClient();
        await supabase.from("impact_analysis").insert({
          project_id: projectId,
          changed_component_id: changedComponentId,
          affected_components: { direct, indirect },
          analysis_result: {
            summary: finalResult.summary,
            riskLevel: finalResult.riskLevel,
            affectedComponents: finalResult.affectedComponents,
            recommendations: finalResult.recommendations,
          },
        });
      } catch (saveErr) {
        console.warn("Failed to persist impact analysis record:", saveErr);
      }
    }

    return finalResult;
  }
}
