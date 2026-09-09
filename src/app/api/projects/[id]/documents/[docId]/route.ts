import { NextRequest, NextResponse } from "next/server";
import { DocumentService } from "@/services/documentService";

export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const { docId } = await props.params;
    const success = await DocumentService.deleteDocument(docId);
    return NextResponse.json({ success });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete document";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
