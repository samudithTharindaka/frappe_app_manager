"use client";

import { useRouter } from "next/navigation";
import { useCreateDoc } from "@/hooks/useDocs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DocForm } from "@/components/docs/DocForm";

export default function NewDocPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const createDoc = useCreateDoc();

  const handleSubmit = async (data: any) => {
    await createDoc.mutateAsync({ appId: params.id, data });
    router.push(`/apps/${params.id}?tab=docs`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Documentation</h1>
          <p className="text-gray-600 mt-1">Create new documentation page</p>
        </div>

        <DocForm onSubmit={handleSubmit} isLoading={createDoc.isPending} />
      </div>
    </DashboardLayout>
  );
}

