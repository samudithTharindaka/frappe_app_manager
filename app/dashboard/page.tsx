"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useApps } from "@/hooks/useApps";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppCardSkeleton } from "@/components/common/LoadingSkeleton";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: apps, isLoading } = useApps();
  const userRole = (session?.user as any)?.role;
  const canCreate = ["Admin", "Dev"].includes(userRole);

  const totalApps = apps?.length || 0;
  const activeApps = apps?.filter((app: any) => app.status === "Active").length || 0;
  const recentApps = apps?.slice(0, 5) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {session?.user?.name}!
            </p>
          </div>
          {canCreate && (
            <Button asChild>
              <Link href="/apps/new">Add New App</Link>
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Apps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalApps}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Apps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeApps}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Recently Updated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{recentApps.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Apps */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Apps</CardTitle>
              <Button variant="outline" asChild>
                <Link href="/apps">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <AppCardSkeleton key={i} />
                ))}
              </div>
            ) : recentApps.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No apps yet</p>
                {canCreate && (
                  <Button asChild className="mt-4">
                    <Link href="/apps/new">Create Your First App</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {recentApps.map((app: any) => (
                  <Link
                    key={app._id}
                    href={`/apps/${app._id}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{app.name}</h3>
                        <p className="text-sm text-gray-600">{app.clientName}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {app.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={app.status === "Active" ? "default" : "secondary"}>
                            {app.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            v{app.version}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true })}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {canCreate && (
                <>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/apps/new">Add New App</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/apps">Browse All Apps</Link>
                  </Button>
                </>
              )}
              {!canCreate && (
                <Button variant="outline" asChild className="justify-start">
                  <Link href="/apps">Browse All Apps</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

