"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { 
  Github, 
  Cloud, 
  Calendar, 
  Star, 
  GitBranch,
  Edit,
  Eye,
  Trash2,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface AppCardProps {
  app: any;
  onDelete?: (id: string) => void;
  userRole?: string;
}

export function AppCard({ app, onDelete, userRole }: AppCardProps) {
  const canEdit = userRole === "Admin" || userRole === "Dev";
  const canDelete = userRole === "Admin";

  const statusColors = {
    Active: "bg-green-500/10 text-green-700 border-green-500/20",
    Deprecated: "bg-red-500/10 text-red-700 border-red-500/20",
    Internal: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group relative overflow-hidden border-gray-200 bg-white hover:shadow-xl transition-all duration-300">
        {/* Gradient Background on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Status Badge - Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <Badge 
            className={`${statusColors[app.status as keyof typeof statusColors]} backdrop-blur-sm`}
            variant="outline"
          >
            {app.status}
          </Badge>
        </div>

        <CardHeader className="pb-3 relative">
          {/* App Name */}
          <Link href={`/apps/${app._id}`}>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1 pr-20">
              {app.name}
            </h3>
          </Link>
          
          {/* Client Name */}
          <p className="text-sm text-gray-500 font-medium">
            {app.clientName}
          </p>
        </CardHeader>

        <CardContent className="space-y-4 relative">
          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
            {app.description}
          </p>

          {/* GitHub & Frappe Cloud Links */}
          <div className="flex flex-wrap gap-2">
            {app.githubRepoUrl && (
              <motion.a
                href={app.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="h-3.5 w-3.5" />
                Repository
                <ExternalLink className="h-3 w-3" />
              </motion.a>
            )}
            
            {app.frappeCloudUrl && (
              <motion.a
                href={app.frappeCloudUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Cloud className="h-3.5 w-3.5" />
                Frappe Cloud
                <ExternalLink className="h-3 w-3" />
              </motion.a>
            )}
          </div>

          {/* GitHub Stats */}
          {(app.stars !== undefined || app.branches) && (
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {app.stars !== undefined && (
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span>{app.stars}</span>
                </div>
              )}
              {app.branches && app.branches.length > 0 && (
                <div className="flex items-center gap-1">
                  <GitBranch className="h-3.5 w-3.5" />
                  <span>{app.branches.length} {app.branches.length === 1 ? 'branch' : 'branches'}</span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {app.tags && app.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {app.tags.slice(0, 3).map((tag: string) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
              {app.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  +{app.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Version & Last Updated */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true })}
              </span>
            </div>
            {app.version && (
              <span className="font-mono font-medium text-purple-600">
                v{app.version}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="gap-2 pt-4 border-t relative bg-gray-50/50">
          <Link href={`/apps/${app._id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full group/btn">
              <Eye className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              View Details
            </Button>
          </Link>
          
          {canEdit && (
            <Link href={`/apps/${app._id}/edit`}>
              <Button variant="outline" size="sm" className="group/btn">
                <Edit className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
              </Button>
            </Link>
          )}
          
          {canDelete && onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(app._id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 group/btn"
            >
              <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

