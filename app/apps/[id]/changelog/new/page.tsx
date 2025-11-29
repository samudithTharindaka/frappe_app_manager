"use client";

import { useRouter } from "next/navigation";
import { useCreateChangelog } from "@/hooks/useChangelog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ChangelogForm } from "@/components/forms/ChangelogForm";

export default function NewChangelogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const createChangelog = useCreateChangelog();

  const handleSubmit = async (data: any) => {
    await createChangelog.mutateAsync({ appId: params.id, data });
    router.push(`/apps/${params.id}?tab=changelog`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Changelog Entry</h1>
          <p className="text-gray-600 mt-1">Document version changes and updates</p>
        </div>

        <ChangelogForm onSubmit={handleSubmit} isLoading={createChangelog.isPending} />
      </div>
    </DashboardLayout>
  );
}

