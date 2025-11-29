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
  ArrowRight
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-8 text-white shadow-2xl"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                Welcome to App Tracker 🚀
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg opacity-90"
              >
                Manage your Frappe custom applications with ease
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/apps/new">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Create New App
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Apps"
            value={stats.total}
            icon={Layers}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
            delay={0}
          />
          <StatsCard
            title="Active Apps"
            value={stats.active}
            icon={CheckCircle2}
            gradient="bg-gradient-to-br from-green-500 to-green-600"
            delay={0.1}
          />
          <StatsCard
            title="Internal Apps"
            value={stats.internal}
            icon={Lock}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            delay={0.2}
          />
          <StatsCard
            title="Deprecated"
            value={stats.deprecated}
            icon={XCircle}
            gradient="bg-gradient-to-br from-red-500 to-red-600"
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
            <Card className="shadow-lg border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <CardTitle>Recent Apps</CardTitle>
                  </div>
                  <Link href="/apps">
                    <Button variant="ghost" size="sm" className="group">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="divide-y"
                  >
                    {recentApps.map((app: any, index: number) => (
                      <motion.div
                        key={app._id}
                        variants={itemVariants}
                        whileHover={{ backgroundColor: "#f9fafb", x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          href={`/apps/${app._id}`}
                          className="flex items-center justify-between p-4 group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                                {app.name}
                              </h3>
                              <Badge
                                variant={app.status === "Active" ? "default" : "secondary"}
                                className={
                                  app.status === "Active"
                                    ? "bg-green-500/10 text-green-700 border-green-500/20"
                                    : app.status === "Internal"
                                    ? "bg-blue-500/10 text-blue-700 border-blue-500/20"
                                    : "bg-red-500/10 text-red-700 border-red-500/20"
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
                                <span className="font-mono font-medium text-purple-600">
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
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
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
            <Card className="shadow-lg border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Link href="/apps/new" className="block">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-lg border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer group"
                  >
                    <div className="p-2 bg-purple-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Add New App</p>
                      <p className="text-xs text-gray-600">Create a new custom app</p>
                    </div>
                  </motion.div>
                </Link>

                <Link href="/apps" className="block">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-lg border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer group"
                  >
                    <div className="p-2 bg-blue-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">View All Apps</p>
                      <p className="text-xs text-gray-600">Browse all applications</p>
                    </div>
                  </motion.div>
                </Link>

                <Link href="/apps?status=Active" className="block">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-lg border-2 border-green-200 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer group"
                  >
                    <div className="p-2 bg-green-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
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
