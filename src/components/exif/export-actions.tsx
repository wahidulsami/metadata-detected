"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy, Download, FileJson, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  buildShareSummary,
  exportCsv,
  exportJson,
} from "@/lib/export-metadata";
import type { ParsedImageExif } from "@/types/exif";

type ExportActionsProps = {
  data: ParsedImageExif;
};

export function ExportActions({ data }: ExportActionsProps) {
  const [shared, setShared] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const shareSummary = async () => {
    const text = buildShareSummary(data);
    await navigator.clipboard.writeText(text);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      {/* Desktop Inline Actions (sm+) */}
      <div className="hidden items-center gap-1.5 sm:flex">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 border-zinc-800 bg-zinc-900/80 font-mono text-xs text-zinc-300 hover:border-zinc-700 hover:text-white"
          onClick={() => exportJson(data)}
          title="Export JSON"
        >
          <FileJson className="size-3.5 text-orange-400" />
          <span>JSON</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 border-zinc-800 bg-zinc-900/80 font-mono text-xs text-zinc-300 hover:border-zinc-700 hover:text-white"
          onClick={() => exportCsv(data)}
          disabled={!data.tableRows.length}
          title="Export CSV"
        >
          <FileSpreadsheet className="size-3.5 text-teal-400" />
          <span>CSV</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 border-zinc-800 bg-zinc-900/80 font-mono text-xs text-zinc-300 hover:border-zinc-700 hover:text-white"
          onClick={() => void shareSummary()}
          title="Copy summary"
        >
          {shared ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
          <span>{shared ? "Copied" : "Summary"}</span>
        </Button>
      </div>

      {/* Mobile Compact Dropdown (< sm) */}
      <div className="relative sm:hidden" ref={menuRef}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((o) => !o)}
          className="h-8 gap-1 border-zinc-800 bg-zinc-900/80 px-2.5 font-mono text-xs text-zinc-300"
        >
          <Download className="size-3.5 text-orange-400" />
          <span>Export</span>
          <ChevronDown className="size-3 text-zinc-400" />
        </Button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-zinc-800 bg-zinc-950/95 p-1.5 shadow-2xl backdrop-blur-xl z-50 font-mono text-xs"
            >
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  exportJson(data);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-zinc-200 transition-colors hover:bg-zinc-900 hover:text-white"
              >
                <FileJson className="size-3.5 text-orange-400" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                disabled={!data.tableRows.length}
                onClick={() => {
                  setOpen(false);
                  exportCsv(data);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-zinc-200 transition-colors hover:bg-zinc-900 hover:text-white disabled:opacity-40"
              >
                <FileSpreadsheet className="size-3.5 text-teal-400" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  void shareSummary();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-zinc-200 transition-colors hover:bg-zinc-900 hover:text-white"
              >
                {shared ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5 text-amber-400" />}
                <span>{shared ? "Copied Summary!" : "Copy Summary"}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
