import { createAdminClient } from "@/lib/supabase/admin";
import type { 
  ArchitectureRecord, 
  ArchitectureComponent, 
  ComponentDependency, 
  ArchitectureDecision, 
  ProjectVersion,
  ArchitectureGraphData,
  ComponentType
} from "@/types/database";
import type { ArchitectureOutput } from "@/types/architecture";

// Pre-seeded demo architecture for OmniStore Cloud Platform
const initialDemoNodes: ArchitectureGraphData["nodes"] = [
  {
    id: "comp-frontend",
    type: "customComponent",
    position: { x: 50, y: 120 },
    data: {
      label: "Next.js Web Storefront",
      componentType: "frontend",
      technology: "Next.js / React & Tailwind",
      description: "Responsive storefront, catalog browsing, shopping cart UI",
      responsibilities: ["SSR pages", "Client state", "Edge caching"],
      status: "active",
    },
  },
  {
    id: "comp-api-gw",
    type: "customComponent",
    position: { x: 340, y: 120 },
    data: {
      label: "API Gateway & Ingress",
      componentType: "api",
      technology: "Kong / Edge Router",
      description: "Reverse proxy, rate limiting, and SSL termination",
      responsibilities: ["Rate limiting", "Path routing", "JWT pass-through"],
      status: "active",
    },
  },
  {
    id: "comp-auth",
    type: "customComponent",
    position: { x: 340, y: 280 },
    data: {
      label: "Supabase Auth Provider",
      componentType: "authentication",
      technology: "Supabase Auth / JWT / OAuth2",
      description: "User authentication, sessions, and RBAC token issuance",
      responsibilities: ["User login", "Session tokens", "RLS verification"],
      status: "active",
    },
  },
  {
    id: "comp-backend",
    type: "customComponent",
    position: { x: 620, y: 60 },
    data: {
      label: "Core Order & Catalog Engine",
      componentType: "backend",
      technology: "Node.js / Express / TypeScript",
      description: "Primary commerce domain operations and transaction coordinator",
      responsibilities: ["Order lifecycle", "Price calculations", "Event dispatch"],
      status: "active",
    },
  },
  {
    id: "comp-ai-agent",
    type: "customComponent",
    position: { x: 620, y: 220 },
    data: {
      label: "AI Recommendation & RAG Agent",
      componentType: "ai",
      technology: "LangGraph.js & Gemini 1.5",
      description: "Autonomous personalized product recommendations and search RAG",
      responsibilities: ["Vector similarity search", "Semantic re-ranking"],
      status: "active",
    },
  },
  {
    id: "comp-db",
    type: "customComponent",
    position: { x: 920, y: 60 },
    data: {
      label: "Primary PostgreSQL + pgvector",
      componentType: "database",
      technology: "Supabase PostgreSQL (ACID)",
      description: "Transactional relational store with 768-dim vector embeddings",
      responsibilities: ["Catalog & Order records", "pgvector embeddings", "RLS"],
      status: "active",
    },
  },
  {
    id: "comp-cache",
    type: "customComponent",
    position: { x: 920, y: 200 },
    data: {
      label: "Redis Distributed Cache",
      componentType: "cache",
      technology: "Redis Cluster (in-memory)",
      description: "Sub-millisecond catalog caching and session lock manager",
      responsibilities: ["Hot query caching", "Rate limiting counters"],
      status: "active",
    },
  },
  {
    id: "comp-queue",
    type: "customComponent",
    position: { x: 920, y: 340 },
    data: {
      label: "Apache Kafka Message Bus",
      componentType: "queue",
      technology: "Apache Kafka Pub/Sub",
      description: "Decoupled asynchronous event stream for payments and notifications",
      responsibilities: ["OrderCreated events", "Dead-letter queues"],
      status: "active",
    },
  },
];

const initialDemoEdges: ArchitectureGraphData["edges"] = [
  { id: "e1", source: "comp-frontend", target: "comp-api-gw", label: "HTTPS / GraphQL", style: { stroke: "#38bdf8", strokeWidth: 2 } },
  { id: "e2", source: "comp-api-gw", target: "comp-auth", label: "verify JWT", style: { stroke: "#f43f5e", strokeWidth: 2 } },
  { id: "e3", source: "comp-api-gw", target: "comp-backend", label: "routed RPC", style: { stroke: "#38bdf8", strokeWidth: 2 } },
  { id: "e4", source: "comp-backend", target: "comp-db", label: "SQL transactions", style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e5", source: "comp-backend", target: "comp-cache", label: "cache get/set", style: { stroke: "#f59e0b", strokeWidth: 2 } },
  { id: "e6", source: "comp-backend", target: "comp-queue", label: "produce events", animated: true, style: { stroke: "#f97316", strokeWidth: 2 } },
  { id: "e7", source: "comp-backend", target: "comp-ai-agent", label: "recommendations", style: { stroke: "#a855f7", strokeWidth: 2 } },
  { id: "e8", source: "comp-ai-agent", target: "comp-db", label: "vector similarity", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
];

const demoArchitectures: Record<string, {
  architecture: ArchitectureRecord;
  components: ArchitectureComponent[];
  dependencies: ComponentDependency[];
  decisions: ArchitectureDecision[];
  versions: ProjectVersion[];
}> = {
  "demo-project-e-commerce": {
    architecture: {
      id: "arch-demo-e-commerce",
      project_id: "demo-project-e-commerce",
      name: "OmniStore Distributed Cloud Architecture",
      description: "High-throughput microservices architecture with pgvector semantic search and event-driven decoupling.",
      architecture_type: "microservices",
      graph_data: { nodes: initialDemoNodes, edges: initialDemoEdges },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    components: initialDemoNodes.map((n) => ({
      id: n.id,
      architecture_id: "arch-demo-e-commerce",
      project_id: "demo-project-e-commerce",
      name: n.data.label,
      component_type: n.data.componentType,
      description: n.data.description || null,
      technology: n.data.technology || null,
      configuration: { responsibilities: n.data.responsibilities },
      position_x: n.position.x,
      position_y: n.position.y,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })),
    dependencies: initialDemoEdges.map((e, idx) => ({
      id: `dep-${idx}`,
      project_id: "demo-project-e-commerce",
      source_component_id: e.source,
      target_component_id: e.target,
      dependency_type: "sync",
      description: e.label || "Communication",
      created_at: new Date().toISOString(),
    })),
    decisions: [
      {
        id: "adr-1",
        project_id: "demo-project-e-commerce",
        title: "Adopt pgvector for Product Catalog Semantic Search",
        description: "Enables embedding-based vector similarity search directly inside PostgreSQL without running external vector databases.",
        decision: "Use Supabase PostgreSQL pgvector extension with 768-dimensional text-embedding-004 vectors.",
        reasoning: "Eliminates distributed state synchronization between primary database and vector index.",
        alternatives: ["Pinecone", "Milvus"],
        status: "accepted",
        created_at: new Date().toISOString(),
      },
    ],
    versions: [
      {
        id: "ver-1",
        project_id: "demo-project-e-commerce",
        version_number: 1,
        description: "Baseline Microservices & RAG Architecture Release",
        architecture_snapshot: {
          architecture: {
            id: "arch-demo-e-commerce",
            project_id: "demo-project-e-commerce",
            name: "OmniStore Distributed Cloud Architecture",
            description: "High-throughput microservices architecture with pgvector semantic search and event-driven decoupling.",
            architecture_type: "microservices",
            graph_data: { nodes: initialDemoNodes, edges: initialDemoEdges },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          components: [],
          dependencies: [],
          timestamp: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
      },
    ],
  },
};

export class ArchitectureService {
  private static isConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return !!url && !url.includes("placeholder") && !url.includes("your-project");
  }

  static buildGraphData(output: ArchitectureOutput): ArchitectureGraphData {
    const nodes: ArchitectureGraphData["nodes"] = [];
    const edges: ArchitectureGraphData["edges"] = [];

    const tierOrder: Record<string, number> = {
      frontend: 0,
      api: 1,
      authentication: 1,
      backend: 2,
      ai: 2,
      agent: 2,
      database: 3,
      cache: 3,
      queue: 3,
      storage: 3,
      devops: 4,
      external_service: 4,
    };

    const tierCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };

    output.components.forEach((comp) => {
      const tier = tierOrder[comp.type] ?? 2;
      const indexInTier = tierCounts[tier] || 0;
      tierCounts[tier] = indexInTier + 1;

      const x = 50 + tier * 280;
      const y = 80 + indexInTier * 140;

      nodes.push({
        id: comp.id,
        type: "customComponent",
        position: { x, y },
        data: {
          label: comp.name,
          componentType: comp.type as ComponentType,
          technology: comp.technology,
          description: comp.description,
          responsibilities: comp.responsibilities || [],
          status: "active",
        },
      });
    });

    output.dependencies.forEach((dep, idx) => {
      edges.push({
        id: `edge-${dep.source}-${dep.target}-${idx}`,
        source: dep.source,
        target: dep.target,
        label: dep.description || dep.type,
        type: "smoothstep",
        animated: dep.type === "async" || dep.type === "data_stream",
        style: {
          stroke: dep.type === "auth" ? "#f43f5e" : dep.type === "async" ? "#f59e0b" : "#38bdf8",
          strokeWidth: 2,
        },
      });
    });

    return { nodes, edges };
  }

  static async saveGeneratedArchitecture(
    projectId: string,
    output: ArchitectureOutput
  ): Promise<{
    architecture: ArchitectureRecord;
    components: ArchitectureComponent[];
    dependencies: ComponentDependency[];
  }> {
    const graphData = this.buildGraphData(output);

    if (!this.isConfigured() || projectId.startsWith("demo-")) {
      const archId = `arch-${projectId}`;
      const archRecord: ArchitectureRecord = {
        id: archId,
        project_id: projectId,
        name: `${output.projectSummary.substring(0, 30)} Architecture`,
        description: output.architectureOverview,
        architecture_type: "cloud_native",
        graph_data: graphData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const components: ArchitectureComponent[] = output.components.map((c, i) => ({
        id: c.id,
        architecture_id: archId,
        project_id: projectId,
        name: c.name,
        component_type: c.type as ComponentType,
        description: c.description,
        technology: c.technology,
        configuration: { responsibilities: c.responsibilities },
        position_x: graphData.nodes[i]?.position.x || 0,
        position_y: graphData.nodes[i]?.position.y || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const dependencies: ComponentDependency[] = output.dependencies.map((d, idx) => ({
        id: `dep-${idx}`,
        project_id: projectId,
        source_component_id: d.source,
        target_component_id: d.target,
        dependency_type: d.type,
        description: d.description,
        created_at: new Date().toISOString(),
      }));

      const version: ProjectVersion = {
        id: `ver-${Date.now()}`,
        project_id: projectId,
        version_number: (demoArchitectures[projectId]?.versions?.length || 0) + 1,
        description: "AI Generated Architecture via LangGraph.js",
        architecture_snapshot: {
          architecture: archRecord,
          components,
          dependencies,
          timestamp: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
      };

      demoArchitectures[projectId] = {
        architecture: archRecord,
        components,
        dependencies,
        decisions: demoArchitectures[projectId]?.decisions || [],
        versions: [version, ...(demoArchitectures[projectId]?.versions || [])],
      };

      return { architecture: archRecord, components, dependencies };
    }

    const supabase = createAdminClient();

    const { data: existingArch } = await supabase
      .from("architectures")
      .select("id")
      .eq("project_id", projectId)
      .maybeSingle();

    let architectureRecord: ArchitectureRecord;

    if (existingArch) {
      const { data, error } = await supabase
        .from("architectures")
        .update({
          name: "Main System Architecture",
          description: output.architectureOverview,
          graph_data: graphData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingArch.id)
        .select()
        .single();
      if (error) throw error;
      architectureRecord = data as ArchitectureRecord;
    } else {
      const { data, error } = await supabase
        .from("architectures")
        .insert({
          project_id: projectId,
          name: "Main System Architecture",
          description: output.architectureOverview,
          architecture_type: "cloud_native",
          graph_data: graphData,
        })
        .select()
        .single();
      if (error) throw error;
      architectureRecord = data as ArchitectureRecord;
    }

    await supabase.from("component_dependencies").delete().eq("project_id", projectId);
    await supabase.from("architecture_components").delete().eq("project_id", projectId);

    const componentInserts = output.components.map((c, i) => ({
      id: c.id,
      architecture_id: architectureRecord.id,
      project_id: projectId,
      name: c.name,
      component_type: c.type,
      description: c.description,
      technology: c.technology,
      configuration: { responsibilities: c.responsibilities },
      position_x: graphData.nodes[i]?.position.x || 0,
      position_y: graphData.nodes[i]?.position.y || 0,
    }));

    const { data: componentsData, error: compErr } = await supabase
      .from("architecture_components")
      .insert(componentInserts)
      .select();

    if (compErr) throw compErr;

    const dependencyInserts = output.dependencies.map((d) => ({
      project_id: projectId,
      source_component_id: d.source,
      target_component_id: d.target,
      dependency_type: d.type,
      description: d.description,
    }));

    const { data: depsData, error: depErr } = await supabase
      .from("component_dependencies")
      .insert(dependencyInserts)
      .select();

    if (depErr) throw depErr;

    const components = (componentsData as ArchitectureComponent[]) || [];
    const dependencies = (depsData as ComponentDependency[]) || [];

    const { data: latestVer } = await supabase
      .from("project_versions")
      .select("version_number")
      .eq("project_id", projectId)
      .order("version_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextVer = (latestVer?.version_number || 0) + 1;

    await supabase.from("project_versions").insert({
      project_id: projectId,
      version_number: nextVer,
      description: `AI Architecture Generation V${nextVer}`,
      architecture_snapshot: {
        architecture: architectureRecord,
        components,
        dependencies,
        timestamp: new Date().toISOString(),
      },
    });

    return {
      architecture: architectureRecord,
      components,
      dependencies,
    };
  }

  static async getArchitecture(projectId: string): Promise<{
    architecture: ArchitectureRecord | null;
    components: ArchitectureComponent[];
    dependencies: ComponentDependency[];
  }> {
    if (!this.isConfigured() || projectId.startsWith("demo-")) {
      const item = demoArchitectures[projectId] || demoArchitectures["demo-project-e-commerce"];
      if (item) {
        return {
          architecture: item.architecture,
          components: item.components,
          dependencies: item.dependencies,
        };
      }
      return { architecture: null, components: [], dependencies: [] };
    }

    try {
      const supabase = createAdminClient();
      const { data: architecture } = await supabase
        .from("architectures")
        .select("*")
        .eq("project_id", projectId)
        .maybeSingle();

      const { data: components } = await supabase
        .from("architecture_components")
        .select("*")
        .eq("project_id", projectId);

      const { data: dependencies } = await supabase
        .from("component_dependencies")
        .select("*")
        .eq("project_id", projectId);

      return {
        architecture: (architecture as ArchitectureRecord) || null,
        components: (components as ArchitectureComponent[]) || [],
        dependencies: (dependencies as ComponentDependency[]) || [],
      };
    } catch (err) {
      console.warn("Falling back to demo architecture:", err);
      const item = demoArchitectures[projectId] || demoArchitectures["demo-project-e-commerce"];
      return {
        architecture: item?.architecture || null,
        components: item?.components || [],
        dependencies: item?.dependencies || [],
      };
    }
  }

  static async updateGraphData(
    projectId: string,
    graphData: ArchitectureGraphData
  ): Promise<boolean> {
    if (!this.isConfigured() || projectId.startsWith("demo-")) {
      const item = demoArchitectures[projectId] || demoArchitectures["demo-project-e-commerce"];
      if (item) {
        item.architecture.graph_data = graphData;
        item.architecture.updated_at = new Date().toISOString();
      }
      return true;
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("architectures")
      .update({
        graph_data: graphData,
        updated_at: new Date().toISOString(),
      })
      .eq("project_id", projectId);

    return !error;
  }

  static async getVersions(projectId: string): Promise<ProjectVersion[]> {
    if (!this.isConfigured() || projectId.startsWith("demo-")) {
      const item = demoArchitectures[projectId] || demoArchitectures["demo-project-e-commerce"];
      return item?.versions || [];
    }

    const supabase = createAdminClient();
    const { data } = await supabase
      .from("project_versions")
      .select("*")
      .eq("project_id", projectId)
      .order("version_number", { ascending: false });

    return (data as ProjectVersion[]) || [];
  }

  static async createVersion(
    projectId: string,
    description: string
  ): Promise<ProjectVersion | null> {
    const current = await this.getArchitecture(projectId);
    if (!current.architecture) return null;

    const versions = await this.getVersions(projectId);
    const nextVer = (versions[0]?.version_number || 0) + 1;

    const snapshot = {
      architecture: current.architecture,
      components: current.components,
      dependencies: current.dependencies,
      timestamp: new Date().toISOString(),
    };

    if (!this.isConfigured() || projectId.startsWith("demo-")) {
      const newV: ProjectVersion = {
        id: `ver-${nextVer}`,
        project_id: projectId,
        version_number: nextVer,
        description,
        architecture_snapshot: snapshot,
        created_at: new Date().toISOString(),
      };
      if (!demoArchitectures[projectId]) {
        demoArchitectures[projectId] = { ...demoArchitectures["demo-project-e-commerce"] };
      }
      demoArchitectures[projectId].versions.unshift(newV);
      return newV;
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("project_versions")
      .insert({
        project_id: projectId,
        version_number: nextVer,
        description,
        architecture_snapshot: snapshot,
      })
      .select()
      .single();

    if (error) return null;
    return data as ProjectVersion;
  }

  static async restoreVersion(
    projectId: string,
    versionId: string
  ): Promise<boolean> {
    const versions = await this.getVersions(projectId);
    const target = versions.find((v) => v.id === versionId);
    if (!target) return false;

    const snapshot = target.architecture_snapshot;
    if (!snapshot || !snapshot.architecture) return false;

    if (!this.isConfigured() || projectId.startsWith("demo-")) {
      if (demoArchitectures[projectId]) {
        demoArchitectures[projectId].architecture = snapshot.architecture as ArchitectureRecord;
        demoArchitectures[projectId].components = snapshot.components || [];
        demoArchitectures[projectId].dependencies = snapshot.dependencies || [];
      }
      return true;
    }

    const supabase = createAdminClient();
    if (snapshot.architecture.graph_data) {
      await supabase
        .from("architectures")
        .update({
          graph_data: snapshot.architecture.graph_data,
          updated_at: new Date().toISOString(),
        })
        .eq("project_id", projectId);
    }

    await supabase.from("component_dependencies").delete().eq("project_id", projectId);
    await supabase.from("architecture_components").delete().eq("project_id", projectId);

    if (snapshot.components && snapshot.components.length > 0) {
      await supabase.from("architecture_components").insert(snapshot.components);
    }
    if (snapshot.dependencies && snapshot.dependencies.length > 0) {
      await supabase.from("component_dependencies").insert(snapshot.dependencies);
    }

    return true;
  }
}