import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Changelog from "@/models/Changelog";
import { changelogSchema } from "@/lib/validations/changelogSchema";
import { getSession } from "@/lib/auth";

// GET /api/apps/[id]/changelog - List all changelogs
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const changelogs = await Changelog.find({ appId: params.id })
      .populate("createdBy", "name email")
      .sort({ releaseDate: -1 });

    return NextResponse.json(changelogs);
  } catch (error: any) {
    console.error("GET /api/apps/[id]/changelog error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch changelogs" },
      { status: 500 }
    );
  }
}

// POST /api/apps/[id]/changelog - Create changelog entry
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const validatedData = changelogSchema.parse(body);

    const changelog = await Changelog.create({
      ...validatedData,
      appId: params.id,
      createdBy: (session.user as any).id,
    });

    const populatedChangelog = await Changelog.findById(changelog._id).populate(
      "createdBy",
      "name email"
    );

    return NextResponse.json(populatedChangelog, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/apps/[id]/changelog error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create changelog" },
      { status: 500 }
    );
  }
}

