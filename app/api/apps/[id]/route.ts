import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import App from "@/models/App";
import { appUpdateSchema } from "@/lib/validations/appSchema";
import { getSession } from "@/lib/auth";

// GET /api/apps/[id] - Get single app
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
    const app = await App.findById(id).populate("createdBy", "name email");

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    return NextResponse.json(app);
  } catch (error: any) {
    console.error("GET /api/apps/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch app" },
      { status: 500 }
    );
  }
}

// PATCH /api/apps/[id] - Update app
export async function PATCH(
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

    const body = await request.json();
    console.log("📥 PATCH /api/apps/[id] - Received data:", {
      name: body.name,
      hasReadme: !!body.readme,
      readmeLength: body.readme?.length || 0,
      keys: Object.keys(body),
    });
    
    const validatedData = appUpdateSchema.parse(body);
    console.log("✅ After validation:", {
      hasReadme: !!validatedData.readme,
      readmeLength: validatedData.readme?.length || 0,
      validatedKeys: Object.keys(validatedData),
    });

    const { id } = await params;
    const app = await App.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    console.log("✅ App updated with ID:", app._id, "README saved:", !!app.readme, "Length:", app.readme?.length || 0);

    return NextResponse.json(app);
  } catch (error: any) {
    console.error("PATCH /api/apps/[id] error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update app" },
      { status: 500 }
    );
  }
}

// DELETE /api/apps/[id] - Delete app
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "Admin") {
      return NextResponse.json(
        { error: "Forbidden: Only admins can delete apps" },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await params;
    const app = await App.findByIdAndDelete(id);

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "App deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/apps/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete app" },
      { status: 500 }
    );
  }
}

