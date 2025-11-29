"use client";

import { useRouter } from "next/navigation";
import { useCreateApp } from "@/hooks/useApps";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppForm } from "@/components/apps/AppForm";

export default function NewAppPage() {
  const router = useRouter();
  const createApp = useCreateApp();

  const handleSubmit = async (data: any) => {
    const app = await createApp.mutateAsync(data);
    router.push(`/apps/${app._id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New App</h1>
          <p className="text-gray-600 mt-1">Create a new custom Frappe/ERPNext application</p>
        </div>

        <AppForm onSubmit={handleSubmit} isLoading={createApp.isPending} />
      </div>
    </DashboardLayout>
  );
}

