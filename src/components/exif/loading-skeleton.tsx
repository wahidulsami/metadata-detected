"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function MetadataLoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
    >
      <div className="space-y-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-4 backdrop-blur-md">
        <Skeleton className="aspect-[4/3] w-full rounded-xl bg-zinc-800/80" />
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1 rounded-lg bg-zinc-800/80" />
          <Skeleton className="h-9 w-24 rounded-lg bg-zinc-800/80" />
        </div>
      </div>
      <div className="space-y-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-4 backdrop-blur-md">
        <Skeleton className="h-9 w-full max-w-md rounded-lg bg-zinc-800/80" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl bg-zinc-800/60" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
