"use client";

import { useRouter } from "next/navigation";
import { useDoc, useUpdateDoc } from "@/hooks/useDocs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DocForm } from "@/components/docs/DocForm";
import { PageSkeleton } from "@/components/common/LoadingSkeleton";

export default function EditDocPage({
  params,
}: {
  params: { id: string; docId: string };
}) {
  const router = useRouter();
  const { data: doc, isLoading } = useDoc(params.id, params.docId);
  const updateDoc = useUpdateDoc();

  const handleSubmit = async (data: any) => {
    await updateDoc.mutateAsync({ appId: params.id, docId: params.docId, data });
    router.push(`/apps/${params.id}?tab=docs`);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Documentation</h1>
          <p className="text-gray-600 mt-1">Update documentation page</p>
        </div>

        <DocForm
          defaultValues={doc}
          onSubmit={handleSubmit}
          isLoading={updateDoc.isPending}
        />
      </div>
    </DashboardLayout>
  );
}

