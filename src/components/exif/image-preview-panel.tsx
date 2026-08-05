"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  Expand,
  Loader2,
  Minus,
  Plus,
  RotateCcw,
  ShieldOff,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/exif-utils";
import { canStripExif } from "@/lib/strip-exif";
import type { ParsedImageExif } from "@/types/exif";

type ImagePreviewPanelProps = {
  data: ParsedImageExif;
  onClear: () => void;
  onStripExif: () => Promise<void>;
  stripping: boolean;
};

export function ImagePreviewPanel({
  data,
  onClear,
  onStripExif,
  stripping,
}: ImagePreviewPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const [lightbox, setLightbox] = useState(false);

  const resetView = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    resetView();
  }, [data.previewUrl, resetView]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    setDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setOffset({
      x: dragStart.current.ox + (e.clientX - dragStart.current.x),
      y: dragStart.current.oy + (e.clientY - dragStart.current.y),
    });
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.12 : 0.12;
    setScale((s) => Math.min(4, Math.max(1, Number((s + delta).toFixed(2)))));
  };

  const stripSupported = canStripExif(data.mimeType);

  return (
    <>
      <div className="flex h-full flex-col gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-4 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-100">{data.fileName}</p>
            <p className="text-xs text-zinc-500">{formatFileSize(data.fileSize)}</p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClear} aria-label="Remove image">
            <X className="size-4" />
          </Button>
        </div>

        <div
          ref={containerRef}
          onWheel={onWheel}
          className="relative flex min-h-[240px] flex-1 items-center justify-center overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950/50"
        >
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
            <Badge variant="outline" className="border-zinc-700/80 bg-zinc-950/70 text-zinc-300">
              {data.width} × {data.height}
            </Badge>
            {!data.hasExif && (
              <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-200/90">
                No EXIF detected
              </Badge>
            )}
          </div>

          <motion.img
            src={data.previewUrl}
            alt="Uploaded preview"
            draggable={false}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            onClick={() => scale === 1 && setLightbox(true)}
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in",
            }}
            className="max-h-[min(52vh,520px)] max-w-full select-none object-contain transition-transform duration-75"
          />

          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-1 backdrop-blur-md">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setScale((s) => Math.max(1, s - 0.25))}
              aria-label="Zoom out"
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="min-w-10 text-center text-xs tabular-nums text-zinc-400">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setScale((s) => Math.min(4, s + 0.25))}
              aria-label="Zoom in"
            >
              <Plus className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon-xs" onClick={resetView} aria-label="Reset view">
              <RotateCcw className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon-xs" onClick={() => setLightbox(true)} aria-label="Lightbox">
              <Expand className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className={cn(
              "flex-1 gap-2 border-zinc-700/80 bg-zinc-100 text-zinc-900 hover:bg-white",
              !stripSupported && "opacity-80"
            )}
            disabled={stripping || !stripSupported}
            onClick={() => void onStripExif()}
          >
            {stripping ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ShieldOff className="size-4" />
            )}
            Remove EXIF & Download
          </Button>
        </div>

        {!stripSupported && (
          <p className="text-xs text-zinc-500">
            TIFF stripping isn&apos;t supported in-browser. Convert to JPEG or PNG first.
          </p>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 text-zinc-300"
              onClick={() => setLightbox(false)}
            >
              <X />
            </Button>
            <motion.img
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              src={data.previewUrl}
              alt="Full size preview"
              className="max-h-[90vh] max-w-[92vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function DownloadOriginalButton({
  data,
}: {
  data: ParsedImageExif;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 border-zinc-800"
      onClick={() => {
        const a = document.createElement("a");
        a.href = data.previewUrl;
        a.download = data.fileName;
        a.click();
      }}
    >
      <Download className="size-4" />
      Original
    </Button>
  );
}
