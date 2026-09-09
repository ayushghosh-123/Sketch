import { NextRequest, NextResponse } from "next/server";
import { ArchitectureService } from "@/services/architectureService";

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const data = await ArchitectureService.getArchitecture(id);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch architecture";
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

    if (!body.graphData) {
      return NextResponse.json(
        { success: false, error: "graphData is required" },
        { status: 400 }
      );
    }

    const updated = await ArchitectureService.updateGraphData(id, body.graphData);
    return NextResponse.json({ success: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update architecture";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
