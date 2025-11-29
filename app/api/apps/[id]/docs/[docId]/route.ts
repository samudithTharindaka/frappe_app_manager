import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Documentation from "@/models/Documentation";
import { docUpdateSchema } from "@/lib/validations/docSchema";
import { getSession } from "@/lib/auth";

// GET /api/apps/[id]/docs/[docId] - Get single doc
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; docId: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const doc = await Documentation.findById(params.docId).populate(
      "createdBy",
      "name email"
    );

    if (!doc) {
      return NextResponse.json(
        { error: "Documentation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(doc);
  } catch (error: any) {
    console.error("GET /api/apps/[id]/docs/[docId] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch documentation" },
      { status: 500 }
    );
  }
}

// PATCH /api/apps/[id]/docs/[docId] - Update doc
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; docId: string } }
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

    const body = await request.json();
    const validatedData = docUpdateSchema.parse(body);

    const doc = await Documentation.findByIdAndUpdate(
      params.docId,
      { $set: validatedData },
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    if (!doc) {
      return NextResponse.json(
        { error: "Documentation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(doc);
  } catch (error: any) {
    console.error("PATCH /api/apps/[id]/docs/[docId] error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update documentation" },
      { status: 500 }
    );
  }
}

// DELETE /api/apps/[id]/docs/[docId] - Delete doc
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; docId: string } }
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

    const doc = await Documentation.findByIdAndDelete(params.docId);

    if (!doc) {
      return NextResponse.json(
        { error: "Documentation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Documentation deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/apps/[id]/docs/[docId] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete documentation" },
      { status: 500 }
    );
  }
}

