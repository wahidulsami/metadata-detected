"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Aperture,
  Calendar,
  Camera,
  Check,
  Copy,
  Cpu,
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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (label: string, value: string) => {
    if (value === "—") return;
    await navigator.clipboard.writeText(value);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  if (!hasExif) {
    return (
      <div className="empty-state">
        <Cpu className="mx-auto mb-3 size-8 text-zinc-600" />
        <p className="font-mono text-sm font-semibold text-zinc-300">NO EXIF TAGS FOUND</p>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-zinc-500">
          This image has either had its metadata stripped, was exported for web without headers, or uses an unsupported container.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* HUD Telemetry Grid */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {stats.map((stat, index) => {
          const Icon = ICONS[stat.label] ?? Camera;
          const empty = stat.value === "—";
          const isCopied = copiedKey === stat.label;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02, duration: 0.2 }}
              onClick={() => handleCopy(stat.label, stat.value)}
              className={cn(
                "group relative flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3 transition-all hover:border-zinc-700 hover:bg-zinc-900/60 active:scale-[0.99]",
                empty ? "cursor-default opacity-60" : "cursor-pointer"
              )}
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Icon className="size-3.5 text-orange-400" />
                  <span className="font-mono text-[11px] font-semibold tracking-wider uppercase">
                    {stat.label}
                  </span>
                </div>
                {!empty && (
                  <span
                    className={cn(
                      "font-mono text-[10px] transition-opacity",
                      isCopied
                        ? "flex items-center gap-1 font-semibold text-emerald-400 opacity-100"
                        : "hidden text-zinc-500 group-hover:inline-flex"
                    )}
                  >
                    {isCopied ? (
                      <>
                        <Check className="size-3" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              <p
                className={cn(
                  "truncate font-mono text-xs font-semibold leading-relaxed text-zinc-100",
                  empty && "font-normal text-zinc-500"
                )}
                title={stat.value}
              >
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
