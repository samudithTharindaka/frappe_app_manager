"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  colorClass: string;
  href?: string;
  delay?: number;
}

export function StatsCard({ title, value, icon: Icon, colorClass, href, delay = 0 }: StatsCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 ${
        href ? 'cursor-pointer hover:border-indigo-300' : 'hover:border-gray-300'
      }`}
    >
      {/* Top gradient accent on hover */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${colorClass} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-lg`} />
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <motion.p
            className={`text-3xl font-bold ${
              title === "Total Apps" ? "text-gray-900" :
              title.includes("Active") ? "text-emerald-600" :
              title.includes("Internal") ? "text-blue-600" :
              "text-gray-600"
            }`}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.1, type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.p>
        </div>
        <motion.div
          className={`p-3 rounded-lg ${
            title === "Total Apps" ? "bg-indigo-50" :
            title.includes("Active") ? "bg-emerald-50" :
            title.includes("Internal") ? "bg-blue-50" :
            "bg-gray-100"
          }`}
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Icon className={`h-6 w-6 ${
            title === "Total Apps" ? "text-indigo-600" :
            title.includes("Active") ? "text-emerald-600" :
            title.includes("Internal") ? "text-blue-600" :
            "text-gray-600"
          }`} />
        </motion.div>
      </div>

      {/* Optional hover indicator for clickable cards */}
      {href && (
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-xs text-indigo-600 font-medium flex items-center gap-1">
            Click to view →
          </div>
        </div>
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block group">
        {content}
      </Link>
    );
  }

  return content;
}
