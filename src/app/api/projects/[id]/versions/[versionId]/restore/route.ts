import { NextRequest, NextResponse } from "next/server";
import { ArchitectureService } from "@/services/architectureService";

export async function POST(
  _request: NextRequest,
  props: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const { id, versionId } = await props.params;
    const success = await ArchitectureService.restoreVersion(id, versionId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to restore version" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to restore version";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
