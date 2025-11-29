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

  const statusStyles = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Deprecated: "bg-amber-50 text-amber-700 border-amber-200",
    Internal: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-gray-300 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <Link href={`/apps/${app._id}`} className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-1">
                {app.name}
              </h3>
            </Link>
            
            <Badge 
              className={`${statusStyles[app.status as keyof typeof statusStyles]} shrink-0 font-medium border`}
            >
              {app.status}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 font-medium mt-1">
            {app.clientName}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem] leading-relaxed">
            {app.description}
          </p>

          {/* GitHub & Frappe Cloud Links */}
          {(app.githubRepoUrl || app.frappeCloudUrl) && (
            <div className="flex flex-wrap gap-2">
              {app.githubRepoUrl && (
                <a
                  href={app.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>Repository</span>
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
              )}
              
              {app.frappeCloudUrl && (
                <a
                  href={app.frappeCloudUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                >
                  <Cloud className="h-3.5 w-3.5" />
                  <span>Frappe Cloud</span>
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
              )}
            </div>
          )}

          {/* GitHub Stats */}
          {(app.stars !== undefined || app.branches) && (
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {app.stars !== undefined && (
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
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
                  className="text-xs bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 font-normal"
                >
                  {tag}
                </Badge>
              ))}
              {app.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-600 border border-gray-200 font-normal">
                  +{app.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Version & Last Updated */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true })}
              </span>
            </div>
            {app.version && (
              <span className="font-mono font-medium text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                v{app.version}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="gap-2 pt-4 border-t border-gray-100 bg-gray-50/50">
          <Link href={`/apps/${app._id}`} className="flex-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-gray-300 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
          
          {canEdit && (
            <Link href={`/apps/${app._id}/edit`}>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-300 hover:bg-gray-50"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
          )}
          
          {canDelete && onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(app._id)}
              className="border-gray-300 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
