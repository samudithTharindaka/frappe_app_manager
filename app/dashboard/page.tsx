"use client";

import { motion } from "framer-motion";
import { useApps } from "@/hooks/useApps";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Lock,
  TrendingUp,
  Calendar,
  Github,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { data: apps = [] } = useApps({});

  const stats = {
    total: apps.length,
    active: apps.filter((app: any) => app.status === "Active").length,
    deprecated: apps.filter((app: any) => app.status === "Deprecated").length,
    internal: apps.filter((app: any) => app.status === "Internal").length,
  };

  const recentApps = apps.slice(0, 5);

  const statusStyles = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Deprecated: "bg-amber-50 text-amber-700 border-amber-200",
    Internal: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 md:p-10 text-white shadow-lg"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_50%)]" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Welcome Back
                </h1>
              </div>
              <p className="text-lg text-gray-300">
                Manage and track your Frappe custom applications
              </p>
            </div>

            <Link href="/apps/new">
              <Button 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg font-semibold"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create New App
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatsCard
            title="Total Apps"
            value={stats.total}
            icon={Layers}
            variant="default"
            href="/apps"
            delay={0}
          />
          <StatsCard
            title="Active"
            value={stats.active}
            icon={CheckCircle2}
            variant="success"
            href="/apps?status=Active"
            delay={0.1}
          />
          <StatsCard
            title="Internal"
            value={stats.internal}
            icon={Lock}
            variant="info"
            href="/apps?status=Internal"
            delay={0.2}
          />
          <StatsCard
            title="Deprecated"
            value={stats.deprecated}
            icon={XCircle}
            variant="warning"
            href="/apps?status=Deprecated"
            delay={0.3}
          />
        </div>

        {/* Recent Apps & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Apps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-900 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold">Recent Apps</CardTitle>
                  </div>
                  <Link href="/apps">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    >
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {recentApps.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Layers className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="font-medium">No apps yet</p>
                    <p className="text-sm text-gray-400 mt-1">Create your first app to get started</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {recentApps.map((app: any, index: number) => (
                      <motion.div
                        key={app._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                      >
                        <Link
                          href={`/apps/${app._id}`}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1.5">
                              <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                                {app.name}
                              </h3>
                              <Badge
                                className={`${statusStyles[app.status as keyof typeof statusStyles]} border shrink-0`}
                              >
                                {app.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {app.clientName}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              {app.version && (
                                <span className="font-mono font-medium text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                                  v{app.version}
                                </span>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true })}
                              </div>
                              {app.githubRepoUrl && (
                                <div className="flex items-center gap-1">
                                  <Github className="h-3 w-3" />
                                  GitHub
                                </div>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-gray-700 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Link href="/apps/new" className="block">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gray-900 hover:bg-gray-800 transition-all cursor-pointer group text-white shadow-md"
                  >
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Add New App</p>
                      <p className="text-xs text-gray-300">Create a custom application</p>
                    </div>
                  </motion.div>
                </Link>

                <Link href="/apps" className="block">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer group"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Layers className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">View All Apps</p>
                      <p className="text-xs text-gray-600">Browse applications</p>
                    </div>
                  </motion.div>
                </Link>

                <Link href="/apps?status=Active" className="block">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 transition-all cursor-pointer group"
                  >
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-900">Active Apps</p>
                      <p className="text-xs text-emerald-700">View active applications</p>
                    </div>
                  </motion.div>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
