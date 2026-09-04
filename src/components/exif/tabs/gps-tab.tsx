"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, ExternalLink, Globe, MapPin, Mountain } from "lucide-react";
import type { GpsCoordinates } from "@/types/exif";
import { Button } from "@/components/ui/button";

type GpsTabProps = {
  gps: GpsCoordinates | null;
};

function mapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

function osmUrl(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
}

function osmEmbedUrl(lat: number, lng: number): string {
  const delta = 0.008;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function decimalToDms(deg: number, isLat: boolean): string {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
  const direction = isLat ? (deg >= 0 ? "N" : "S") : (deg >= 0 ? "E" : "W");
  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}

export function GpsTab({ gps }: GpsTabProps) {
  const [copied, setCopied] = useState(false);

  if (!gps) {
    return (
      <div className="empty-state">
        <MapPin className="mx-auto mb-3 size-8 text-zinc-600" />
        <p className="font-mono text-sm font-semibold text-zinc-300">NO GPS COORDINATES</p>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-zinc-500">
          This image contains no geotagging data. Social apps (Instagram, X, WhatsApp) strip location metadata automatically.
        </p>
      </div>
    );
  }

  const { latitude, longitude, altitude } = gps;
  const dmsLat = decimalToDms(latitude, true);
  const dmsLng = decimalToDms(longitude, false);
  const coordString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

  const copyCoordinates = async () => {
    await navigator.clipboard.writeText(coordString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Telemetry Coordinate Cards */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3">
          <p className="font-mono text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">Latitude</p>
          <p className="mt-1 font-mono text-sm font-bold text-teal-300">{latitude.toFixed(6)}°</p>
          <p className="mt-0.5 font-mono text-[11px] text-zinc-400">{dmsLat}</p>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3">
          <p className="font-mono text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">Longitude</p>
          <p className="mt-1 font-mono text-sm font-bold text-teal-300">{longitude.toFixed(6)}°</p>
          <p className="mt-0.5 font-mono text-[11px] text-zinc-400">{dmsLng}</p>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3">
          <p className="flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            <Mountain className="size-3.5 text-orange-400" />
            Altitude
          </p>
          <p className="mt-1 font-mono text-sm font-bold text-zinc-100">
            {altitude != null ? `${altitude.toFixed(1)} m` : "Sea level / N/A"}
          </p>
          <p className="mt-0.5 font-mono text-[11px] text-zinc-400">
            {altitude != null ? `${(altitude * 3.28084).toFixed(1)} ft MSL` : "—"}
          </p>
        </div>
      </div>

      {/* Embedded Map Visualizer */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950">
        <div className="absolute top-2.5 left-2.5 z-10 rounded-md border border-zinc-800 bg-zinc-950/90 px-2 py-0.5 font-mono text-[10px] text-teal-300 backdrop-blur-md">
          ● OpenStreetMap
        </div>
        <iframe
          title="Map preview"
          src={osmEmbedUrl(latitude, longitude)}
          className="h-48 w-full border-0 sm:h-60"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Quick Launch & Copy Links */}
      <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <a
            href={mapsUrl(latitude, longitude)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 font-mono text-xs text-zinc-300 hover:border-zinc-700 hover:text-white sm:h-9"
          >
            <ExternalLink className="size-3.5" />
            <span>Google Maps</span>
          </a>

          <a
            href={osmUrl(latitude, longitude)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 font-mono text-xs text-zinc-300 hover:border-zinc-700 hover:text-white sm:h-9"
          >
            <Globe className="size-3.5 text-teal-400" />
            <span>OpenStreetMap</span>
          </a>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => void copyCoordinates()}
          className="h-10 w-full gap-1.5 border-zinc-800 bg-zinc-900/80 font-mono text-xs text-zinc-300 hover:border-zinc-700 hover:text-white sm:h-9 sm:w-auto"
        >
          {copied ? <Check className="size-3.5 text-teal-400" /> : <Copy className="size-3.5" />}
          <span>{copied ? "Coordinates Copied!" : "Copy Coordinates"}</span>
        </Button>
      </div>
    </motion.div>
  );
}
