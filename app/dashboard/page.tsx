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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white shadow-lg"
        >
          <div className="absolute inset-0 bg-grid-white/10" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  Welcome to App Tracker
                </h1>
              </div>
              <p className="text-lg text-indigo-100">
                Manage your Frappe custom applications with ease
              </p>
            </div>

            <Link href="/apps/new">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-md">
                <Plus className="mr-2 h-5 w-5" />
                Create New App
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid - Interactive & Clickable */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Apps"
            value={stats.total}
            icon={Layers}
            colorClass="bg-gradient-to-r from-indigo-500 to-purple-500"
            href="/apps"
            delay={0}
          />
          <StatsCard
            title="Active Apps"
            value={stats.active}
            icon={CheckCircle2}
            colorClass="bg-gradient-to-r from-emerald-500 to-green-500"
            href="/apps?status=Active"
            delay={0.1}
          />
          <StatsCard
            title="Internal Apps"
            value={stats.internal}
            icon={Lock}
            colorClass="bg-gradient-to-r from-blue-500 to-cyan-500"
            href="/apps?status=Internal"
            delay={0.2}
          />
          <StatsCard
            title="Deprecated"
            value={stats.deprecated}
            icon={XCircle}
            colorClass="bg-gradient-to-r from-gray-400 to-gray-500"
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
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    <CardTitle className="text-lg">Recent Apps</CardTitle>
                  </div>
                  <Link href="/apps">
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {recentApps.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Layers className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No apps yet. Create your first app!</p>
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
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                                {app.name}
                              </h3>
                              <Badge
                                variant="outline"
                                className={
                                  app.status === "Active"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : app.status === "Internal"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-gray-50 text-gray-600 border-gray-200"
                                }
                              >
                                {app.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {app.clientName}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              {app.version && (
                                <span className="font-mono font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
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
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
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
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Link href="/apps/new" className="block">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-lg border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 transition-all cursor-pointer group"
                  >
                    <motion.div
                      className="p-2 bg-indigo-600 rounded-lg text-white"
                      whileHover={{ rotate: 90 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Plus className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-gray-900">Add New App</p>
                      <p className="text-xs text-gray-600">Create a new custom app</p>
                    </div>
                  </motion.div>
                </Link>

                <Link href="/apps" className="block">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer group"
                  >
                    <motion.div
                      className="p-2 bg-gray-100 rounded-lg text-gray-700"
                      whileHover={{ rotate: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Layers className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-gray-900">View All Apps</p>
                      <p className="text-xs text-gray-600">Browse all applications</p>
                    </div>
                  </motion.div>
                </Link>

                <Link href="/apps?status=Active" className="block">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer group"
                  >
                    <motion.div
                      className="p-2 bg-emerald-50 rounded-lg text-emerald-700"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-gray-900">Active Apps</p>
                      <p className="text-xs text-gray-600">View active applications</p>
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
