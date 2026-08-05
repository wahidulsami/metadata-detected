"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileImage, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCEPTED_MIME_LABEL } from "@/lib/constants";

type DropZoneProps = {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  error?: string | null;
};

export function DropZone({ onFileSelect, disabled, error }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
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
        whileHover={disabled ? undefined : { scale: 1.005 }}
        whileTap={disabled ? undefined : { scale: 0.995 }}
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-2xl border border-dashed transition-colors",
          "border-zinc-800 bg-zinc-900/20 backdrop-blur-md",
          isDragging && "border-zinc-500 bg-zinc-800/40",
          disabled && "pointer-events-none opacity-60",
          !disabled && "hover:border-zinc-600 hover:bg-zinc-900/40"
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-zinc-500/5 via-transparent to-zinc-400/5 opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="relative flex flex-col items-center gap-4 px-6 py-14 sm:py-16">
          <motion.div
            animate={
              isDragging
                ? { y: -4, scale: 1.05, rotate: -2 }
                : { y: 0, scale: 1, rotate: 0 }
            }
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className={cn(
              "flex size-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/60 shadow-inner",
              isDragging && "border-zinc-600 bg-zinc-800/80"
            )}
          >
            {isDragging ? (
              <Upload className="size-6 text-zinc-200" />
            ) : (
              <FileImage className="size-6 text-zinc-400" />
            )}
          </motion.div>

          <div className="text-center">
            <p className="text-base font-medium text-zinc-100">
              {isDragging ? "Drop to analyze" : "Drag & drop an image"}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              or click to browse · {ACCEPTED_MIME_LABEL}
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/tiff"
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
