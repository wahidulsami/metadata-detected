"use client";

import { motion } from "framer-motion";
import { Fingerprint, Layers, Palette, Radar } from "lucide-react";

const FEATURES = [
  { icon: Radar, title: "Privacy radar", desc: "Score & flag GPS, serials, timestamps" },
  { icon: Palette, title: "Color DNA", desc: "Dominant palette + luminance curve" },
  { icon: Layers, title: "Batch roll", desc: "Drop multiple frames, switch instantly" },
  { icon: Fingerprint, title: "File hash", desc: "SHA-256 fingerprint in-browser" },
];

export function AppHeader() {
  return (
    <header className="relative mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-orange-400/90">
            MetaDate · client-side darkroom
          </p>
          <h1 className="font-display mt-3 text-[clamp(2.25rem,6vw,3.75rem)] font-extrabold leading-[0.95] tracking-tight text-[#faf7f2]">
            Read the
            <span className="block bg-gradient-to-r from-orange-400 via-amber-200 to-teal-300 bg-clip-text text-transparent">
              hidden layer
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-stone-400 sm:text-base">
            Not another gray dashboard. A film-forward EXIF lab — inspect, compare, export,
            and scrub metadata before your images leave the browser.
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
          className="grid grid-cols-2 gap-2 sm:gap-3 lg:max-w-md"
        >
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <li
              key={title}
              className="panel-cut border border-stone-800/80 bg-stone-950/60 p-3 backdrop-blur-sm"
            >
              <Icon className="size-4 text-orange-400" />
              <p className="mt-2 text-xs font-semibold text-stone-100">{title}</p>
              <p className="mt-0.5 text-[10px] leading-snug text-stone-500">{desc}</p>
            </li>
          ))}
        </motion.ul>
      </div>
    </header>
  );
}
