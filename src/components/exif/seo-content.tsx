import { Shield, Camera, MapPin, ChevronDown, Lock } from "lucide-react";

export function SeoContent() {
  return (
    <section className="mt-16 w-full border-t border-zinc-800/80 pt-12 text-zinc-300">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* SEO Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
            <Lock className="size-3.5" />
            <span>Zero-Knowledge In-Browser Privacy</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
            Why Inspect and Strip Photo Metadata?
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-400">
            Every photo taken with modern smartphones and digital cameras contains hidden EXIF, IPTC, and XMP metadata.
            ExifGuard allows you to analyze exposure specs, view embedded GPS locations, and sanitize images before sharing them publicly.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3 backdrop-blur-sm">
            <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <MapPin className="size-5" />
            </div>
            <h3 className="text-base font-semibold text-zinc-100">Stop Geolocation Tracking</h3>
            <p className="text-xs leading-relaxed text-zinc-400">
              Smartphones automatically tag photos with exact GPS coordinates (latitude, longitude, and altitude).
              Sharing raw photos online can unintentionally reveal your home address, workplace, or travel habits.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3 backdrop-blur-sm">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Shield className="size-5" />
            </div>
            <h3 className="text-base font-semibold text-zinc-100">100% In-Browser &amp; Private</h3>
            <p className="text-xs leading-relaxed text-zinc-400">
              Unlike cloud-based tools that upload your pictures to third-party servers, ExifGuard runs entirely in your local browser memory.
              No uploads, no databases, no tracking scripts, and no privacy compromises.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3 backdrop-blur-sm">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Camera className="size-5" />
            </div>
            <h3 className="text-base font-semibold text-zinc-100">Deep Camera Diagnostics</h3>
            <p className="text-xs leading-relaxed text-zinc-400">
              Inspect critical photography metrics including shutter speed, aperture ($f$-stop), ISO, focal length,
              metering mode, color space, device serial numbers, and software editing history in seconds.
            </p>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="space-y-6 pt-4">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-zinc-100">Frequently Asked Questions</h3>
            <p className="text-xs text-zinc-400">Everything you need to know about photo metadata and privacy.</p>
          </div>

          <div className="space-y-3">
            <details className="group rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 open:bg-zinc-900/60 transition-colors">
              <summary className="flex cursor-pointer items-center justify-between font-medium text-zinc-200 text-sm">
                <span>Does ExifGuard upload or store my pictures on any server?</span>
                <ChevronDown className="size-4 text-zinc-500 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                <strong>No, never.</strong> All image processing, EXIF tag extraction, and metadata stripping take place locally on your device via HTML5 File, Canvas, and ArrayBuffer Web APIs. Your images never traverse any network.
              </p>
            </details>

            <details className="group rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 open:bg-zinc-900/60 transition-colors">
              <summary className="flex cursor-pointer items-center justify-between font-medium text-zinc-200 text-sm">
                <span>How do I remove EXIF data and GPS coordinates from a photo?</span>
                <ChevronDown className="size-4 text-zinc-500 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                Simply drag and drop your image into the drop zone. ExifGuard immediately inspects all embedded tags and calculates a privacy risk score. Click <strong>&quot;Strip &amp; Download&quot;</strong> to export a clean copy stripped of all personal and device metadata.
              </p>
            </details>

            <details className="group rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 open:bg-zinc-900/60 transition-colors">
              <summary className="flex cursor-pointer items-center justify-between font-medium text-zinc-200 text-sm">
                <span>Which file formats are supported?</span>
                <ChevronDown className="size-4 text-zinc-500 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                ExifGuard supports <strong>JPEG (.jpg, .jpeg)</strong>, <strong>PNG (.png)</strong>, <strong>WebP (.webp)</strong>, and <strong>TIFF (.tiff, .tif)</strong> files. You can also drag and drop multiple images at once to inspect them in batch mode.
              </p>
            </details>

            <details className="group rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 open:bg-zinc-900/60 transition-colors">
              <summary className="flex cursor-pointer items-center justify-between font-medium text-zinc-200 text-sm">
                <span>Can I export or compare metadata across different photos?</span>
                <ChevronDown className="size-4 text-zinc-500 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                Yes! You can export full metadata structures to <strong>JSON</strong> or <strong>CSV</strong>, copy quick summaries to your clipboard, or use the <strong>Compare Tab</strong> to evaluate two photos side-by-side.
              </p>
            </details>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-zinc-800/60 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span>ExifGuard — Open Source &amp; MIT Licensed</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/wahidulsami/metadate-detcted"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              GitHub Repository
            </a>
            <span>·</span>
            <span>Created with ❤️ by Wahidul Islam Sami</span>
          </div>
        </div>
      </div>
    </section>
  );
}
