"use client";

import { motion } from "framer-motion";
import {
  GitCompare,
  LayoutGrid,
  MapPin,
  ShieldCheck,
  TableProperties,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DownloadOriginalButton } from "@/components/exif/image-preview-panel";
import { OverviewTab } from "@/components/exif/tabs/overview-tab";
import { GpsTab } from "@/components/exif/tabs/gps-tab";
import { FullExifTab } from "@/components/exif/tabs/full-exif-tab";
import { PrivacyGauge } from "@/components/exif/privacy-gauge";
import { CompareTab } from "@/components/exif/tabs/compare-tab";
import type { ParsedImageExif } from "@/types/exif";
import { ExportActions } from "@/components/exif/export-actions";
import { Badge } from "@/components/ui/badge";

type MetadataPanelProps = {
  data: ParsedImageExif;
  allLoadedItems?: ParsedImageExif[];
};

export function MetadataPanel({ data, allLoadedItems = [] }: MetadataPanelProps) {
  const hasGps = Boolean(data.gps);
  const tagCount = data.tableRows.length;
  const items = allLoadedItems.length > 0 ? allLoadedItems : [data];

  return (
    <div className="app-panel">
      <div className="app-panel-head">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] font-bold tracking-widest text-teal-400 uppercase">
            Inspector
          </span>
          <Badge variant="outline" className="border-zinc-800 bg-zinc-900/80 font-mono text-[10px] text-zinc-300">
            {tagCount} tags
          </Badge>
          {hasGps && (
            <Badge variant="outline" className="border-teal-500/30 bg-teal-500/10 font-mono text-[10px] text-teal-300">
              GPS
            </Badge>
          )}
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <ExportActions data={data} />
          <DownloadOriginalButton data={data} />
        </div>
      </div>

      <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col gap-3">
        <TabsList className="scrollbar-none touch-pan-momentum flex h-11 w-full shrink-0 items-center justify-start gap-1 overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-1">
          <TabsTrigger
            value="overview"
            className="h-9 shrink-0 gap-1.5 rounded-lg px-3 font-mono text-xs font-medium text-zinc-400 transition-all data-[state=active]:bg-zinc-800/90 data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm"
          >
            <LayoutGrid className="size-3.5 shrink-0 text-orange-400" />
            <span>Overview</span>
          </TabsTrigger>

          <TabsTrigger
            value="privacy"
            className="h-9 shrink-0 gap-1.5 rounded-lg px-3 font-mono text-xs font-medium text-zinc-400 transition-all data-[state=active]:bg-zinc-800/90 data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm"
          >
            <ShieldCheck className="size-3.5 shrink-0 text-amber-400" />
            <span>Privacy</span>
            <span
              className={`rounded px-1 text-[10px] font-bold ${
                data.privacy.score >= 80
                  ? "bg-emerald-500/20 text-emerald-400"
                  : data.privacy.score >= 50
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-red-500/20 text-red-400"
              }`}
            >
              {data.privacy.grade}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="gps"
            className="h-9 shrink-0 gap-1.5 rounded-lg px-3 font-mono text-xs font-medium text-zinc-400 transition-all data-[state=active]:bg-zinc-800/90 data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm"
          >
            <MapPin className="size-3.5 shrink-0 text-teal-400" />
            <span>GPS</span>
            {hasGps && <span className="size-1.5 rounded-full bg-teal-400" />}
          </TabsTrigger>

          <TabsTrigger
            value="full"
            className="h-9 shrink-0 gap-1.5 rounded-lg px-3 font-mono text-xs font-medium text-zinc-400 transition-all data-[state=active]:bg-zinc-800/90 data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm"
          >
            <TableProperties className="size-3.5 shrink-0 text-sky-400" />
            <span>Tags</span>
            <span className="rounded bg-zinc-800 px-1 font-mono text-[10px] text-zinc-400">{tagCount}</span>
          </TabsTrigger>

          <TabsTrigger
            value="compare"
            className="h-9 shrink-0 gap-1.5 rounded-lg px-3 font-mono text-xs font-medium text-zinc-400 transition-all data-[state=active]:bg-zinc-800/90 data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm"
          >
            <GitCompare className="size-3.5 shrink-0 text-purple-400" />
            <span>Compare</span>
            {items.length > 1 && (
              <span className="rounded bg-purple-500/20 px-1 font-mono text-[10px] text-purple-300">{items.length}</span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview HUD */}
        <TabsContent value="overview" className="min-h-0 flex-1 overflow-y-auto">
          <motion.div
            key="overview-panel"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <OverviewTab stats={data.overview} hasExif={data.hasExif} />
          </motion.div>
        </TabsContent>

        {/* Tab 2: Privacy Radar */}
        <TabsContent value="privacy" className="min-h-0 flex-1 overflow-y-auto">
          <motion.div
            key="privacy-panel"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <PrivacyGauge report={data.privacy} />
            <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/40 p-3">
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                Identified Security & Privacy Flags
              </h4>
              {data.privacy.flags.length > 0 ? (
                <ul className="space-y-2">
                  {data.privacy.flags.map((flag) => (
                    <li
                      key={flag.id}
                      className="flex items-start justify-between gap-2 rounded border border-zinc-800/60 bg-zinc-900/40 p-2 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`size-2 rounded-full ${
                              flag.severity === "high"
                                ? "bg-red-400"
                                : flag.severity === "medium"
                                  ? "bg-amber-400"
                                  : "bg-zinc-500"
                            }`}
                          />
                          <span className="font-semibold text-zinc-200">{flag.label}</span>
                        </div>
                        <p className="mt-0.5 text-zinc-400 text-[11px]">{flag.detail}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[9px] uppercase font-mono ${
                          flag.severity === "high"
                            ? "border-red-500/40 text-red-400"
                            : flag.severity === "medium"
                              ? "border-amber-500/40 text-amber-300"
                              : "border-zinc-700 text-zinc-400"
                        }`}
                      >
                        {flag.severity}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-400">✓ No privacy risks or trackable device IDs found.</p>
              )}
            </div>
          </motion.div>
        </TabsContent>

        {/* Tab 3: GPS Geolocation */}
        <TabsContent value="gps" className="min-h-0 flex-1 overflow-y-auto">
          <motion.div
            key="gps-panel"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GpsTab gps={data.gps} />
          </motion.div>
        </TabsContent>

        {/* Tab 4: Full EXIF Matrix */}
        <TabsContent value="full" className="min-h-0 flex-1 overflow-y-auto">
          <motion.div
            key="full-panel"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FullExifTab rows={data.tableRows} rawJson={data.rawJson} hasExif={data.hasExif} />
          </motion.div>
        </TabsContent>

        {/* Tab 5: Compare / Diff */}
        <TabsContent value="compare" className="min-h-0 flex-1 overflow-y-auto">
          <motion.div
            key="compare-panel"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CompareTab items={items} currentId={data.id} />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
