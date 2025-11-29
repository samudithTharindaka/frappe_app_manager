"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useUploadAttachment } from "@/hooks/useAttachments";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function UploadAttachmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const uploadAttachment = useUploadAttachment();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    await uploadAttachment.mutateAsync({ appId: id, formData });
    router.push(`/apps/${id}?tab=attachments`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upload Attachment</h1>
          <p className="text-gray-600 mt-1">Add files to your app documentation</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>File Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file">Select File *</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.md,.png,.jpg,.jpeg,.webp"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: PDF, Markdown, PNG, JPEG, WEBP (Max 10MB)
                </p>
              </div>

              {file && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Selected File:</strong> {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Size: {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!file || uploadAttachment.isPending}>
                  {uploadAttachment.isPending ? "Uploading..." : "Upload File"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}

