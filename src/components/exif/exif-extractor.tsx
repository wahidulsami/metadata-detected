"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DropZone } from "@/components/exif/drop-zone";
import { AppHeader } from "@/components/exif/app-header";
import { FilmStrip } from "@/components/exif/film-strip";
import { ImagePreviewPanel } from "@/components/exif/image-preview-panel";
import { MetadataPanel } from "@/components/exif/metadata-panel";
import { MetadataLoadingSkeleton } from "@/components/exif/loading-skeleton";
import { parseImageExif } from "@/lib/exif-utils";
import { stripExifAndDownload } from "@/lib/strip-exif";
import { validateImageFile } from "@/lib/validate-image";
import { getSampleParsedData } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import type { ParsedImageExif } from "@/types/exif";
import { SeoContent } from "@/components/exif/seo-content";

export function ExifExtractorApp() {
  const [items, setItems] = useState<ParsedImageExif[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripping, setStripping] = useState(false);
  const [stripAlling, setStripAlling] = useState(false);
  const [stripError, setStripError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeItem = items.find((i) => i.id === activeId) ?? items[0] ?? null;

  const revokePreview = useCallback((url: string | null) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }, []);

  const clearAll = useCallback(() => {
    items.forEach((item) => revokePreview(item.previewUrl));
    setItems([]);
    setActiveId(null);
    setError(null);
    setStripError(null);
  }, [items, revokePreview]);

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        const itemToRemove = prev.find((i) => i.id === id);
        if (itemToRemove) revokePreview(itemToRemove.previewUrl);
        const next = prev.filter((i) => i.id !== id);
        if (activeId === id) {
          setActiveId(next.length > 0 ? next[0].id : null);
        }
        return next;
      });
    },
    [activeId, revokePreview]
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      setError(null);
      setStripError(null);

      const validFiles: File[] = [];
      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.ok) {
          setError(validation.message);
          return;
        }
        validFiles.push(file);
      }

      setLoading(true);

      try {
        const parsedList: ParsedImageExif[] = [];
        for (const file of validFiles) {
          const previewUrl = URL.createObjectURL(file);
          try {
            const parsed = await parseImageExif(file, previewUrl);
            parsedList.push(parsed);
          } catch {
            revokePreview(previewUrl);
            setError(`Could not read '${file.name}'. The file may be corrupted or unsupported.`);
          }
        }

        if (parsedList.length > 0) {
          setItems((prev) => [...prev, ...parsedList]);
          setActiveId(parsedList[0].id);
        }
      } finally {
        setLoading(false);
      }
    },
    [revokePreview]
  );

  const handleStripActive = useCallback(async () => {
    if (!activeItem) return;
    setStripError(null);
    setStripping(true);
    try {
      await stripExifAndDownload(activeItem.previewUrl, activeItem.fileName, activeItem.mimeType);
    } catch (err) {
      setStripError(err instanceof Error ? err.message : "Failed to strip metadata.");
    } finally {
      setStripping(false);
    }
  }, [activeItem]);

  const handleStripAll = useCallback(async () => {
    if (items.length === 0) return;
    setStripError(null);
    setStripAlling(true);
    try {
      for (const item of items) {
        await stripExifAndDownload(item.previewUrl, item.fileName, item.mimeType);
        await new Promise((r) => setTimeout(r, 200));
      }
    } catch (err) {
      setStripError(err instanceof Error ? err.message : "Failed to strip batch metadata.");
    } finally {
      setStripAlling(false);
    }
  }, [items]);

  const handleLoadSample = useCallback(() => {
    const sample = getSampleParsedData();
    setItems((prev) => [sample, ...prev.filter((i) => i.id !== sample.id)]);
    setActiveId(sample.id);
    setError(null);
  }, []);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const clipboardItems = e.clipboardData?.items;
      if (!clipboardItems) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < clipboardItems.length; i++) {
        const item = clipboardItems[i];
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length > 0) {
        e.preventDefault();
        void handleFiles(pastedFiles);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handleFiles]);

  const [mobileView, setMobileView] = useState<"all" | "canvas" | "meta">("all");

  return (
    <div className="relative flex min-h-dvh w-full max-w-full flex-col overflow-x-clip bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-orange-500/8 blur-[120px]" />
        <div className="absolute right-0 top-32 h-[min(450px,50vw)] w-[min(450px,50vw)] rounded-full bg-teal-500/5 blur-[140px]" />
      </div>

      <AppHeader
        activeItem={activeItem}
        onOpenImport={() => fileInputRef.current?.click()}
        onClearAll={clearAll}
        onStripActive={handleStripActive}
        stripping={stripping}
        onLoadSample={handleLoadSample}
      />

      {items.length > 0 && (
        <FilmStrip
          items={items}
          activeId={activeItem?.id ?? items[0].id}
          onSelect={(id) => setActiveId(id)}
          onRemove={removeItem}
          onAddMore={() => fileInputRef.current?.click()}
          onStripAll={handleStripAll}
          strippingAll={stripAlling}
        />
      )}

      <main className="app-gutter mx-auto flex w-full min-w-0 max-w-7xl flex-1 flex-col py-2.5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:py-5">
        <AnimatePresence mode="wait">
          {items.length === 0 && !loading && (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mx-auto w-full max-w-4xl"
            >
              <DropZone
                onFilesSelect={(files) => void handleFiles(files)}
                onLoadSample={handleLoadSample}
                disabled={loading}
                error={error}
              />
            </motion.div>
          )}

          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MetadataLoadingSkeleton />
            </motion.div>
          )}

          {activeItem && !loading && (
            <div className="flex flex-1 flex-col gap-3">
              {/* Mobile View Mode Switcher (< lg) */}
              <div className="flex items-center justify-center lg:hidden">
                <div className="inline-flex rounded-xl border border-zinc-800 bg-zinc-900/90 p-1 shadow-lg backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setMobileView("all")}
                    className={cn(
                      "rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-colors",
                      mobileView === "all"
                        ? "bg-zinc-800 text-orange-300 shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    )}
                  >
                    Both Views
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileView("canvas")}
                    className={cn(
                      "rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-colors",
                      mobileView === "canvas"
                        ? "bg-zinc-800 text-orange-300 shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    )}
                  >
                    Canvas Focus
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileView("meta")}
                    className={cn(
                      "rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-colors",
                      mobileView === "meta"
                        ? "bg-zinc-800 text-teal-300 shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    )}
                  >
                    Inspector Focus
                  </button>
                </div>
              </div>

              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid flex-1 grid-cols-1 items-start gap-4 lg:grid-cols-2"
              >
                <div className={cn(mobileView === "meta" && "hidden lg:block")}>
                  <ImagePreviewPanel
                    data={activeItem}
                    onClear={() => removeItem(activeItem.id)}
                    onStripExif={handleStripActive}
                    stripping={stripping}
                  />
                </div>

                <div className={cn(mobileView === "canvas" && "hidden lg:block")}>
                  <MetadataPanel data={activeItem} allLoadedItems={items} />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {stripError && (
          <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 font-mono text-xs text-red-300">
            {stripError}
          </p>
        )}

        <SeoContent />
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/tiff"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            void handleFiles(Array.from(e.target.files));
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}
