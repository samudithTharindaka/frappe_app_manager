import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AppFilters {
  status?: string;
  clientName?: string;
  tags?: string;
  search?: string;
}

async function fetchApps(filters?: AppFilters) {
  const params = new URLSearchParams();
  
  if (filters?.status) params.append("status", filters.status);
  if (filters?.clientName) params.append("clientName", filters.clientName);
  if (filters?.tags) params.append("tags", filters.tags);
  if (filters?.search) params.append("search", filters.search);

  const response = await fetch(`/api/apps?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch apps");
  }
  
  return response.json();
}

async function createApp(data: any) {
  const response = await fetch("/api/apps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create app");
  }

  return response.json();
}

async function deleteApp(id: string) {
  const response = await fetch(`/api/apps/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete app");
  }

  return response.json();
}

export function useApps(filters?: AppFilters) {
  return useQuery({
    queryKey: ["apps", filters],
    queryFn: () => fetchApps(filters),
  });
}

export function useCreateApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      toast.success("App created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      toast.success("App deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

