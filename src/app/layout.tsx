import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://metadate.pages.dev"),
  title: {
    default: "ExifGuard — Free Online EXIF Viewer & Photo Privacy Stripper",
    template: "%s | ExifGuard",
  },
  description:
    "Free, 100% private in-browser EXIF viewer and photo metadata remover. Inspect camera settings, exposure specs, and GPS location. Strip metadata with 1 click. Zero uploads.",
  keywords: [
    "exif viewer",
    "exif metadata remover",
    "online exif reader",
    "photo metadata viewer",
    "remove exif data",
    "remove photo location",
    "gps photo metadata",
    "strip image metadata online",
    "photo privacy scanner",
    "camera settings inspector",
    "free exif scrubber",
    "client side exif tool",
    "jpeg exif viewer",
    "png metadata viewer",
    "webp exif remover",
    "exifguard",
  ],
  authors: [{ name: "Wahidul Islam Sami", url: "https://github.com/wahidulsami" }],
  creator: "Wahidul Islam Sami",
  publisher: "Wahidul Islam Sami",
  applicationName: "ExifGuard",
  category: "Photography & Privacy Utility",
  classification: "Photography, Privacy, Web Utility",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://metadate.pages.dev",
    siteName: "ExifGuard",
    title: "ExifGuard — Free Online EXIF Viewer & Photo Privacy Stripper",
    description:
      "Inspect camera settings, GPS location, and privacy tags in your browser. Strip metadata before you share photos. 100% client-side with zero uploads.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "ExifGuard — Free Online EXIF Viewer & Metadata Remover",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ExifGuard — Free Online EXIF Viewer & Photo Privacy Stripper",
    description:
      "Inspect camera settings, GPS location, and privacy tags in your browser. Strip metadata before you share photos. 100% client-side with zero uploads.",
    images: ["/og-image.svg"],
    creator: "@wahidulsami",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/logo.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.webmanifest",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://metadate.pages.dev/#webapp",
      "name": "ExifGuard",
      "url": "https://metadate.pages.dev",
      "description":
        "Zero-knowledge in-browser EXIF viewer and metadata scrubber. Inspect camera settings, GPS tags, and strip metadata before sharing.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript and HTML5 Canvas support.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "featureList": [
        "In-browser EXIF, IPTC, and XMP extraction",
        "Interactive GPS coordinate mapping and external map links",
        "Real-time privacy risk audit and scoring (0–100)",
        "One-click metadata stripper and sanitized file export",
        "Side-by-side metadata comparison",
        "Batch processing via interactive filmstrip",
        "Export metadata to JSON and CSV",
      ],
      "author": {
        "@type": "Person",
        "name": "Wahidul Islam Sami",
        "url": "https://github.com/wahidulsami",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://metadate.pages.dev/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Does ExifGuard upload my photos to any server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. ExifGuard works 100% in your browser using HTML5 File and Canvas APIs. Your images are parsed in memory and never leave your device.",
          },
        },
        {
          "@type": "Question",
          "name": "How do I remove GPS location and EXIF data from a photo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Drop your image into ExifGuard, inspect the detected tags, and click 'Clean & Download'. ExifGuard strips all EXIF, GPS, and XMP metadata without uploading your file.",
          },
        },
        {
          "@type": "Question",
          "name": "Which image formats are supported by ExifGuard?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ExifGuard supports JPEG (.jpg, .jpeg), PNG (.png), WebP (.webp), and TIFF (.tiff, .tif) files.",
          },
        },
      ],
    },
  ],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-background antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
