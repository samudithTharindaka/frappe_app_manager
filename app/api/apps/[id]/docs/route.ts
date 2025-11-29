import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Documentation from "@/models/Documentation";
import { docSchema } from "@/lib/validations/docSchema";
import { getSession } from "@/lib/auth";

// GET /api/apps/[id]/docs - List all docs for an app
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

    const docs = await Documentation.find({ appId: params.id })
      .populate("createdBy", "name email")
      .sort({ order: 1, createdAt: 1 });

    return NextResponse.json(docs);
  } catch (error: any) {
    console.error("GET /api/apps/[id]/docs error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch documentation" },
      { status: 500 }
    );
  }
}

// POST /api/apps/[id]/docs - Create new doc
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
    const validatedData = docSchema.parse(body);

    const doc = await Documentation.create({
      ...validatedData,
      appId: params.id,
      createdBy: (session.user as any).id,
    });

    const populatedDoc = await Documentation.findById(doc._id).populate(
      "createdBy",
      "name email"
    );

    return NextResponse.json(populatedDoc, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/apps/[id]/docs error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A document with this slug already exists for this app" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create documentation" },
      { status: 500 }
    );
  }
}

