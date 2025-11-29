import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import App from "@/models/App";
import { appSchema } from "@/lib/validations/appSchema";
import { getSession } from "@/lib/auth";

// GET /api/apps - List all apps with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const clientName = searchParams.get("clientName");
    const tags = searchParams.get("tags");
    const search = searchParams.get("search");

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (clientName) {
      query.clientName = { $regex: clientName, $options: "i" };
    }

    if (tags) {
      const tagArray = tags.split(",");
      query.tags = { $in: tagArray };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { clientName: { $regex: search, $options: "i" } },
      ];
    }

    const apps = await App.find(query)
      .populate("createdBy", "name email")
      .sort({ updatedAt: -1 });

    return NextResponse.json(apps);
  } catch (error: any) {
    console.error("GET /api/apps error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch apps" },
      { status: 500 }
    );
  }
}

// POST /api/apps - Create new app
export async function POST(request: NextRequest) {
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
    console.log("📥 POST /api/apps - Received data:", {
      name: body.name,
      hasReadme: !!body.readme,
      readmeLength: body.readme?.length || 0,
      keys: Object.keys(body),
    });
    
    const validatedData = appSchema.parse(body);

    const app = await App.create({
      ...validatedData,
      createdBy: (session.user as any).id,
    });

    console.log("✅ App created with ID:", app._id, "README saved:", !!app.readme);

    const populatedApp = await App.findById(app._id).populate(
      "createdBy",
      "name email"
    );

    return NextResponse.json(populatedApp, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/apps error:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create app" },
      { status: 500 }
    );
  }
}

