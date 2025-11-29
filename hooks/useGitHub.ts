import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

async function fetchGitHubRepo(repoUrl: string) {
  const response = await fetch("/api/github/fetch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repoUrl }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch GitHub data");
  }

  return response.json();
}

export function useFetchGitHub() {
  return useMutation({
    mutationFn: fetchGitHubRepo,
    onSuccess: () => {
      toast.success("GitHub data fetched successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

