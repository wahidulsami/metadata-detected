"use client";

import {
  Camera,
  Check,
  Lock,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ParsedImageExif } from "@/types/exif";
import { formatFileSize } from "@/lib/exif-utils";
import { buildShareSummary } from "@/lib/export-metadata";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type AppHeaderProps = {
  activeItem?: ParsedImageExif | null;
  onOpenImport?: () => void;
  onClearAll?: () => void;
  onStripActive?: () => void;
  stripping?: boolean;
  onLoadSample?: () => void;
};

export function AppHeader({
  activeItem,
  onOpenImport,
  onClearAll,
  onStripActive,
  stripping = false,
  onLoadSample,
}: AppHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleCopySummary = async () => {
    if (!activeItem) return;
    const summary = buildShareSummary(activeItem);
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-800/80 bg-zinc-950/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="app-gutter mx-auto flex h-14 max-w-7xl items-center justify-between gap-2">
        {/* Brand / Title Area */}
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/10 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.15)]">
            <Camera className="size-4" />
            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
          </div>
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold tracking-wider text-zinc-100 uppercase">
                METADATE<span className="text-orange-400">.STUDIO</span>
              </span>
              <span className="hidden rounded bg-zinc-800 px-1 py-px font-mono text-[10px] font-semibold text-zinc-400 sm:inline">
                v2.4
              </span>
            </div>
            <span className="hidden font-mono text-[10px] text-zinc-500 sm:inline-block">
              Client-side EXIF &amp; privacy
            </span>
          </div>

          <div className="hidden h-4 w-px bg-zinc-800 md:block" />

          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 md:flex">
            <Lock className="size-3" />
            <span>In-memory · zero uploads</span>
          </div>
        </div>

        {/* Active Item Telemetry Badge (Desktop only) */}
        {activeItem && (
          <div className="hidden min-w-0 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs lg:flex">
            <span className="size-1.5 shrink-0 rounded-full bg-orange-400" />
            <span className="max-w-[150px] truncate font-medium text-zinc-200" title={activeItem.fileName}>
              {activeItem.fileName}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="font-mono text-zinc-400">
              {activeItem.width}×{activeItem.height} ({formatFileSize(activeItem.fileSize)})
            </span>
            <Badge
              variant="outline"
              className={cn(
                "px-1.5 py-0 font-mono text-[10px]",
                activeItem.privacy.score >= 80
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : activeItem.privacy.score >= 50
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border-red-500/40 bg-red-500/10 text-red-400"
              )}
            >
              Privacy {activeItem.privacy.score} ({activeItem.privacy.grade})
            </Badge>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {!activeItem ? (
            <>
              {onLoadSample && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLoadSample}
                  className="h-9 gap-1.5 border-zinc-800 bg-zinc-900/60 px-2.5 text-xs text-zinc-300 hover:border-orange-500/40 hover:text-orange-300 sm:px-3"
                >
                  <Sparkles className="size-3.5 text-orange-400" />
                  <span>Sample</span>
                </Button>
              )}
              {onOpenImport && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onOpenImport}
                  className="h-9 gap-1.5 bg-orange-500 px-3 text-xs font-semibold text-black hover:bg-orange-400"
                >
                  <Plus className="size-4" />
                  <span>Open</span>
                </Button>
              )}
            </>
          ) : (
            <>
              {/* PRIMARY ACTION: Always prominently visible on both mobile and desktop */}
              {onStripActive && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onStripActive}
                  disabled={stripping}
                  className="h-9 gap-1.5 bg-orange-500 px-3 font-semibold text-black shadow-[0_0_12px_rgba(249,115,22,0.2)] hover:bg-orange-400 active:scale-[0.98]"
                >
                  {stripping ? <RefreshCw className="size-3.5 animate-spin" /> : <ShieldCheck className="size-4" />}
                  <span>Scrub</span>
                </Button>
              )}

              {/* DESKTOP SECONDARY ACTIONS: Visible on sm+ */}
              <div className="hidden items-center gap-1.5 sm:flex">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void handleCopySummary()}
                  className="h-9 gap-1.5 border-zinc-800 bg-zinc-900/60 text-xs text-zinc-300 hover:border-zinc-700 hover:text-zinc-100"
                  title="Copy formatted summary"
                >
                  {copied ? <Check className="size-3.5 text-emerald-400" /> : <Share2 className="size-3.5 text-amber-400" />}
                  <span>{copied ? "Copied" : "Share"}</span>
                </Button>

                {onOpenImport && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenImport}
                    className="h-9 gap-1.5 border-zinc-800 bg-zinc-900/60 text-xs text-zinc-300 hover:border-zinc-700 hover:text-zinc-100"
                    title="Add more images"
                  >
                    <Plus className="size-3.5" />
                    <span>Add</span>
                  </Button>
                )}

                {onClearAll && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClearAll}
                    className="size-9 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                    title="Clear all images"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>

              {/* MOBILE SECONDARY ACTIONS MENU: Clean compact dropdown on < sm */}
              <div className="relative sm:hidden" ref={menuRef}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setMobileMenuOpen((o) => !o)}
                  className={cn(
                    "size-9 border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700 hover:text-white",
                    mobileMenuOpen && "border-orange-500/50 bg-zinc-900 text-orange-300"
                  )}
                  aria-label="More actions"
                >
                  <MoreHorizontal className="size-4" />
                </Button>

                <AnimatePresence>
                  {mobileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-zinc-800 bg-zinc-950/95 p-1.5 shadow-2xl backdrop-blur-xl z-50"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          void handleCopySummary();
                          setMobileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-900 hover:text-white"
                      >
                        {copied ? <Check className="size-4 text-emerald-400" /> : <Share2 className="size-4 text-amber-400" />}
                        <span>{copied ? "Copied to clipboard!" : "Share Summary"}</span>
                      </button>

                      {onOpenImport && (
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onOpenImport();
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-900 hover:text-white"
                        >
                          <Plus className="size-4 text-orange-400" />
                          <span>Add More Images</span>
                        </button>
                      )}

                      {onClearAll && (
                        <>
                          <div className="my-1 h-px bg-zinc-800/80" />
                          <button
                            type="button"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              onClearAll();
                            }}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
                          >
                            <Trash2 className="size-4" />
                            <span>Clear All Images</span>
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
