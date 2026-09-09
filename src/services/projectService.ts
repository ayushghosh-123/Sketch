import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Project, ProjectRequirements } from "@/types/database";

export const DEFAULT_USER_ID = "647a2b86-e29e-443e-bc69-520f2110fabf";

export interface CreateProjectInput {
  name: string;
  description?: string;
  project_type?: string;
  target_users?: string;
  functional_requirements?: string;
  non_functional_requirements?: string;
  preferred_technologies?: string;
  scalability_requirements?: string;
  security_requirements?: string;
  user_id?: string;
}

export function toValidUuid(id?: string): string {
  if (!id) return DEFAULT_USER_ID;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) return id;
  return DEFAULT_USER_ID;
}

// In-memory demo store for when database connection is not yet configured
const demoProjects: (Project & { requirements?: ProjectRequirements })[] = [
  {
    id: "demo-project-e-commerce",
    user_id: DEFAULT_USER_ID,
    name: "OmniStore Cloud Platform",
    description: "High-throughput distributed e-commerce marketplace with AI personalized search and real-time inventory tracking.",
    project_type: "microservices",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    requirements: {
      id: "req-demo-1",
      project_id: "demo-project-e-commerce",
      target_users: "Global shoppers, merchants, platform administrators",
      functional_requirements: "Product catalog, shopping cart, checkout & payment processing, inventory reservation, AI recommendations",
      non_functional_requirements: "99.99% availability, <100ms API response time, PCI-DSS compliance",
      preferred_technologies: "Next.js, Node.js/Go, PostgreSQL, Redis, Apache Kafka, Stripe API",
      scalability_requirements: "Auto-scaling up to 50,000 requests per second during flash sales",
      security_requirements: "OAuth2 / JWT tokens, TLS 1.3, encrypted database fields, rate limiting",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }
];

export class ProjectService {
  private static isConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return !!url && !url.includes("placeholder") && !url.includes("your-project");
  }

  static async getProjects(userId?: string): Promise<Project[]> {
    if (!this.isConfigured()) {
      return demoProjects;
    }

    try {
      const supabase = createAdminClient();
      let query = supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (userId && userId !== "demo-user") {
        const validUuid = toValidUuid(userId);
        query = query.eq("user_id", validUuid);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data as Project[]) || [];
    } catch (err) {
      console.warn("Database fallback to demo projects:", err);
      return demoProjects;
    }
  }

  static async getProjectById(projectId: string): Promise<{ project: Project; requirements: ProjectRequirements | null } | null> {
    if (!this.isConfigured() || projectId.startsWith("demo-")) {
      const p = demoProjects.find((x) => x.id === projectId) || demoProjects[0];
      return {
        project: p,
        requirements: p.requirements || null,
      };
    }

    try {
      const supabase = createAdminClient();
      const { data: project, error: pError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (pError || !project) return null;

      const { data: requirements } = await supabase
        .from("project_requirements")
        .select("*")
        .eq("project_id", projectId)
        .maybeSingle();

      return {
        project: project as Project,
        requirements: (requirements as ProjectRequirements) || null,
      };
    } catch (err) {
      console.warn("Project get fallback:", err);
      const p = demoProjects.find((x) => x.id === projectId) || demoProjects[0];
      return { project: p, requirements: p.requirements || null };
    }
  }

  static async createProject(input: CreateProjectInput, rawUserId?: string): Promise<Project> {
    const validUserId = toValidUuid(rawUserId);

    if (!this.isConfigured()) {
      const newId = `demo-${Date.now()}`;
      const newProject: Project = {
        id: newId,
        user_id: validUserId,
        name: input.name,
        description: input.description || null,
        project_type: input.project_type || "microservices",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const newReq: ProjectRequirements = {
        id: `req-${Date.now()}`,
        project_id: newId,
        target_users: input.target_users || null,
        functional_requirements: input.functional_requirements || null,
        non_functional_requirements: input.non_functional_requirements || null,
        preferred_technologies: input.preferred_technologies || null,
        scalability_requirements: input.scalability_requirements || null,
        security_requirements: input.security_requirements || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      demoProjects.unshift({ ...newProject, requirements: newReq });
      return newProject;
    }

    const supabase = createAdminClient();

    // 1. Ensure profile exists in profiles table
    try {
      await supabase.from("profiles").upsert(
        {
          id: validUserId,
          email: "architect@agentarchitect.dev",
          full_name: "Agent Architect",
          avatar_url: "",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    } catch (profErr) {
      console.warn("Profile upsert notice:", profErr);
    }

    // 2. Insert into projects
    const { data: project, error: pError } = await supabase
      .from("projects")
      .insert({
        user_id: validUserId,
        name: input.name,
        description: input.description || null,
        project_type: input.project_type || "microservices",
        status: "active",
      })
      .select()
      .single();

    if (pError || !project) {
      throw new Error(`Failed to create project: ${pError?.message}`);
    }

    // 3. Insert into project_requirements
    const { error: reqError } = await supabase
      .from("project_requirements")
      .insert({
        project_id: project.id,
        target_users: input.target_users || null,
        functional_requirements: input.functional_requirements || null,
        non_functional_requirements: input.non_functional_requirements || null,
        preferred_technologies: input.preferred_technologies || null,
        scalability_requirements: input.scalability_requirements || null,
        security_requirements: input.security_requirements || null,
      });

    if (reqError) {
      console.warn("Failed to insert requirements:", reqError);
    }

    return project as Project;
  }

  static async updateProject(projectId: string, input: Partial<CreateProjectInput>): Promise<boolean> {
    if (!this.isConfigured() || projectId.startsWith("demo-")) {
      const idx = demoProjects.findIndex((p) => p.id === projectId);
      if (idx !== -1) {
        demoProjects[idx] = {
          ...demoProjects[idx],
          name: input.name ?? demoProjects[idx].name,
          description: input.description ?? demoProjects[idx].description,
          project_type: input.project_type ?? demoProjects[idx].project_type,
          updated_at: new Date().toISOString(),
        };
      }
      return true;
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("projects")
      .update({
        name: input.name,
        description: input.description,
        project_type: input.project_type,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    return !error;
  }

  static async deleteProject(projectId: string): Promise<boolean> {
    if (!this.isConfigured() || projectId.startsWith("demo-")) {
      const idx = demoProjects.findIndex((p) => p.id === projectId);
      if (idx !== -1) demoProjects.splice(idx, 1);
      return true;
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("projects").delete().eq("id", projectId);
    return !error;
  }
}