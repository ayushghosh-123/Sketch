import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/services/projectService";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const projects = await ProjectService.getProjects(user?.id);
    return NextResponse.json({ success: true, data: projects });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch projects";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Project name is required" },
        { status: 400 }
      );
    }

    const userId = user?.id || "demo-user";
    const project = await ProjectService.createProject(body, userId);

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create project";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
