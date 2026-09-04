import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MetaDate — EXIF Viewer & Privacy Stripper",
    short_name: "MetaDate",
    description:
      "Inspect camera settings, GPS, and privacy tags in your browser. Strip metadata before you share.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
