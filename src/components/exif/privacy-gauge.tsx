"use client";

import { motion } from "framer-motion";
import type { PrivacyReport } from "@/types/exif";
import { cn } from "@/lib/utils";

type PrivacyGaugeProps = {
  report: PrivacyReport;
  compact?: boolean;
};

const GRADE_COLOR: Record<PrivacyReport["grade"], string> = {
  A: "text-teal-300",
  B: "text-emerald-400",
  C: "text-amber-400",
  D: "text-orange-400",
  F: "text-red-400",
};

export function PrivacyGauge({ report, compact }: PrivacyGaugeProps) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (report.score / 100) * circumference;

  return (
    <div
      className={cn(
        "flex items-center gap-4 border border-stone-800/80 bg-stone-950/70 p-4",
        compact && "flex-row gap-3 p-3"
      )}
    >
      <div className="relative size-24 shrink-0 sm:size-28">
        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(41 37 36)" strokeWidth="6" />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="url(#privacyGrad)"
            strokeWidth="6"
            strokeLinecap="butt"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
          <defs>
            <linearGradient id="privacyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold text-stone-100">{report.score}</span>
          <span className={cn("font-mono text-xs font-bold", GRADE_COLOR[report.grade])}>
            {report.grade}
          </span>
        </div>
      </div>

      {!compact && (
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold text-stone-100">Exposure risk</p>
          <p className="mt-1 text-xs leading-relaxed text-stone-500">
            Higher score = safer to share. GPS and device IDs drag it down fast.
          </p>
          <ul className="mt-3 space-y-1.5">
            {report.flags.slice(0, 3).map((f) => (
              <li key={f.id} className="flex items-start gap-2 text-xs text-stone-400">
                <span
                  className={cn(
                    "mt-1 size-1.5 shrink-0",
                    f.severity === "high" && "bg-red-400",
                    f.severity === "medium" && "bg-amber-400",
                    f.severity === "low" && "bg-stone-600"
                  )}
                />
                {f.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
