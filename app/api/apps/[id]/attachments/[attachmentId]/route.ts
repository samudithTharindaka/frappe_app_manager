import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Attachment from "@/models/Attachment";
import { getSession } from "@/lib/auth";

// DELETE /api/apps/[id]/attachments/[attachmentId] - Delete attachment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attachmentId: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (!["Admin", "Dev"].includes(userRole)) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    await connectDB();

    const { attachmentId } = await params;
    const attachment = await Attachment.findByIdAndDelete(attachmentId);

    if (!attachment) {
      return NextResponse.json(
        { error: "Attachment not found" },
        { status: 404 }
      );
    }

    // Note: File deletion from storage (Vercel Blob or local) should be handled here
    // For now, we'll just remove the database record

    return NextResponse.json({ message: "Attachment deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/apps/[id]/attachments/[attachmentId] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete attachment" },
      { status: 500 }
    );
  }
}

