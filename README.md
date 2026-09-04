<div align="center">

# 📷 MetaDate

**Inspect camera settings, GPS, and privacy tags in your browser. Strip metadata before you share.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-green?style=flat-square&logo=shield)](https://github.com/wahidulsami/metadate-detcted)

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-it-works--privacy-guarantee">Privacy Model</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

</div>

---

## 🌟 Overview

Every photo you take carries hidden digital footprints: precise GPS coordinates of your home or workplace, camera serial numbers, creator identities, software history, and exact timestamps.

Most online metadata viewers upload your photos to remote servers to parse them. **MetaDate is completely different.**

**MetaDate** is a modern, open-source, client-side EXIF metadata inspector and privacy sanitization tool. All parsing, rendering, and metadata stripping is performed directly **inside your browser's memory** via Web APIs (`FileReader`, `Canvas`, and typed `ArrayBuffer`). Your images are never uploaded, logged, or sent over any network.

---

## ✨ Key Features

- 🛡️ **Privacy Risk Audit & Score**: Real-time 0–100 privacy risk gauge that flags sensitive data points (embedded GPS coordinates, camera serial numbers, author names, software edit history).
- 🔍 **Comprehensive EXIF, IPTC & XMP Extraction**:
  - **Camera & Optics**: Make, model, lens profile, focal length, 35mm equivalent.
  - **Exposure & Settings**: Aperture ($f$-number), shutter speed, ISO sensitivity, exposure mode, metering, white balance, flash status.
  - **Color & Technical Attributes**: Color space (sRGB, Display P3), image dimensions, megapixel count, bit depth, compression, orientation.
- 📍 **GPS & Geolocation Inspector**:
  - Interactive coordinates readout with latitude, longitude, and altitude.
  - Quick-action direct links to open the exact coordinates in **OpenStreetMap** or **Google Maps**.
- 🧹 **1-Click Metadata Stripper (Scrubber)**:
  - Strip all EXIF, GPS, IPTC, and XMP tags directly in-browser.
  - Download clean, privacy-safe image copies without recompression artifacts.
- ⚖️ **Side-by-Side Comparison**: Compare metadata fields across two images to spot differences in camera gear, exposure, or privacy exposure.
- 🎞️ **Multi-Image Filmstrip**: Drag-and-drop single files or entire batches with seamless switching via the interactive carousel/filmstrip.
- 📤 **Flexible Export Options**:
  - Export structured metadata to **JSON** or **CSV**.
  - One-click copy formatted EXIF summary to your clipboard.
- 🌓 **Modern Dark Aesthetic**: Clean, responsive UI with fluid transitions powered by Framer Motion and Tailwind CSS v4.

---

## 🔒 How It Works & Privacy Guarantee

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

1. **Zero Server Uploads**: The application is built as a **static single-page application (SPA)**. There are zero backend API endpoints.
2. **In-Memory Parsing**: Files are read into transient `ArrayBuffer` instances and freed when replaced.
3. **No External Tracking**: No user tracking, no session cookies, and no third-party analytic telemetry scripts.

---

## 🗂️ Supported File Formats

| Format | Extension | Metadata Parsing | Stripping / Sanitization |
| :--- | :--- | :---: | :---: |
| **JPEG** | `.jpg`, `.jpeg` | ✅ Full (EXIF, IPTC, XMP) | ✅ Supported |
| **PNG** | `.png` | ✅ Full (tEXt, iTXt, pHYs) | ✅ Supported |
| **WebP** | `.webp` | ✅ Full (EXIF, XMP) | ✅ Supported |
| **TIFF** | `.tiff`, `.tif` | ✅ Full (TIFF Headers) | ✅ Supported |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (Static Export / App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **EXIF Engine**: [ExifReader](https://github.com/mattiasw/ExifReader)
- **Components**: Radix-inspired primitives and `@base-ui/react`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.17.0 or higher (v20+ or v24+ recommended)
- **Package Manager**: `npm`, `pnpm`, or `bun`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/wahidulsami/metadate-detcted.git
   cd metadate-detcted
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build & Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the Next.js development server with Turbopack |
| `npm run build` | Compiles the project and produces a static HTML export in `./out` |
| `npm run start` | Serves the production build locally |
| `npm run lint` | Runs ESLint checks across TypeScript and React code |

---

## 🌐 Deployment

Because **MetaDate** exports to a pure static bundle (`output: "export"`), it can be deployed to any static host or CDN.

### Cloudflare Pages / Workers
This repository includes a [`wrangler.jsonc`](./wrangler.jsonc) configured for Cloudflare Pages:
- **Build Command**: `npm run build`
- **Build Output Directory**: `out`
- **Environment Variable**: `NEXT_TELEMETRY_DISABLED=1`

### Vercel
1. Import the repository into Vercel.
2. The framework preset will automatically detect Next.js.
3. Deploy!

### GitHub Pages
Deploy the compiled `./out` folder using the standard `actions/deploy-pages` workflow.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

<div align="center">
  <sub>Built with ❤️ for privacy and photography enthusiasts by <a href="https://github.com/wahidulsami">Wahidul Islam Sami</a>.</sub>
</div>
