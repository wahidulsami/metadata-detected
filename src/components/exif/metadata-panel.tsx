"use client";

import { motion } from "framer-motion";
import { LayoutGrid, MapPin, TableProperties } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DownloadOriginalButton } from "@/components/exif/image-preview-panel";
import { OverviewTab } from "@/components/exif/tabs/overview-tab";
import { GpsTab } from "@/components/exif/tabs/gps-tab";
import { FullExifTab } from "@/components/exif/tabs/full-exif-tab";
import type { ParsedImageExif } from "@/types/exif";

type MetadataPanelProps = {
  data: ParsedImageExif;
};

export function MetadataPanel({ data }: MetadataPanelProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-4 backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Metadata</h2>
          <p className="text-xs text-zinc-500">
            {data.tableRows.length} tags · parsed locally
          </p>
        </div>
        <DownloadOriginalButton data={data} />
      </div>

      <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col gap-4">
        <TabsList variant="line" className="h-auto w-full justify-start gap-1 border-b border-zinc-800/80 bg-transparent p-0">
          <TabsTrigger value="overview" className="gap-1.5 rounded-none px-3 pb-2.5">
            <LayoutGrid className="size-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="gps" className="gap-1.5 rounded-none px-3 pb-2.5">
            <MapPin className="size-4" />
            GPS & Location
          </TabsTrigger>
          <TabsTrigger value="full" className="gap-1.5 rounded-none px-3 pb-2.5">
            <TableProperties className="size-4" />
            Full EXIF
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="min-h-0 flex-1">
          <motion.div
            key="overview-panel"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            <OverviewTab stats={data.overview} hasExif={data.hasExif} />
          </motion.div>
        </TabsContent>

        <TabsContent value="gps" className="min-h-0 flex-1">
          <motion.div
            key="gps-panel"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            <GpsTab gps={data.gps} />
          </motion.div>
        </TabsContent>

        <TabsContent value="full" className="min-h-0 flex-1">
          <motion.div
            key="full-panel"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            <FullExifTab rows={data.tableRows} rawJson={data.rawJson} hasExif={data.hasExif} />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
