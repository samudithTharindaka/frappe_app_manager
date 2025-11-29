import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Changelog from "@/models/Changelog";
import { changelogUpdateSchema } from "@/lib/validations/changelogSchema";
import { getSession } from "@/lib/auth";

// PATCH /api/apps/[id]/changelog/[changelogId] - Update changelog
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; changelogId: string }> }
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
    const validatedData = changelogUpdateSchema.parse(body);

    const { changelogId } = await params;
    const changelog = await Changelog.findByIdAndUpdate(
      changelogId,
      { $set: validatedData },
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    if (!changelog) {
      return NextResponse.json(
        { error: "Changelog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(changelog);
  } catch (error: any) {
    console.error("PATCH /api/apps/[id]/changelog/[changelogId] error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update changelog" },
      { status: 500 }
    );
  }
}

// DELETE /api/apps/[id]/changelog/[changelogId] - Delete changelog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; changelogId: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "Admin") {
      return NextResponse.json(
        { error: "Forbidden: Only admins can delete changelog entries" },
        { status: 403 }
      );
    }

    await connectDB();

    const { changelogId } = await params;
    const changelog = await Changelog.findByIdAndDelete(changelogId);

    if (!changelog) {
      return NextResponse.json(
        { error: "Changelog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Changelog deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/apps/[id]/changelog/[changelogId] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete changelog" },
      { status: 500 }
    );
  }
}

