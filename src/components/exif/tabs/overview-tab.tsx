"use client";

import { motion } from "framer-motion";
import {
  Aperture,
  Calendar,
  Camera,
  Gauge,
  Maximize2,
  Scan,
  Timer,
  ZoomIn,
} from "lucide-react";
import type { OverviewStat } from "@/types/exif";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Camera Model": Camera,
  Lens: Scan,
  ISO: Gauge,
  Aperture: Aperture,
  "Shutter Speed": Timer,
  "Focal Length": ZoomIn,
  "Capture Date": Calendar,
  Resolution: Maximize2,
};

type OverviewTabProps = {
  stats: OverviewStat[];
  hasExif: boolean;
};

export function OverviewTab({ stats, hasExif }: OverviewTabProps) {
  if (!hasExif) {
    return (
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-4 py-10 text-center">
        <p className="text-sm font-medium text-zinc-300">No EXIF metadata found</p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          This image may have been exported without metadata, or EXIF was already removed.
          Resolution is still shown from the decoded image.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {stats.map((stat, index) => {
        const Icon = ICONS[stat.label] ?? Camera;
        const empty = stat.value === "—";

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.35 }}
            className={cn(
              "rounded-xl border border-zinc-800/70 bg-zinc-950/35 p-4",
              empty && "opacity-70"
            )}
          >
            <div className="mb-3 flex items-center gap-2 text-zinc-500">
              <Icon className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-sm font-medium leading-snug text-zinc-100">{stat.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
