"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  Download,
  Expand,
  Hash,
  Loader2,
  Minus,
  Palette,
  Plus,
  RotateCcw,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
  const [showGrid, setShowGrid] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

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
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale((s) => Math.min(5, Math.max(1, Number((s + delta).toFixed(2)))));
  };

  const copyHash = async () => {
    if (!data.fileHash) return;
    await navigator.clipboard.writeText(data.fileHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const copyColor = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const lastTapRef = useRef<number>(0);
  const handleImageTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (scale > 1) {
        resetView();
      } else {
        setScale(2);
      }
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      if (scale === 1) {
        setLightbox(true);
      }
    }
  };

  const stripSupported = canStripExif(data.mimeType);
  const megapixels = ((data.width * data.height) / 1_000_000).toFixed(1);

  return (
    <>
      <div className="app-panel">
        {/* Panel Header */}
        <div className="app-panel-head">
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-mono text-[11px] font-bold tracking-widest text-orange-400 uppercase">
              Canvas
            </span>
            <span className="text-zinc-600">·</span>
            <span className="truncate font-mono text-xs text-zinc-300" title={data.fileName}>
              {data.fileName}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowGrid((g) => !g)}
              className={cn(
                "hidden h-8 items-center rounded-md px-2.5 font-mono text-[11px] font-medium transition-colors sm:inline-flex",
                showGrid
                  ? "border border-orange-500/40 bg-orange-500/20 text-orange-300"
                  : "border border-zinc-800 text-zinc-400 hover:text-zinc-200"
              )}
              title="Toggle overlay grid"
            >
              Grid
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClear}
              className="size-8 text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Viewfinder Main Stage */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-[#080808]">
          <div
            ref={containerRef}
            onWheel={onWheel}
            className="group relative flex h-56 items-center justify-center overflow-hidden sm:h-72 md:h-80"
          >
            {/* Caliper Overlay Grid */}
            {showGrid && (
              <div
                className="pointer-events-none absolute inset-0 z-10 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(249,115,22,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.4) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
            )}

            {/* Viewfinder Corner Crosshairs */}
            <span className="pointer-events-none absolute top-2.5 left-2.5 z-10 size-3 border-t-2 border-l-2 border-orange-500/60" />
            <span className="pointer-events-none absolute top-2.5 right-2.5 z-10 size-3 border-t-2 border-r-2 border-orange-500/60" />
            <span className="pointer-events-none absolute bottom-2.5 left-2.5 z-10 size-3 border-b-2 border-l-2 border-orange-500/60" />
            <span className="pointer-events-none absolute right-2.5 bottom-2.5 z-10 size-3 border-r-2 border-b-2 border-orange-500/60" />

            {/* Telemetry Badges - Clean top alignment */}
            <div className="pointer-events-none absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5 pl-2 pt-1">
              <Badge
                variant="outline"
                className="border-zinc-800/90 bg-zinc-950/80 font-mono text-[10px] text-zinc-300 backdrop-blur-md"
              >
                {data.width} × {data.height}
              </Badge>
              <Badge
                variant="outline"
                className="hidden border-zinc-800/90 bg-zinc-950/80 font-mono text-[10px] text-zinc-400 backdrop-blur-md xs:inline-flex"
              >
                {megapixels} MP · {data.aspectLabel}
              </Badge>
              {!data.hasExif && (
                <Badge
                  variant="outline"
                  className="border-amber-500/40 bg-amber-500/15 font-mono text-[10px] font-semibold text-amber-300"
                >
                  NO EXIF
                </Badge>
              )}
            </div>

            {/* Rendered Image with Zoom & Pan */}
            <motion.img
              src={data.previewUrl}
              alt="Inspection preview"
              draggable={false}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={() => setDragging(false)}
              onPointerCancel={() => setDragging(false)}
              onClick={handleImageTap}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in",
              }}
              className="max-h-full w-auto max-w-full select-none object-contain p-2 transition-transform duration-75"
            />

            {/* Desktop Floating Zoom Controls (visible sm+) */}
            <div className="absolute right-2.5 bottom-2.5 z-10 hidden items-center gap-0.5 rounded-lg border border-zinc-800/90 bg-zinc-950/90 p-1 backdrop-blur-md sm:flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setScale((s) => Math.max(1, Number((s - 0.25).toFixed(2))))}
                aria-label="Zoom out"
                className="size-7 text-zinc-300 hover:text-white"
              >
                <Minus className="size-3.5" />
              </Button>
              <span className="min-w-8 text-center font-mono text-[11px] text-zinc-400 tabular-nums">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setScale((s) => Math.min(5, Number((s + 0.25).toFixed(2))))}
                aria-label="Zoom in"
                className="size-7 text-zinc-300 hover:text-white"
              >
                <Plus className="size-3.5" />
              </Button>
              <div className="mx-0.5 h-3.5 w-px bg-zinc-800" />
              <Button
                variant="ghost"
                size="icon"
                onClick={resetView}
                aria-label="Reset zoom"
                className="size-7 text-zinc-300 hover:text-white"
                title="Reset 1:1"
              >
                <RotateCcw className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLightbox(true)}
                aria-label="Fullscreen view"
                className="size-7 text-zinc-300 hover:text-white"
                title="Fullscreen"
              >
                <Expand className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Dedicated Mobile Zoom Toolbar: positioned cleanly below the preview so it NEVER obscures the photo */}
          <div className="flex items-center justify-between border-t border-zinc-800/80 bg-zinc-950/90 px-2 py-1.5 sm:hidden">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGrid((g) => !g)}
                className={cn(
                  "h-8 px-2 font-mono text-[11px]",
                  showGrid ? "bg-orange-500/20 text-orange-300" : "text-zinc-400"
                )}
              >
                Grid
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLightbox(true)}
                className="size-8 text-zinc-300"
                aria-label="Fullscreen preview"
              >
                <Expand className="size-3.5" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setScale((s) => Math.max(1, Number((s - 0.25).toFixed(2))))}
                className="size-8 border-zinc-800 bg-zinc-900/60 text-zinc-300"
                aria-label="Zoom out"
              >
                <Minus className="size-3.5" />
              </Button>

              <span className="min-w-9 text-center font-mono text-xs font-semibold text-zinc-300 tabular-nums">
                {Math.round(scale * 100)}%
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setScale((s) => Math.min(5, Number((s + 0.25).toFixed(2))))}
                className="size-8 border-zinc-800 bg-zinc-900/60 text-zinc-300"
                aria-label="Zoom in"
              >
                <Plus className="size-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={resetView}
                disabled={scale === 1 && offset.x === 0 && offset.y === 0}
                className="size-8 text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
                aria-label="Reset zoom"
              >
                <RotateCcw className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Forensic Telemetry Strip (Color DNA & Luminance Curve) */}
        <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
          {/* Color Palette DNA Card */}
          <div className="flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-zinc-300 uppercase">
                <Palette className="size-3.5 text-orange-400" />
                Color Palette DNA
              </span>
              <span className="font-mono text-[10px] text-zinc-400">
                {copiedHex ? (
                  <span className="font-semibold text-orange-400">Copied {copiedHex}!</span>
                ) : (
                  "Tap to copy"
                )}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {data.dominantColors.length > 0 ? (
                data.dominantColors.slice(0, 6).map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => void copyColor(hex)}
                    className="group relative h-9 flex-1 rounded-md border border-zinc-800/90 transition-all hover:scale-105 hover:border-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    style={{ backgroundColor: hex }}
                    title={`Copy hex: ${hex}`}
                    aria-label={`Copy hex color ${hex}`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center rounded-md bg-black/60 font-mono text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {copiedHex === hex ? "✓" : hex.slice(1, 4)}
                    </span>
                  </button>
                ))
              ) : (
                <span className="py-2 text-[11px] text-zinc-500">No color profile extracted</span>
              )}
            </div>
          </div>

          {/* Luminance Distribution Histogram Card */}
          <div className="flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-zinc-300 uppercase">
                <Zap className="size-3.5 text-teal-400" />
                Luminance Curve
              </span>
              <span className="font-mono text-[10px] text-zinc-400">Shadows → Highlights</span>
            </div>
            <div className="flex h-9 items-end gap-0.5 rounded-md bg-zinc-900/70 p-1">
              {data.histogram.map((v, i) => (
                <div
                  key={i}
                  style={{ height: `${Math.max(10, v * 100)}%` }}
                  className="flex-1 rounded-t-xs bg-gradient-to-t from-orange-500/70 via-amber-400/80 to-teal-300"
                />
              ))}
            </div>
          </div>
        </div>

        {/* SHA-256 Checksum Bar */}
        <div className="flex items-center justify-between gap-2 rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-2.5 text-xs">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400">
              <Hash className="size-3.5 text-zinc-400" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="font-mono text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                SHA-256 Checksum
              </span>
              <span className="truncate font-mono text-xs text-zinc-200" title={data.fileHash}>
                {data.fileHash || "Calculating checksum..."}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void copyHash()}
            className="h-8 shrink-0 gap-1.5 border-zinc-800 bg-zinc-900/80 px-2.5 font-mono text-xs text-zinc-300 hover:border-zinc-700 hover:text-white"
          >
            {copiedHash ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
            <span>{copiedHash ? "Copied" : "Copy"}</span>
          </Button>
        </div>

        {/* Quick Sanitize Action Bar */}
        <Button
          variant="default"
          className={cn(
            "h-11 w-full gap-2 bg-orange-500 text-xs font-semibold tracking-wide text-black shadow-[0_0_16px_rgba(249,115,22,0.15)] hover:bg-orange-400 active:scale-[0.99]",
            !stripSupported && "opacity-80"
          )}
          disabled={stripping || !stripSupported}
          onClick={() => void onStripExif()}
        >
          {stripping ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
          <span>Download clean image</span>
        </Button>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
            onClick={() => setLightbox(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 text-zinc-300 hover:text-white"
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
              className="max-h-[92vh] max-w-[94vw] object-contain rounded-lg shadow-2xl border border-zinc-800"
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
      className="h-8 gap-1.5 border-zinc-800 bg-zinc-900/80 px-2.5 font-mono text-xs text-zinc-300 hover:border-zinc-700 hover:text-white"
      onClick={() => {
        const a = document.createElement("a");
        a.href = data.previewUrl;
        a.download = data.fileName;
        a.click();
      }}
      title="Download original image file"
    >
      <Download className="size-3.5" />
      <span>Original</span>
    </Button>
  );
}
