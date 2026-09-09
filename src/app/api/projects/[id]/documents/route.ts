import { NextRequest, NextResponse } from "next/server";
import { DocumentService } from "@/services/documentService";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const docs = await DocumentService.getDocuments(id);
    return NextResponse.json({ success: true, data: docs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load documents";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await props.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || "demo-user";

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const doc = await DocumentService.processAndStoreDocument({
      projectId,
      userId,
      fileName: file.name,
      fileBuffer: buffer,
      fileType: file.type || "text/plain",
      fileSize: file.size,
    });

    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error: unknown) {
    console.error("Document upload route error:", error);
    const message = error instanceof Error ? error.message : "Failed to upload and process document";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
