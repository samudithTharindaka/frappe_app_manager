import { NextRequest, NextResponse } from "next/server";
import { fetchRepoMetadata } from "@/lib/github";
import { getSession } from "@/lib/auth";

// POST /api/github/fetch - Fetch GitHub repo metadata
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { repoUrl } = body;

    if (!repoUrl) {
      return NextResponse.json(
        { error: "GitHub repo URL is required" },
        { status: 400 }
      );
    }

    const metadata = await fetchRepoMetadata(repoUrl);

    console.log("🚀 GitHub API route returning data:", {
      repoName: metadata.repoName,
      repoOwner: metadata.repoOwner,
      hasReadme: !!metadata.readme,
      readmeLength: metadata.readme?.length || 0,
    });

    return NextResponse.json(metadata);
  } catch (error: any) {
    console.error("POST /api/github/fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}

