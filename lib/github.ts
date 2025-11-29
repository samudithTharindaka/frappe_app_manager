import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || undefined,
});

interface GitHubRepoData {
  repoName: string;
  repoOwner: string;
  description: string;
  stars: number;
  lastCommit: Date;
  branches: string[];
  readme: string;
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)/,
      /github\.com\/([^\/]+)\/([^\/]+)\.git/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, ""),
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function fetchRepoMetadata(
  repoUrl: string
): Promise<GitHubRepoData> {
  const parsed = parseGitHubUrl(repoUrl);

  if (!parsed) {
    throw new Error("Invalid GitHub URL");
  }

  const { owner, repo } = parsed;

  try {
    // Fetch repository data
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo,
    });

    // Fetch branches
    const { data: branchesData } = await octokit.repos.listBranches({
      owner,
      repo,
      per_page: 10,
    });

    // Fetch last commit
    const { data: commitsData } = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: 1,
    });

    // Fetch README
    let readme = "";
    try {
      const { data: readmeData } = await octokit.repos.getReadme({
        owner,
        repo,
      });
      readme = Buffer.from(readmeData.content, "base64").toString("utf-8");
      console.log(`✅ README fetched successfully for ${owner}/${repo}`);
      console.log(`📄 README length: ${readme.length} characters`);
      console.log(`📄 README preview (first 200 chars): ${readme.substring(0, 200)}...`);
    } catch {
      console.log(`⚠️ No README found for repository ${owner}/${repo}`);
    }

    const result = {
      repoName: repoData.name,
      repoOwner: repoData.owner.login,
      description: repoData.description || "",
      stars: repoData.stargazers_count,
      lastCommit: new Date(commitsData[0]?.commit?.author?.date || new Date()),
      branches: branchesData.map((branch) => branch.name),
      readme,
    };

    console.log("📦 GitHub metadata fetched:", {
      repoName: result.repoName,
      repoOwner: result.repoOwner,
      stars: result.stars,
      branches: result.branches,
      hasReadme: !!result.readme,
      readmeLength: result.readme?.length || 0,
    });

    return result;
  } catch (error: any) {
    console.error("GitHub API Error:", error.message);
    throw new Error(`Failed to fetch GitHub data: ${error.message}`);
  }
}

export async function fetchReleases(owner: string, repo: string) {
  try {
    const { data } = await octokit.repos.listReleases({
      owner,
      repo,
      per_page: 10,
    });

    return data.map((release) => ({
      version: release.tag_name,
      name: release.name,
      body: release.body,
      publishedAt: release.published_at,
    }));
  } catch (error: any) {
    console.error("GitHub API Error:", error.message);
    return [];
  }
}

