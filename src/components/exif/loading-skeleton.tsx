"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function MetadataLoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid gap-4 lg:grid-cols-2"
    >
      <div className="app-panel">
        <div className="app-panel-head">
          <Skeleton className="h-4 w-32 bg-zinc-800/80" />
          <Skeleton className="h-4 w-16 bg-zinc-800/80" />
        </div>
        <div className="relative flex min-h-[220px] flex-1 items-center justify-center rounded-lg border border-zinc-800/80 bg-zinc-900/30 sm:min-h-[280px]">
          <div className="flex flex-col items-center gap-2 text-zinc-500">
            <Loader2 className="size-6 animate-spin text-orange-400" />
            <span className="font-mono text-xs text-zinc-400">Extracting EXIF tags in memory...</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-12 rounded-lg bg-zinc-800/60" />
          <Skeleton className="h-12 rounded-lg bg-zinc-800/60" />
        </div>
      </div>

      {/* Right Workbench Skeleton */}
      <div className="app-panel">
        <div className="app-panel-head">
          <Skeleton className="h-4 w-40 bg-zinc-800/80" />
          <Skeleton className="h-6 w-20 rounded bg-zinc-800/80" />
        </div>
        <Skeleton className="h-8 w-full rounded-lg bg-zinc-800/80" />
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl bg-zinc-800/60" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
