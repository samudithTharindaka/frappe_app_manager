import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function fetchAttachments(appId: string) {
  const response = await fetch(`/api/apps/${appId}/attachments`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch attachments");
  }
  
  return response.json();
}

async function uploadAttachment({ appId, formData }: { appId: string; formData: FormData }) {
  const response = await fetch(`/api/apps/${appId}/attachments`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload file");
  }

  return response.json();
}

async function deleteAttachment({ appId, attachmentId }: { appId: string; attachmentId: string }) {
  const response = await fetch(`/api/apps/${appId}/attachments/${attachmentId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete attachment");
  }

  return response.json();
}

export function useAttachments(appId: string) {
  return useQuery({
    queryKey: ["attachments", appId],
    queryFn: () => fetchAttachments(appId),
    enabled: !!appId,
  });
}

export function useUploadAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAttachment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attachments", variables.appId] });
      toast.success("File uploaded successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAttachment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attachments", variables.appId] });
      toast.success("Attachment deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

