import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Attachment from "@/models/Attachment";
import { uploadFile } from "@/lib/upload";
import { getSession } from "@/lib/auth";

// GET /api/apps/[id]/attachments - List all attachments
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const attachments = await Attachment.find({ appId: id })
      .populate("uploadedBy", "name email")
      .sort({ uploadedAt: -1 });

    return NextResponse.json(attachments);
  } catch (error: any) {
    console.error("GET /api/apps/[id]/attachments error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch attachments" },
      { status: 500 }
    );
  }
}

// POST /api/apps/[id]/attachments - Upload file
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const uploadResult = await uploadFile(file);

    const { id } = await params;
    const attachment = await Attachment.create({
      appId: id,
      filename: uploadResult.filename,
      fileUrl: uploadResult.url,
      fileType: file.type,
      fileSize: uploadResult.fileSize,
      uploadedBy: (session.user as any).id,
    });

    const populatedAttachment = await Attachment.findById(
      attachment._id
    ).populate("uploadedBy", "name email");

    return NextResponse.json(populatedAttachment, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/apps/[id]/attachments error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

