"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ParsedImageExif } from "@/types/exif";
import { formatFileSize } from "@/lib/exif-utils";

type FilmStripProps = {
  items: ParsedImageExif[];
  activeId: string;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
};

export function FilmStrip({ items, activeId, onSelect, onRemove }: FilmStripProps) {
  if (items.length <= 1) return null;

  return (
    <div className="mt-6 border border-stone-800/80 bg-stone-950/60 p-3">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-stone-500">
        Contact sheet · {items.length} frames
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <motion.button
              key={item.id}
              type="button"
              layout
              onClick={() => onSelect(item.id)}
              className={cn(
                "group relative h-20 w-20 shrink-0 overflow-hidden border-2 transition-all",
                active
                  ? "border-orange-500 shadow-[0_0_20px_-4px_rgb(249_115_22/0.5)]"
                  : "border-stone-800 opacity-70 hover:border-stone-600 hover:opacity-100"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.previewUrl} alt="" className="size-full object-cover" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-0.5 text-[8px] text-stone-300 truncate">
                {formatFileSize(item.fileSize)}
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                    onRemove(item.id);
                  }
                }}
                className="absolute right-0.5 top-0.5 hidden size-4 items-center justify-center bg-black/70 text-[10px] text-stone-300 group-hover:flex"
              >
                ×
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function ViewfinderFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <span className="viewfinder-corner left-2 top-2 border-l-2 border-t-2" />
      <span className="viewfinder-corner right-2 top-2 border-r-2 border-t-2" />
      <span className="viewfinder-corner bottom-2 left-2 border-b-2 border-l-2" />
      <span className="viewfinder-corner bottom-2 right-2 border-b-2 border-r-2" />
      {children}
    </div>
  );
}
