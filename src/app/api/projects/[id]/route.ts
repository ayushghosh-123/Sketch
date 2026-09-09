import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/services/projectService";

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const result = await ProjectService.getProjectById(id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch project";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const body = await request.json();
    const updated = await ProjectService.updateProject(id, body);

    return NextResponse.json({ success: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update project";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const deleted = await ProjectService.deleteProject(id);

    return NextResponse.json({ success: deleted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete project";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
