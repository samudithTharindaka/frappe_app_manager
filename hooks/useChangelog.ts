import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function fetchChangelog(appId: string) {
  const response = await fetch(`/api/apps/${appId}/changelog`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch changelog");
  }
  
  return response.json();
}

async function createChangelog({ appId, data }: { appId: string; data: any }) {
  const response = await fetch(`/api/apps/${appId}/changelog`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create changelog");
  }

  return response.json();
}

async function updateChangelog({ appId, changelogId, data }: { appId: string; changelogId: string; data: any }) {
  const response = await fetch(`/api/apps/${appId}/changelog/${changelogId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update changelog");
  }

  return response.json();
}

async function deleteChangelog({ appId, changelogId }: { appId: string; changelogId: string }) {
  const response = await fetch(`/api/apps/${appId}/changelog/${changelogId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete changelog");
  }

  return response.json();
}

export function useChangelog(appId: string) {
  return useQuery({
    queryKey: ["changelog", appId],
    queryFn: () => fetchChangelog(appId),
    enabled: !!appId,
  });
}

export function useCreateChangelog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChangelog,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["changelog", variables.appId] });
      toast.success("Changelog created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateChangelog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateChangelog,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["changelog", variables.appId] });
      toast.success("Changelog updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteChangelog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChangelog,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["changelog", variables.appId] });
      toast.success("Changelog deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

