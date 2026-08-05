"use client";

import { motion } from "framer-motion";
import { Aperture, ShieldCheck, Sparkles } from "lucide-react";

export function AppHeader() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pt-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-3"
      >
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-900/40 px-3 py-1 text-xs font-medium tracking-wide text-zinc-400 backdrop-blur-md">
          <Sparkles className="size-3.5 text-zinc-300" />
          Client-side only · Your files never leave this device
        </div>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl sm:leading-tight">
          EXIF Metadata Extractor
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          Inspect camera settings, GPS, and hidden tags in seconds. Strip metadata
          before sharing — premium privacy tooling in your browser.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="flex flex-wrap gap-3 text-xs text-zinc-500"
      >
        <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800/60 bg-zinc-900/30 px-2.5 py-1">
          <Aperture className="size-3.5" />
          JPEG · PNG · WEBP · TIFF
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800/60 bg-zinc-900/30 px-2.5 py-1">
          <ShieldCheck className="size-3.5" />
          Zero server uploads
        </span>
      </motion.div>
    </header>
  );
}
