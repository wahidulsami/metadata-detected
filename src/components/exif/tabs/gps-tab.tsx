"use client";

import { motion } from "framer-motion";
import { ExternalLink, MapPin, Mountain } from "lucide-react";
import type { GpsCoordinates } from "@/types/exif";

type GpsTabProps = {
  gps: GpsCoordinates | null;
};

function mapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

function osmEmbedUrl(lat: number, lng: number): string {
  const delta = 0.01;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function GpsTab({ gps }: GpsTabProps) {
  if (!gps) {
    return (
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-4 py-10 text-center">
        <MapPin className="mx-auto mb-3 size-8 text-zinc-600" />
        <p className="text-sm font-medium text-zinc-300">No GPS coordinates in this file</p>
        <p className="mt-2 text-xs text-zinc-500">
          Location tags are often stripped by social apps before upload.
        </p>
      </div>
    );
  }

  const { latitude, longitude, altitude } = gps;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/35 p-4">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Latitude</p>
          <p className="mt-1 font-mono text-sm text-zinc-100">{latitude.toFixed(6)}°</p>
        </div>
        <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/35 p-4">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Longitude</p>
          <p className="mt-1 font-mono text-sm text-zinc-100">{longitude.toFixed(6)}°</p>
        </div>
        <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/35 p-4">
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-zinc-500">
            <Mountain className="size-3.5" />
            Altitude
          </p>
          <p className="mt-1 font-mono text-sm text-zinc-100">
            {altitude != null ? `${altitude.toFixed(1)} m` : "—"}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/50">
        <iframe
          title="Map preview"
          src={osmEmbedUrl(latitude, longitude)}
          className="h-56 w-full border-0 sm:h-64"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <a
        href={mapsUrl(latitude, longitude)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-background px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <ExternalLink className="size-4" />
        Open in Google Maps
      </a>
    </motion.div>
  );
}
