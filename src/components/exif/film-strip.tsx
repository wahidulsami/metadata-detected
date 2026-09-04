"use client";

import { motion } from "framer-motion";
import { Layers, Plus, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ParsedImageExif } from "@/types/exif";
import { formatFileSize } from "@/lib/exif-utils";
import { Button } from "@/components/ui/button";

type FilmStripProps = {
  items: ParsedImageExif[];
  activeId: string;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onAddMore?: () => void;
  onStripAll?: () => void;
  strippingAll?: boolean;
};

export function FilmStrip({
  items,
  activeId,
  onSelect,
  onRemove,
  onAddMore,
  onStripAll,
  strippingAll = false,
}: FilmStripProps) {
  if (items.length === 0) return null;

  return (
    <div className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-sm">
      <div className="app-gutter mx-auto flex max-w-7xl flex-col gap-2 py-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            <Layers className="size-3.5 text-orange-400" />
            <span>Batch Frames</span>
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-300">
              {items.length}
            </span>
          </div>

          {items.length > 1 && onStripAll && (
            <Button
              variant="outline"
              size="sm"
              onClick={onStripAll}
              disabled={strippingAll}
              className="h-8 gap-1.5 border-orange-500/40 bg-orange-500/10 px-2.5 text-xs font-medium text-orange-300 hover:bg-orange-500/20 sm:hidden"
            >
              <ShieldCheck className="size-3.5 text-orange-400" />
              <span>Scrub all ({items.length})</span>
            </Button>
          )}
        </div>

        <div className="scrollbar-none touch-pan-momentum flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-1 px-0.5">
          {items.map((item) => {
            const active = item.id === activeId;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => onSelect(item.id)}
                className={cn(
                  "group relative flex h-13 w-40 sm:w-44 shrink-0 cursor-pointer items-center gap-2 rounded-lg border p-1.5 transition-colors",
                  active
                    ? "border-orange-500/90 bg-orange-500/10 shadow-[0_0_12px_rgba(249,115,22,0.1)]"
                    : "border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900/80"
                )}
              >
                <div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.previewUrl} alt="" className="size-full object-cover" />
                  {item.gps && (
                    <span
                      className="absolute right-0.5 bottom-0.5 size-2 rounded-full bg-teal-400 ring-1 ring-zinc-950"
                      title="GPS geotagged"
                    />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-center pr-4">
                  <p
                    className={cn(
                      "truncate text-xs font-medium leading-tight",
                      active ? "text-orange-200" : "text-zinc-200"
                    )}
                    title={item.fileName}
                  >
                    {item.fileName}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-zinc-400">
                    {formatFileSize(item.fileSize)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                  }}
                  className="absolute top-1 right-1 flex size-5.5 items-center justify-center rounded-md bg-zinc-800/90 text-zinc-400 transition-colors hover:bg-red-600 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
                  title="Remove from batch"
                  aria-label={`Remove ${item.fileName}`}
                >
                  <X className="size-3" />
                </button>
              </motion.div>
            );
          })}

          {onAddMore && (
            <button
              type="button"
              onClick={onAddMore}
              className="flex h-13 min-w-[4.5rem] shrink-0 items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-800 bg-zinc-950/40 text-xs text-zinc-400 transition-colors hover:border-orange-500/40 hover:bg-zinc-900/50 hover:text-orange-300"
              title="Add more photos"
            >
              <Plus className="size-4" />
              <span className="font-mono text-[11px] font-semibold">Add</span>
            </button>
          )}
        </div>

        {items.length > 1 && onStripAll && (
          <div className="hidden shrink-0 sm:flex">
            <Button
              variant="outline"
              size="sm"
              onClick={onStripAll}
              disabled={strippingAll}
              className="h-9 gap-1.5 border-zinc-800 bg-zinc-900/80 text-xs text-zinc-300 hover:border-orange-500/40 hover:text-orange-300"
            >
              <ShieldCheck className="size-3.5 text-orange-400" />
              <span>Scrub all ({items.length})</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
