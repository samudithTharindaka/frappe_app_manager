"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useApp, useUpdateApp } from "@/hooks/useApp";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppForm } from "@/components/apps/AppForm";
import { PageSkeleton } from "@/components/common/LoadingSkeleton";

export default function EditAppPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: app, isLoading } = useApp(id);
  const updateApp = useUpdateApp();

  const handleSubmit = async (data: any) => {
    await updateApp.mutateAsync({ id, data });
    router.push(`/apps/${id}`);
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
          <h1 className="text-3xl font-bold text-gray-900">Edit App</h1>
          <p className="text-gray-600 mt-1">Update {app?.name} details</p>
        </div>

        <AppForm
          defaultValues={app}
          onSubmit={handleSubmit}
          isLoading={updateApp.isPending}
        />
      </div>
    </DashboardLayout>
  );
}

