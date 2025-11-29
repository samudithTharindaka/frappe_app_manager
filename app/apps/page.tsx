"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApps, useDeleteApp } from "@/hooks/useApps";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/apps/AppCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, Grid3x3, List, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function AppsListContent() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    tags: "",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const { data: session } = useSession();
  const { data: apps = [], isLoading } = useApps(filters);
  const deleteApp = useDeleteApp();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this app?")) {
      try {
        await deleteApp.mutateAsync(id);
        toast.success("App deleted successfully");
      } catch (error) {
        toast.error("Failed to delete app");
      }
    }
  };

  const stats = {
    total: apps.length,
    active: apps.filter((app: any) => app.status === "Active").length,
    deprecated: apps.filter((app: any) => app.status === "Deprecated").length,
    internal: apps.filter((app: any) => app.status === "Internal").length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Animated Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Custom Apps
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your Frappe custom applications
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/apps/new">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
                <Plus className="mr-2 h-5 w-5" />
                Add New App
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90">Total Apps</p>
            <p className="text-3xl font-bold mt-1">{stats.total}</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90">Active</p>
            <p className="text-3xl font-bold mt-1">{stats.active}</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90">Internal</p>
            <p className="text-3xl font-bold mt-1">{stats.internal}</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90">Deprecated</p>
            <p className="text-3xl font-bold mt-1">{stats.deprecated}</p>
          </motion.div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-4 space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search apps..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="pl-10"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-purple-600" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
              
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-purple-600" : ""}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-purple-600" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row gap-4 pt-4 border-t overflow-hidden"
              >
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Status
                  </label>
                  <Select
                    value={filters.status || "all"}
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value === "all" ? "" : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Deprecated">Deprecated</SelectItem>
                      <SelectItem value="Internal">Internal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Tags
                  </label>
                  <Input
                    placeholder="Filter by tags (comma separated)"
                    value={filters.tags}
                    onChange={(e) =>
                      setFilters({ ...filters, tags: e.target.value })
                    }
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Display */}
          {(filters.search || filters.status || filters.tags) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-2 items-center"
            >
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.search && (
                <Badge variant="secondary" className="gap-1">
                  Search: {filters.search}
                  <button
                    onClick={() => setFilters({ ...filters, search: "" })}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.status && (
                <Badge variant="secondary" className="gap-1">
                  Status: {filters.status}
                  <button
                    onClick={() => setFilters({ ...filters, status: "" })}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.tags && (
                <Badge variant="secondary" className="gap-1">
                  Tags: {filters.tags}
                  <button
                    onClick={() => setFilters({ ...filters, tags: "" })}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ search: "", status: "", tags: "" })}
                className="text-xs"
              >
                Clear all
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Apps Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : apps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-xl shadow-md"
          >
            <div className="text-gray-400 mb-4">
              <Grid3x3 className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No apps found
            </h3>
            <p className="text-gray-600 mb-6">
              {filters.search || filters.status || filters.tags
                ? "Try adjusting your filters"
                : "Get started by creating your first app"}
            </p>
            {!filters.search && !filters.status && !filters.tags && (
              <Link href="/apps/new">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First App
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            <AnimatePresence mode="popLayout">
              {apps.map((app: any) => (
                <AppCard
                  key={app._id}
                  app={app}
                  onDelete={handleDelete}
                  userRole={(session?.user as any)?.role}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function AppsListPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </DashboardLayout>
    }>
      <AppsListContent />
    </Suspense>
  );
}
