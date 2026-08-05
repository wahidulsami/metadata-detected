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
  const [copied, setCopied] = useState(false);

  const categories = useMemo(() => {
    const set = new Set(rows.map((r) => r.category));
    return ["all", ...Array.from(set).sort()];
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasExif) {
    return (
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-4 py-10 text-center text-sm text-zinc-500">
        No raw EXIF tags to display for this image.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tags, values…"
            className="border-zinc-800 bg-zinc-950/50 pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950/60 p-0.5">
            <button
              type="button"
              onClick={() => setView("table")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                view === "table"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Table2 className="size-3.5" />
              Table
            </button>
            <button
              type="button"
              onClick={() => setView("json")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                view === "json"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Braces className="size-3.5" />
              JSON
            </button>
          </div>

          <Button variant="outline" size="sm" className="gap-2 border-zinc-800" onClick={() => void copyJson()}>
            {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
            Copy Raw JSON
          </Button>
        </div>
      </div>

      {view === "table" && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs transition-colors",
                category === cat
                  ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                  : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
              )}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {view === "table" ? (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-xl border border-zinc-800/80"
          >
            <ScrollArea className="h-[min(420px,50vh)]">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-md">
                  <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                    <th className="px-4 py-3 font-medium">Tag</th>
                    <th className="px-4 py-3 font-medium">Value</th>
                    <th className="px-4 py-3 font-medium">Group</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr
                      key={row.name}
                      className="border-b border-zinc-900/80 transition-colors hover:bg-zinc-900/40"
                    >
                      <td className="px-4 py-2.5 align-top font-mono text-xs text-zinc-300">{row.name}</td>
                      <td className="max-w-[280px] px-4 py-2.5 align-top text-zinc-100">
                        <span className="line-clamp-3 break-words">{row.description}</span>
                      </td>
                      <td className="px-4 py-2.5 align-top">
                        <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                          {row.category}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-zinc-500">No tags match your filters.</p>
              )}
            </ScrollArea>
          </motion.div>
        ) : (
          <motion.div
            key="json"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/60"
          >
            <ScrollArea className="h-[min(420px,50vh)]">
              <pre className="p-4 font-mono text-xs leading-relaxed text-zinc-300">{jsonString}</pre>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
