"use client";

import { motion } from "framer-motion";
import type { PrivacyReport } from "@/types/exif";
import { cn } from "@/lib/utils";

type PrivacyGaugeProps = {
  report: PrivacyReport;
  compact?: boolean;
};

const GRADE_COLOR: Record<PrivacyReport["grade"], { text: string; bg: string; border: string }> = {
  A: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  B: { text: "text-teal-300", bg: "bg-teal-500/10", border: "border-teal-500/30" },
  C: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  D: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  F: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
};

export function PrivacyGauge({ report, compact }: PrivacyGaugeProps) {
  const circumference = 2 * Math.PI * 38;
  const offset = circumference - (report.score / 100) * circumference;
  const gradeMeta = GRADE_COLOR[report.grade] || GRADE_COLOR.C;

  return (
    <div
      className={cn(
        "flex items-center gap-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3",
        compact && "p-2.5"
      )}
    >
      {/* Dynamic Circular Dial */}
      <div className="relative size-18 shrink-0 sm:size-20">
        <svg className="size-full -rotate-90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="38" fill="none" stroke="rgb(39 39 42)" strokeWidth="6" />
          <motion.circle
            cx="45"
            cy="45"
            r="38"
            fill="none"
            stroke="url(#privacyGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          <defs>
            <linearGradient id="privacyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="60%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-lg font-bold leading-none text-zinc-100 sm:text-xl">{report.score}</span>
          <span className={cn("font-mono text-[9px] font-extrabold uppercase mt-0.5 tracking-wider sm:text-[10px]", gradeMeta.text)}>
            GRADE {report.grade}
          </span>
        </div>
      </div>

      {!compact && (
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Privacy Exposure
            </span>
            <span
              className={cn(
                "rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase",
                gradeMeta.border,
                gradeMeta.bg,
                gradeMeta.text
              )}
            >
              {report.score >= 80 ? "Low Risk" : report.score >= 50 ? "Moderate" : "High Exposure"}
            </span>
          </div>
          <p className="text-[11px] leading-snug text-zinc-400">
            Higher score = safer to share. GPS tags, serials, and author stamps reduce score.
          </p>
        </div>
      )}
    </div>
  );
}
