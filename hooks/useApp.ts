import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function fetchApp(id: string) {
  const response = await fetch(`/api/apps/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch app");
  }
  
  return response.json();
}

async function updateApp({ id, data }: { id: string; data: any }) {
  const response = await fetch(`/api/apps/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update app");
  }

  return response.json();
}

export function useApp(id: string) {
  return useQuery({
    queryKey: ["app", id],
    queryFn: () => fetchApp(id),
    enabled: !!id,
  });
}

export function useUpdateApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApp,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["app", data._id] });
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      toast.success("App updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

