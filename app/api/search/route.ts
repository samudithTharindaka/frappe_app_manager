import { NextRequest, NextResponse } from "next/server";
import { searchApps, searchDocs } from "@/lib/search";
import { getSession } from "@/lib/auth";

// GET /api/search - Search across apps and docs
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "apps";

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    let results;

    if (type === "docs") {
      results = await searchDocs(query);
    } else {
      results = await searchApps(query);
    }

    return NextResponse.json({ results, type, query });
  } catch (error: any) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { error: error.message || "Search failed" },
      { status: 500 }
    );
  }
}

