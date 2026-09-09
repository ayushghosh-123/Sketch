import { NextRequest, NextResponse } from "next/server";
import { ArchitectureService } from "@/services/architectureService";

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const versions = await ArchitectureService.getVersions(id);
    return NextResponse.json({ success: true, data: versions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load versions";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const body = await request.json();
    const version = await ArchitectureService.createVersion(
      id,
      body.description || "Manual architecture snapshot"
    );

    return NextResponse.json({ success: true, data: version });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create version snapshot";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
