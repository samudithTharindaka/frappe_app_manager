"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useApps, useDeleteApp } from "@/hooks/useApps";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableSkeleton } from "@/components/common/LoadingSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";

export default function AppsListPage() {
  const { data: session } = useSession();
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; appId: string | null }>({
    open: false,
    appId: null,
  });

  const { data: apps, isLoading } = useApps(filters);
  const deleteApp = useDeleteApp();
  
  const userRole = (session?.user as any)?.role;
  const canEdit = ["Admin", "Dev"].includes(userRole);
  const canDelete = userRole === "Admin";

  const handleDelete = async () => {
    if (!deleteDialog.appId) return;

    await deleteApp.mutateAsync(deleteDialog.appId);
    setDeleteDialog({ open: false, appId: null });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Apps</h1>
            <p className="text-gray-600 mt-1">Manage your custom Frappe/ERPNext applications</p>
          </div>
          {canEdit && (
            <Button asChild>
              <Link href="/apps/new">Add New App</Link>
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search apps..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="flex-1"
            />
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Deprecated">Deprecated</SelectItem>
                <SelectItem value="Internal">Internal</SelectItem>
              </SelectContent>
            </Select>
          </form>
        </div>

        {/* Apps Table */}
        <div className="bg-white rounded-lg border">
          {isLoading ? (
            <div className="p-4">
              <TableSkeleton />
            </div>
          ) : apps?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No apps found</p>
              {canEdit && (
                <Button asChild className="mt-4">
                  <Link href="/apps/new">Create Your First App</Link>
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps?.map((app: any) => (
                  <TableRow key={app._id}>
                    <TableCell>
                      <Link href={`/apps/${app._id}`} className="font-medium hover:underline">
                        {app.name}
                      </Link>
                    </TableCell>
                    <TableCell>{app.clientName}</TableCell>
                    <TableCell>
                      <Badge variant={app.status === "Active" ? "default" : "secondary"}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{app.version}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/apps/${app._id}`}>View</Link>
                      </Button>
                      {canEdit && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/apps/${app._id}/edit`}>Edit</Link>
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteDialog({ open: true, appId: app._id })}
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete App</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this app? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, appId: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteApp.isPending}
            >
              {deleteApp.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

