"use client";

import { useMemo, useState } from "react";
import { Check, Copy, GitCompare, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ParsedImageExif } from "@/types/exif";
import { formatFileSize } from "@/lib/exif-utils";
import { cn } from "@/lib/utils";

type CompareTabProps = {
  items: ParsedImageExif[];
  currentId: string;
};

export function CompareTab({ items, currentId }: CompareTabProps) {
  const [targetId, setTargetId] = useState<string>(() => {
    const other = items.find((i) => i.id !== currentId);
    return other ? other.id : currentId;
  });
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [copied, setCopied] = useState(false);

  const imageA = useMemo(() => items.find((i) => i.id === currentId) ?? items[0], [items, currentId]);
  const imageB = useMemo(() => items.find((i) => i.id === targetId) ?? items[0], [items, targetId]);

  // Build tag diff
  const comparison = useMemo(() => {
    if (!imageA || !imageB) return [];

    const mapA = new Map(imageA.tableRows.map((r) => [r.name, r]));
    const mapB = new Map(imageB.tableRows.map((r) => [r.name, r]));

    const allKeys = Array.from(new Set([...Array.from(mapA.keys()), ...Array.from(mapB.keys())])).sort();

    return allKeys.map((key) => {
      const rowA = mapA.get(key);
      const rowB = mapB.get(key);

      const valA = rowA?.description ?? "—";
      const valB = rowB?.description ?? "—";
      const isDiff = valA !== valB;
      const category = rowA?.category || rowB?.category || "Other";

      return {
        key,
        category,
        valA,
        valB,
        isDiff,
      };
    });
  }, [imageA, imageB]);

  const filteredComparison = useMemo(() => {
    if (onlyDifferences) {
      return comparison.filter((c) => c.isDiff);
    }
    return comparison;
  }, [comparison, onlyDifferences]);

  const diffCount = useMemo(() => comparison.filter((c) => c.isDiff).length, [comparison]);

  const copyDiffSummary = async () => {
    if (!imageA || !imageB) return;
    const lines = [
      `METADATA-DETECTED DIFF REPORT`,
      `===================`,
      `File A: ${imageA.fileName} (${imageA.width}x${imageA.height}, ${formatFileSize(imageA.fileSize)})`,
      `File B: ${imageB.fileName} (${imageB.width}x${imageB.height}, ${formatFileSize(imageB.fileSize)})`,
      `Total Tag Differences: ${diffCount}`,
      `-------------------`,
      ...filteredComparison.map((r) => `[${r.key}] ${r.isDiff ? "(DIFF)" : ""}\n  A: ${r.valA}\n  B: ${r.valB}`),
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (items.length < 2) {
    return (
      <div className="empty-state flex flex-col items-center justify-center">
        <GitCompare className="size-10 text-zinc-600 mb-3" />
        <p className="text-sm font-semibold text-zinc-200">Compare Mode Needs 2+ Images</p>
        <p className="mt-1 max-w-sm text-xs text-zinc-400">
          Upload at least two images to compare EXIF tags, camera settings, and privacy risks side-by-side.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* File Selectors & Controls */}
      <div className="flex flex-col gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 rounded-md border border-orange-500/30 bg-orange-500/10 px-2 py-1">
              <span className="font-mono text-[11px] font-bold text-orange-400">A:</span>
              <span className="max-w-[130px] truncate font-medium text-zinc-200" title={imageA.fileName}>
                {imageA.fileName}
              </span>
            </div>
            <span className="font-mono text-xs text-zinc-500">vs</span>
            <div className="flex items-center gap-1.5 rounded-md border border-teal-500/30 bg-teal-500/10 px-2 py-1">
              <span className="font-mono text-[11px] font-bold text-teal-400">B:</span>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="max-w-[140px] truncate bg-transparent font-medium text-zinc-200 outline-none"
              >
                {items.map((item) => (
                  <option key={item.id} value={item.id} disabled={item.id === imageA.id} className="bg-zinc-900 text-zinc-100">
                    {item.fileName} {item.id === imageA.id ? "(Current)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant={onlyDifferences ? "default" : "outline"}
              size="sm"
              onClick={() => setOnlyDifferences((prev) => !prev)}
              className={cn(
                "h-8 gap-1 px-2.5 text-xs font-medium",
                onlyDifferences
                  ? "bg-orange-500 font-semibold text-black hover:bg-orange-400"
                  : "border-zinc-800 bg-zinc-900/80 text-zinc-300"
              )}
            >
              <Sparkles className="size-3.5" />
              <span>Diffs ({diffCount})</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void copyDiffSummary()}
              className="h-8 gap-1.5 border-zinc-800 bg-zinc-900/80 px-2.5 text-xs text-zinc-300 hover:text-white"
            >
              {copied ? <Check className="size-3.5 text-teal-400" /> : <Copy className="size-3.5" />}
              <span>{copied ? "Copied" : "Copy Diff"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* High-Level Comparison Summary Cards */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="rounded-xl border border-orange-500/30 bg-orange-950/20 p-2.5">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageA.previewUrl} alt="" className="size-11 shrink-0 rounded-lg border border-zinc-800 object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-orange-200">{imageA.fileName}</p>
              <p className="font-mono text-[11px] text-zinc-400">
                {imageA.width}×{imageA.height} · {formatFileSize(imageA.fileSize)}
              </p>
              <p className="text-[10px] text-zinc-400">Privacy: {imageA.privacy.score}/100 ({imageA.privacy.grade})</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-teal-500/30 bg-teal-950/20 p-2.5">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageB.previewUrl} alt="" className="size-11 shrink-0 rounded-lg border border-zinc-800 object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-teal-200">{imageB.fileName}</p>
              <p className="font-mono text-[11px] text-zinc-400">
                {imageB.width}×{imageB.height} · {formatFileSize(imageB.fileSize)}
              </p>
              <p className="text-[10px] text-zinc-400">Privacy: {imageB.privacy.score}/100 ({imageB.privacy.grade})</p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Diff Matrix */}
      <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/60">
        <ScrollArea className="h-[min(380px,45vh)]">
          {/* Mobile Diff Card List (< sm) */}
          <div className="divide-y divide-zinc-900/80 sm:hidden">
            {filteredComparison.map((row) => (
              <div
                key={row.key}
                className={cn(
                  "flex flex-col gap-1.5 p-3 transition-colors",
                  row.isDiff ? "bg-amber-500/5" : ""
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {row.isDiff && <span className="size-1.5 shrink-0 rounded-full bg-amber-400" />}
                    <span className="font-mono text-xs font-semibold text-zinc-200">{row.key}</span>
                  </div>
                  <Badge variant="outline" className="border-zinc-800 px-1 py-0 font-mono text-[10px] text-zinc-400">
                    {row.category}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="rounded border border-orange-500/20 bg-orange-500/5 p-1.5">
                    <span className="text-[10px] font-bold text-orange-400">A: </span>
                    <span className="break-words text-zinc-200">{row.valA}</span>
                  </div>
                  <div className="rounded border border-teal-500/20 bg-teal-500/5 p-1.5">
                    <span className="text-[10px] font-bold text-teal-400">B: </span>
                    <span className="break-words text-zinc-200">{row.valB}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Diff Table (sm+) */}
          <table className="hidden w-full text-left text-xs sm:table">
            <thead className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-sm">
              <tr className="font-mono text-[11px] text-zinc-400 uppercase">
                <th className="w-1/3 p-2.5">EXIF Tag</th>
                <th className="w-1/3 p-2.5 text-orange-300">File A</th>
                <th className="w-1/3 p-2.5 text-teal-300">File B</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 font-mono">
              {filteredComparison.map((row) => (
                <tr
                  key={row.key}
                  className={cn(
                    "transition-colors",
                    row.isDiff ? "bg-amber-500/5 hover:bg-amber-500/10" : "hover:bg-zinc-900/30"
                  )}
                >
                  <td className="p-2.5 align-top">
                    <div className="flex items-center gap-1.5">
                      {row.isDiff && <span className="size-1.5 shrink-0 rounded-full bg-amber-400" />}
                      <span className="font-semibold text-zinc-200">{row.key}</span>
                      <Badge variant="outline" className="border-zinc-800 px-1 py-0 text-[9px] text-zinc-500">
                        {row.category}
                      </Badge>
                    </div>
                  </td>
                  <td className={cn("break-words p-2.5 align-top", row.isDiff ? "text-orange-200" : "text-zinc-400")}>
                    {row.valA}
                  </td>
                  <td className={cn("break-words p-2.5 align-top", row.isDiff ? "text-teal-200" : "text-zinc-400")}>
                    {row.valB}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredComparison.length === 0 && (
            <p className="p-6 text-center text-xs text-zinc-500">No tag differences found between these two images.</p>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
