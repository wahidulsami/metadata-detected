"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  Camera,
  Clipboard,
  Cpu,
  FileCheck,
  FolderOpen,
  Lock,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCEPTED_MIME_LABEL } from "@/lib/constants";
import { Button } from "@/components/ui/button";

type DropZoneProps = {
  onFilesSelect: (files: File[]) => void;
  onLoadSample?: () => void;
  disabled?: boolean;
  error?: string | null;
};

export function DropZone({ onFilesSelect, onLoadSample, disabled, error }: DropZoneProps) {
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
    <div className="flex w-full flex-col gap-4">
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
          "group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-950/70 p-6 backdrop-blur-xl transition-all duration-300 sm:p-10",
          isDragging
            ? "border-orange-400/90 bg-orange-500/10 ring-2 ring-orange-500/40"
            : "hover:border-zinc-700 hover:bg-zinc-900/40",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(rgba(249,115,22,0.4) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "24px 24px, 48px 48px, 48px 48px",
          }}
        />

        <span className="pointer-events-none absolute top-3 left-3 size-4 border-t-2 border-l-2 border-orange-500/70" />
        <span className="pointer-events-none absolute top-3 right-3 size-4 border-t-2 border-r-2 border-orange-500/70" />
        <span className="pointer-events-none absolute bottom-3 left-3 size-4 border-b-2 border-l-2 border-orange-500/70" />
        <span className="pointer-events-none absolute right-3 bottom-3 size-4 border-r-2 border-b-2 border-orange-500/70" />

        <div className="relative flex flex-col items-center justify-center gap-5 text-center">
          <div className="relative flex size-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 sm:size-20">
            <motion.div animate={isDragging ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Camera className={cn("size-8 sm:size-9", isDragging ? "text-orange-400" : "text-zinc-300 group-hover:text-orange-400")} />
            </motion.div>
            <span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-orange-500 font-bold text-black">
              <ArrowDown className="size-3.5" />
            </span>
          </div>

          <div className="max-w-md space-y-2 px-1">
            <h2 className="font-mono text-lg font-bold tracking-tight text-zinc-100 sm:text-2xl">
              {isDragging ? "Drop frames to inspect" : "Drop images to inspect EXIF"}
            </h2>
            <p className="text-xs text-zinc-400 sm:text-sm">
              Drag, browse, or paste · <span className="font-mono text-zinc-200">{ACCEPTED_MIME_LABEL}</span> · 50MB max
            </p>
          </div>

          <div className="flex w-full max-w-md flex-col items-stretch justify-center gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <Button
              type="button"
              variant="default"
              size="sm"
              className="h-11 gap-2 bg-orange-500 px-5 font-semibold text-black hover:bg-orange-400 sm:h-9"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <FolderOpen className="size-4" />
              <span>Browse files</span>
            </Button>

            {onLoadSample && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-11 gap-2 border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-orange-500/40 hover:bg-zinc-900 hover:text-orange-300 sm:h-9"
                onClick={(e) => {
                  e.stopPropagation();
                  onLoadSample();
                }}
              >
                <Sparkles className="size-4 text-orange-400" />
                <span>Load sample</span>
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-zinc-500">
            <span className="flex items-center gap-1 rounded border border-zinc-800/80 bg-zinc-900/60 px-2 py-1 text-zinc-400">
              <Clipboard className="size-3 text-orange-400" />
              <span>Ctrl+V to paste</span>
            </span>
            <span className="flex items-center gap-1 rounded border border-zinc-800/80 bg-zinc-900/60 px-2 py-1 text-zinc-400">
              <Lock className="size-3 text-emerald-400" />
              <span>No uploads</span>
            </span>
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex min-h-[6.75rem] flex-col rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3">
          <ShieldCheck className="mb-1.5 size-4 text-amber-400" />
          <h3 className="font-mono text-xs font-semibold text-zinc-200">Privacy radar</h3>
          <p className="mt-1 text-[11px] leading-snug text-zinc-500">Flags GPS leaks, serials, and author stamps</p>
        </div>
        <div className="flex min-h-[6.75rem] flex-col rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3">
          <Cpu className="mb-1.5 size-4 text-teal-400" />
          <h3 className="font-mono text-xs font-semibold text-zinc-200">Camera telemetry</h3>
          <p className="mt-1 text-[11px] leading-snug text-zinc-500">Body, lens, ISO, shutter, and aperture</p>
        </div>
        <div className="flex min-h-[6.75rem] flex-col rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3">
          <Zap className="mb-1.5 size-4 text-orange-400" />
          <h3 className="font-mono text-xs font-semibold text-zinc-200">One-click sanitizer</h3>
          <p className="mt-1 text-[11px] leading-snug text-zinc-500">Scrub EXIF in the browser before you share</p>
        </div>
        <div className="flex min-h-[6.75rem] flex-col rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3">
          <FileCheck className="mb-1.5 size-4 text-sky-400" />
          <h3 className="font-mono text-xs font-semibold text-zinc-200">Diff &amp; export</h3>
          <p className="mt-1 text-[11px] leading-snug text-zinc-500">JSON, CSV, and side-by-side tag compare</p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 font-mono text-xs text-red-300"
          >
            <X className="size-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
