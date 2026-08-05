"use client";

import { FileJson, FileSpreadsheet, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildShareSummary,
  exportCsv,
  exportJson,
} from "@/lib/export-metadata";
import type { ParsedImageExif } from "@/types/exif";
import { useState } from "react";
import { Check } from "lucide-react";

type ExportActionsProps = {
  data: ParsedImageExif;
};

export function ExportActions({ data }: ExportActionsProps) {
  const [shared, setShared] = useState(false);

  const shareSummary = async () => {
    const text = buildShareSummary(data);
    await navigator.clipboard.writeText(text);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 border-stone-700 bg-stone-950/50 text-stone-300 hover:border-orange-500/40"
        onClick={() => exportJson(data)}
      >
        <FileJson className="size-3.5" />
        JSON
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 border-stone-700 bg-stone-950/50 text-stone-300 hover:border-orange-500/40"
        onClick={() => exportCsv(data)}
        disabled={!data.tableRows.length}
      >
        <FileSpreadsheet className="size-3.5" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 border-stone-700 bg-stone-950/50 text-stone-300 hover:border-teal-500/40"
        onClick={() => void shareSummary()}
      >
        {shared ? <Check className="size-3.5 text-teal-400" /> : <Share2 className="size-3.5" />}
        Copy summary
      </Button>
    </div>
  );
}
