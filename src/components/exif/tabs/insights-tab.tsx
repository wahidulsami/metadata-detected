"use client";

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { PrivacyGauge } from "@/components/exif/privacy-gauge";
import type { ParsedImageExif } from "@/types/exif";
import { cn } from "@/lib/utils";

type InsightsTabProps = {
  data: ParsedImageExif;
};

export function InsightsTab({ data }: InsightsTabProps) {
  const [copied, setCopied] = useState(false);

  const copyHash = async () => {
    if (!data.fileHash) return;
    await navigator.clipboard.writeText(data.fileHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <PrivacyGauge report={data.privacy} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-stone-800/80 bg-stone-950/50 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Color DNA</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.dominantColors.length ? (
              data.dominantColors.map((hex) => (
                <div key={hex} className="group flex flex-col items-center gap-1">
                  <div
                    className="size-10 border border-stone-700 shadow-inner transition-transform group-hover:scale-105"
                    style={{ backgroundColor: hex }}
                  />
                  <span className="font-mono text-[9px] text-stone-500">{hex}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-500">Could not sample colors.</p>
            )}
          </div>
        </div>

        <div className="border border-stone-800/80 bg-stone-950/50 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
            Luminance curve
          </p>
          <div className="mt-3 flex h-20 items-end gap-px">
            {data.histogram.map((v, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.008, duration: 0.25 }}
                style={{ height: `${Math.max(4, v * 100)}%` }}
                className="flex-1 origin-bottom bg-gradient-to-t from-orange-600/80 to-teal-400/60"
              />
            ))}
          </div>
          <p className="mt-2 text-[10px] text-stone-600">Shadows ← → Highlights</p>
        </div>
      </div>

      <div className="border border-stone-800/80 bg-stone-950/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
              File fingerprint
            </p>
            <p className="mt-1 font-mono text-xs text-stone-400 break-all">
              {data.fileHash || "—"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void copyHash()}
            disabled={!data.fileHash}
            className={cn(
              "inline-flex items-center gap-1.5 border border-stone-700 px-2.5 py-1.5 text-xs text-stone-300 transition-colors hover:border-orange-500/50 hover:text-orange-200",
              !data.fileHash && "opacity-40"
            )}
          >
            {copied ? <Check className="size-3.5 text-teal-400" /> : <Copy className="size-3.5" />}
            Copy SHA-256
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-stone-500">
          <span>
            Aspect <strong className="text-stone-300">{data.aspectLabel}</strong>
          </span>
          <span>
            Megapixels{" "}
            <strong className="text-stone-300">
              {((data.width * data.height) / 1_000_000).toFixed(1)} MP
            </strong>
          </span>
        </div>
      </div>

      <ul className="space-y-2">
        {data.privacy.flags.map((f) => (
          <li
            key={f.id}
            className="border-l-2 border-stone-800 pl-3 text-xs text-stone-400"
            style={{
              borderLeftColor:
                f.severity === "high"
                  ? "rgb(248 113 113)"
                  : f.severity === "medium"
                    ? "rgb(251 191 36)"
                    : "rgb(87 83 78)",
            }}
          >
            <span className="font-medium text-stone-200">{f.label}</span>
            <p className="mt-0.5 text-stone-500">{f.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
