import { NextRequest, NextResponse } from "next/server";
import { ArchitectureService } from "@/services/architectureService";
import { ImpactAnalysisService } from "@/services/impactAnalysisService";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await props.params;
    const body = await request.json();
    const { changedComponentId, changeDescription } = body;

    if (!changedComponentId) {
      return NextResponse.json(
        { success: false, error: "changedComponentId is required" },
        { status: 400 }
      );
    }

    const archData = await ArchitectureService.getArchitecture(projectId);
    if (!archData.components || archData.components.length === 0) {
      return NextResponse.json(
        { success: false, error: "No architecture components found for this project" },
        { status: 400 }
      );
    }

    const result = await ImpactAnalysisService.analyzeImpact({
      projectId,
      changedComponentId,
      changeDescription,
      components: archData.components,
      dependencies: archData.dependencies,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to run impact analysis";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
