import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function fetchDocs(appId: string) {
  const response = await fetch(`/api/apps/${appId}/docs`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch documentation");
  }
  
  return response.json();
}

async function fetchDoc(appId: string, docId: string) {
  const response = await fetch(`/api/apps/${appId}/docs/${docId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch documentation");
  }
  
  return response.json();
}

async function createDoc({ appId, data }: { appId: string; data: any }) {
  const response = await fetch(`/api/apps/${appId}/docs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create documentation");
  }

  return response.json();
}

async function updateDoc({ appId, docId, data }: { appId: string; docId: string; data: any }) {
  const response = await fetch(`/api/apps/${appId}/docs/${docId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update documentation");
  }

  return response.json();
}

async function deleteDoc({ appId, docId }: { appId: string; docId: string }) {
  const response = await fetch(`/api/apps/${appId}/docs/${docId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete documentation");
  }

  return response.json();
}

export function useDocs(appId: string) {
  return useQuery({
    queryKey: ["docs", appId],
    queryFn: () => fetchDocs(appId),
    enabled: !!appId,
  });
}

export function useDoc(appId: string, docId: string) {
  return useQuery({
    queryKey: ["doc", appId, docId],
    queryFn: () => fetchDoc(appId, docId),
    enabled: !!appId && !!docId,
  });
}

export function useCreateDoc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDoc,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["docs", variables.appId] });
      toast.success("Documentation created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateDoc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDoc,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["doc", variables.appId, variables.docId] });
      queryClient.invalidateQueries({ queryKey: ["docs", variables.appId] });
      toast.success("Documentation updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteDoc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDoc,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["docs", variables.appId] });
      toast.success("Documentation deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

