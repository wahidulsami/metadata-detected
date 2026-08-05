"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCEPTED_MIME_LABEL } from "@/lib/constants";

type DropZoneProps = {
  onFilesSelect: (files: File[]) => void;
  disabled?: boolean;
  error?: string | null;
};

export function DropZone({ onFilesSelect, disabled, error }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;
      onFilesSelect(Array.from(files));
    },
    [onFilesSelect]
  );

  return (
    <div className="w-full">
      <motion.div
        onDragEnter={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (e.currentTarget === e.target) setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (disabled) return;
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "group relative cursor-pointer overflow-hidden border border-stone-700/60 bg-stone-950/50 transition-all duration-300",
          "panel-cut min-h-[280px]",
          isDragging && "border-orange-400/70 bg-orange-500/5 shadow-[0_0_60px_-12px_rgb(249_115_22/0.35)]",
          disabled && "pointer-events-none opacity-60",
          !disabled && "hover:border-stone-500/80"
        )}
      >
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 via-amber-400/50 to-transparent opacity-80" />

        <div className="relative flex h-full flex-col justify-between gap-8 p-8 sm:flex-row sm:items-center sm:p-10">
          <div className="flex flex-col gap-4">
            <motion.div
              animate={isDragging ? { y: -6 } : { y: 0 }}
              className="inline-flex size-16 items-center justify-center border border-stone-700 bg-stone-900/80"
            >
              <ImagePlus className={cn("size-7", isDragging ? "text-orange-400" : "text-stone-400")} />
            </motion.div>
            <div>
              <p className="font-display text-2xl font-bold text-stone-100 sm:text-3xl">
                {isDragging ? "Release the roll" : "Load your frames"}
              </p>
              <p className="mt-2 max-w-sm text-sm text-stone-500">
                Drop one or many images · {ACCEPTED_MIME_LABEL} · processed entirely in memory
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-600">
              Tap or browse
            </span>
            <div className="inline-flex items-center gap-2 border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-200">
              Import
              <ArrowDown className="size-4" />
            </div>
            <p className="text-[10px] text-stone-600">⌘V paste from clipboard soon · Esc clears</p>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/tiff"
          multiple
          className="hidden"
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-start gap-2 text-sm text-red-400/90"
          >
            <X className="mt-0.5 size-4 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
