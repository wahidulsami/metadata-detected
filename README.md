<div align="center">

# 📷 ExifGuard

**Inspect camera settings, GPS, and privacy tags in your browser. Strip metadata before you share.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-green?style=flat-square&logo=shield)](https://github.com/wahidulsami/exif-guard)

<p align="center">
  <a href="#features">Features</a> •
  <a href="#privacy">Privacy</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#license">License</a>
</p>

</div>

---

## Overview

Every photo you take carries hidden digital footprints: precise GPS coordinates, camera serial numbers, creator identities, software history, and exact timestamps.

Most online metadata viewers upload your photos to remote servers to parse them. **ExifGuard is completely different.**

**ExifGuard** is a modern, open-source, client-side EXIF metadata inspector and privacy sanitization tool. All parsing, rendering, and metadata stripping is performed directly **inside your browser's memory** via Web APIs. Your images are never uploaded, logged, or sent over any network.

---

## Features

- **Privacy Risk Audit & Score**: Real-time 0–100 privacy risk gauge that flags sensitive data points (embedded GPS coordinates, camera serial numbers, author names, software edit history).
- **Comprehensive EXIF, IPTC & XMP Extraction**:
  - Camera & Optics: Make, model, lens profile, focal length, 35mm equivalent.
  - Exposure & Settings: Aperture, shutter speed, ISO sensitivity, exposure mode, metering, white balance, flash status.
  - Color & Technical: Color space, image dimensions, megapixel count, bit depth, compression, orientation.
- **GPS & Geolocation Inspector**: Interactive coordinates readout with direct links to OpenStreetMap or Google Maps.
- **1-Click Metadata Stripper**: Strip all EXIF, GPS, IPTC, and XMP tags. Download clean, privacy-safe images. (Note: JPEG output re-compresses at 0.92 quality)
- **Side-by-Side Comparison**: Compare metadata fields across two images.
- **Multi-Image Filmstrip**: Drag-and-drop single files or entire batches.
- **Export Options**: Export to JSON or CSV. One-click copy formatted EXIF summary.
- **Modern Dark Aesthetic**: Clean, responsive UI with fluid transitions.

---

## Privacy

```
[ Your Device ]
       │
  (Drop Image)
       ▼
 [ HTML5 FileReader ] ────> In-Memory ArrayBuffer
                                  │
                   ┌──────────────┴──────────────┐
                   ▼                             ▼
         [ ExifReader Parser ]         [ HTML5 Canvas Engine ]
         - Extract EXIF, GPS, XMP      - Strip metadata tags
         - Compute Privacy Score       - Generate sanitized image
                   │                             │
                   ▼                             ▼
          [ Interactive UI ]           [ Clean File Download ]
```

- **Zero Server Uploads**: Static single-page application with no backend.
- **In-Memory Parsing**: Files read into transient `ArrayBuffer` instances.
- **No External Tracking**: No analytics, no cookies, no telemetry.

---

## Supported File Formats

| Format | Extension | Parsing | Stripping |
| :--- | :--- | :---: | :---: |
| **JPEG** | `.jpg`, `.jpeg` | ✅ | ✅ |
| **PNG** | `.png` | ✅ | ✅ |
| **WebP** | `.webp` | ✅ | ✅ |
| **TIFF** | `.tiff`, `.tif` | ✅ | ❌ (browser canvas limitation) |

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (Static Export / App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **EXIF Engine**: [ExifReader](https://github.com/mattiasw/ExifReader)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)

---

## Getting Started

### Prerequisites

- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **Package Manager**: `npm`, `pnpm`, or `bun`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/wahidulsami/exif-guard.git
   cd exif-guard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

---

## Build & Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Development server with Turbopack |
| `npm run build` | Static HTML export to `./out` |
| `npm run start` | Serve production build locally |
| `npm run lint` | ESLint checks |

---

## Deployment

**ExifGuard** exports to a pure static bundle (`output: "export"`), deployable to any static host.

### Cloudflare Pages
- Build Command: `npm run build`
- Output Directory: `out`
- Node.js Version: `20+` or `24+`

### Vercel
Import the repository. Next.js is auto-detected.

### GitHub Pages
Deploy the `./out` folder via `actions/deploy-pages`.

---

## License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

<div align="center">
  <sub>Built with ❤️ for privacy and photography enthusiasts by <a href="https://github.com/wahidulsami">Wahidul Islam Sami</a>.</sub>
</div>
