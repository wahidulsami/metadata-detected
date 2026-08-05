"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DropZone } from "@/components/exif/drop-zone";
import { AppHeader } from "@/components/exif/app-header";
import { ImagePreviewPanel } from "@/components/exif/image-preview-panel";
import { MetadataPanel } from "@/components/exif/metadata-panel";
import { MetadataLoadingSkeleton } from "@/components/exif/loading-skeleton";
import { parseImageExif } from "@/lib/exif-utils";
import { stripExifAndDownload } from "@/lib/strip-exif";
import { validateImageFile } from "@/lib/validate-image";
import type { ParsedImageExif } from "@/types/exif";

export function ExifExtractorApp() {
  const [data, setData] = useState<ParsedImageExif | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripping, setStripping] = useState(false);
  const [stripError, setStripError] = useState<string | null>(null);

  const revokePreview = useCallback((url: string | null) => {
    if (url) URL.revokeObjectURL(url);
  }, []);

  const clearImage = useCallback(() => {
    setData((prev) => {
      revokePreview(prev?.previewUrl ?? null);
      return null;
    });
    setError(null);
    setStripError(null);
  }, [revokePreview]);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setStripError(null);

      const validation = validateImageFile(file);
      if (!validation.ok) {
        setError(validation.message);
        return;
      }

      setLoading(true);
      clearImage();

      const previewUrl = URL.createObjectURL(file);

      try {
        const parsed = await parseImageExif(file, previewUrl);
        setData(parsed);
      } catch {
        revokePreview(previewUrl);
        setError("Could not read this image. The file may be corrupted or unsupported.");
      } finally {
        setLoading(false);
      }
    },
    [clearImage, revokePreview]
  );

  const handleStrip = useCallback(async () => {
    if (!data) return;
    setStripError(null);
    setStripping(true);
    try {
      await stripExifAndDownload(data.previewUrl, data.fileName, data.mimeType);
    } catch (err) {
      setStripError(err instanceof Error ? err.message : "Failed to strip metadata.");
    } finally {
      setStripping(false);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      if (data?.previewUrl) revokePreview(data.previewUrl);
    };
  }, [data?.previewUrl, revokePreview]);

  return (
    <div className="relative min-h-screen overflow-hidden pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-zinc-700/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-zinc-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-zinc-600/5 blur-3xl" />
      </div>

      <AppHeader />

      <main className="mx-auto mt-8 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!data && !loading && (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <DropZone onFilesSelect={(files) => void handleFile(files[0])} disabled={loading} error={error} />
            </motion.div>
          )}

          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MetadataLoadingSkeleton />
            </motion.div>
          )}

          {data && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
            >
              <ImagePreviewPanel
                data={data}
                onClear={clearImage}
                onStripExif={handleStrip}
                stripping={stripping}
              />
              <MetadataPanel data={data} />
            </motion.div>
          )}
        </AnimatePresence>

        {stripError && (
          <p className="mt-4 text-sm text-red-400/90">{stripError}</p>
        )}

        {data && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex justify-center"
          >
            <button
              type="button"
              onClick={clearImage}
              className="text-xs text-zinc-500 underline-offset-4 hover:text-zinc-300 hover:underline"
            >
              Analyze another image
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
