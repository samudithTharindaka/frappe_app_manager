"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: "default" | "success" | "info" | "warning";
  href?: string;
  delay?: number;
}

export function StatsCard({ title, value, icon: Icon, variant = "default", href, delay = 0 }: StatsCardProps) {
  const variants = {
    default: {
      icon: "bg-gray-100 text-gray-700",
      text: "text-gray-900",
      border: "border-gray-200",
      hover: "hover:border-gray-300",
    },
    success: {
      icon: "bg-emerald-50 text-emerald-600",
      text: "text-emerald-600",
      border: "border-emerald-100",
      hover: "hover:border-emerald-200",
    },
    info: {
      icon: "bg-blue-50 text-blue-600",
      text: "text-blue-600",
      border: "border-blue-100",
      hover: "hover:border-blue-200",
    },
    warning: {
      icon: "bg-amber-50 text-amber-600",
      text: "text-amber-600",
      border: "border-amber-100",
      hover: "hover:border-amber-200",
    },
  };

  const colors = variants[variant];

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className={`relative bg-white rounded-xl border ${colors.border} ${colors.hover} p-6 hover:shadow-lg transition-all duration-300 ${
        href ? 'cursor-pointer' : ''
      } group`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <motion.p
            className={`text-3xl font-bold ${colors.text}`}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.1, type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.p>
        </div>
        <motion.div
          className={`p-3 rounded-xl ${colors.icon}`}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Icon className="h-6 w-6" />
        </motion.div>
      </div>

      {/* Subtle hover indicator */}
      {href && (
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-xs text-gray-400 font-medium">
            Click to view →
          </div>
        </div>
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
