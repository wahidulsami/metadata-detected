"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Braces, Check, Copy, Search, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ExifTableRow } from "@/types/exif";

type FullExifTabProps = {
  rows: ExifTableRow[];
  rawJson: Record<string, { description: string; value: unknown }>;
  hasExif: boolean;
};

type ViewMode = "table" | "json";

export function FullExifTab({ rows, rawJson, hasExif }: FullExifTabProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | "all">("all");
  const [view, setView] = useState<ViewMode>("table");
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedRow, setCopiedRow] = useState<string | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((r) => {
      map.set(r.category, (map.get(r.category) || 0) + 1);
    });
    return [
      { name: "all", count: rows.length },
      ...Array.from(map.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, count]) => ({ name, count })),
    ];
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesCategory = category === "all" || row.category === category;
      const matchesQuery =
        !q ||
        row.name.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q) ||
        row.value.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [rows, query, category]);

  const jsonString = useMemo(() => JSON.stringify(rawJson, null, 2), [rawJson]);

  const copyJson = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const copyRowValue = async (row: ExifTableRow) => {
    await navigator.clipboard.writeText(`${row.name}: ${row.description}`);
    setCopiedRow(row.name);
    setTimeout(() => setCopiedRow(null), 1500);
  };

  if (!hasExif) {
    return (
      <div className="empty-state font-mono text-xs text-zinc-500">
        NO RAW EXIF MATRIX AVAILABLE
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search Bar & Mode Switcher */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tags or values…"
            className="h-9 w-full rounded-lg border-zinc-800 bg-zinc-950/60 pl-8.5 font-mono text-xs"
          />
        </div>

        <div className="flex items-center justify-between gap-1.5 sm:justify-end">
          {/* Table / JSON toggle */}
          <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900/80 p-0.5">
            <button
              type="button"
              onClick={() => setView("table")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors",
                view === "table"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Table2 className="size-3.5" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setView("json")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors",
                view === "json"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Braces className="size-3.5" />
              <span>JSON</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-zinc-800 bg-zinc-900/80 font-mono text-xs text-zinc-300 hover:border-zinc-700 hover:text-white"
            onClick={() => void copyJson()}
          >
            {copiedJson ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
            <span>{copiedJson ? "Copied" : "Copy JSON"}</span>
          </Button>
        </div>
      </div>

      {/* Category Filter Chips - Smooth Horizontal Scroll */}
      {view === "table" && (
        <div className="scrollbar-none touch-pan-momentum flex min-w-0 items-center gap-1.5 overflow-x-auto py-0.5">
          {categories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => setCategory(cat.name)}
              className={cn(
                "flex shrink-0 items-center gap-1 rounded-md border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors",
                category === cat.name
                  ? "border-orange-500/50 bg-orange-500/10 text-orange-300"
                  : "border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              )}
            >
              <span className="capitalize">{cat.name}</span>
              <span className="text-[10px] opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>
      )}

      {/* Viewport Content */}
      <AnimatePresence mode="wait">
        {view === "table" ? (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/50"
          >
            <ScrollArea className="h-[min(380px,46vh)]">
              {/* MOBILE VIEW: Key-Value Card List (< sm) */}
              <div className="divide-y divide-zinc-900/80 sm:hidden">
                {filtered.map((row) => {
                  const isCopied = copiedRow === row.name;
                  return (
                    <div
                      key={row.name}
                      onClick={() => void copyRowValue(row)}
                      className="group flex cursor-pointer flex-col gap-1 p-3 transition-colors active:bg-zinc-900/80"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-semibold text-orange-300">
                            {row.name}
                          </span>
                          {isCopied && <Check className="size-3 text-emerald-400" />}
                        </div>
                        <Badge
                          variant="outline"
                          className="border-zinc-800 bg-zinc-900/80 font-mono text-[10px] text-zinc-400"
                        >
                          {row.category}
                        </Badge>
                      </div>
                      <p className="font-mono text-xs break-words text-zinc-200">
                        {row.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP VIEW: 3-column Table (sm+) */}
              <table className="hidden w-full text-left font-mono text-xs sm:table">
                <thead className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-sm">
                  <tr className="text-[10px] font-semibold text-zinc-400 uppercase">
                    <th className="px-3 py-2">Tag Key</th>
                    <th className="px-3 py-2">Decoded Value</th>
                    <th className="px-3 py-2">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {filtered.map((row) => {
                    const isCopied = copiedRow === row.name;
                    return (
                      <tr
                        key={row.name}
                        onClick={() => void copyRowValue(row)}
                        className="group cursor-pointer transition-colors hover:bg-zinc-900/60"
                        title="Click to copy tag & value"
                      >
                        <td className="px-3 py-2 align-top font-semibold text-zinc-300 transition-colors group-hover:text-orange-300">
                          <div className="flex items-center gap-1.5">
                            <span>{row.name}</span>
                            {isCopied && <Check className="size-3 text-emerald-400" />}
                          </div>
                        </td>
                        <td className="max-w-[240px] px-3 py-2 align-top break-words text-zinc-100">
                          {row.description}
                        </td>
                        <td className="px-3 py-2 align-top">
                          <Badge variant="outline" className="border-zinc-800 px-1.5 py-0 text-[10px] text-zinc-400">
                            {row.category}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <p className="p-8 text-center font-mono text-xs text-zinc-500">No matching EXIF tags found.</p>
              )}
            </ScrollArea>
          </motion.div>
        ) : (
          <motion.div
            key="json"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-950/70"
          >
            <ScrollArea className="h-[min(380px,46vh)]">
              <pre className="p-3 font-mono text-[11px] leading-relaxed text-emerald-400/90">{jsonString}</pre>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
