import type { ParsedImageExif } from "@/types/exif";

/**
 * Generates an SVG data URL for a sample camera photo with darkroom palette.
 */
function createSampleSvgUrl(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="40%" stop-color="#1e1b4b"/>
      <stop offset="70%" stop-color="#311042"/>
      <stop offset="100%" stop-color="#f97316"/>
    </linearGradient>
    <radialGradient id="sun" cx="75%" cy="65%" r="20%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#sky)"/>
  <circle cx="900" cy="520" r="140" fill="url(#sun)"/>
  <path d="M0 620 L300 480 L550 580 L800 420 L1050 560 L1200 490 L1200 800 L0 800 Z" fill="#09090b" opacity="0.95"/>
  <path d="M0 680 L250 590 L600 660 L850 540 L1100 640 L1200 600 L1200 800 L0 800 Z" fill="#040405"/>
  <text x="60" y="100" fill="#f97316" font-family="monospace" font-size="22" letter-spacing="4">METADATE // SAMPLE PHOTO DEMO</text>
  <text x="60" y="140" fill="#cbd5e1" font-family="sans-serif" font-size="16" opacity="0.8">SONY ILCE-7RM5 · FE 24-70mm F2.8 GM II · 50mm · f/2.8 · 1/250s · ISO 100</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getSampleParsedData(): ParsedImageExif {
  return {
    id: "sample-demo-photo",
    fileName: "DSC04892_GoldenHour_SonyA7R5.jpg",
    fileSize: 34_829_140, // 33.2 MB
    mimeType: "image/jpeg",
    previewUrl: createSampleSvgUrl(),
    width: 9504,
    height: 6336,
    hasExif: true,
    aspectLabel: "3:2",
    fileHash: "8f4a1c5d9e3b2a704f5e6d8c9b0a1f2e3d4c5b6a708192a3b4c5d6e7f8a9b0c1",
    dominantColors: ["#0f172a", "#311042", "#f97316", "#fef08a", "#09090b", "#1e1b4b"],
    histogram: [
      0.95, 0.82, 0.74, 0.65, 0.58, 0.49, 0.42, 0.38, 0.35, 0.32, 0.30, 0.28, 0.29, 0.31,
      0.35, 0.40, 0.45, 0.52, 0.60, 0.68, 0.75, 0.82, 0.88, 0.92, 0.96, 0.89, 0.76, 0.62,
      0.45, 0.32, 0.20, 0.12,
    ],
    overview: [
      { label: "Camera Model", value: "Sony ILCE-7RM5 (Alpha 7R V)" },
      { label: "Lens", value: "FE 24-70mm F2.8 GM II (SEL2470GM2)" },
      { label: "ISO", value: "100" },
      { label: "Aperture", value: "f/2.8" },
      { label: "Shutter Speed", value: "1/250 sec" },
      { label: "Focal Length", value: "50.0 mm" },
      { label: "Capture Date", value: "2026:08:14 18:42:19" },
      { label: "Resolution", value: "9,504 × 6,336 (60.2 MP)" },
    ],
    gps: {
      latitude: 37.774929,
      longitude: -122.419416,
      altitude: 48.5,
    },
    privacy: {
      score: 42,
      grade: "D",
      flags: [
        {
          id: "gps",
          label: "Precise GPS Coordinates Leaked",
          severity: "high",
          detail: "Contains exact latitude (37.7749°) and longitude (-122.4194°) with altitude telemetry.",
        },
        {
          id: "serial",
          label: "Hardware Camera Serial Number",
          severity: "high",
          detail: "Body Serial #4829104 and Lens Serial #9018420 uniquely identify your physical gear.",
        },
        {
          id: "owner",
          label: "Artist & Copyright Identity",
          severity: "medium",
          detail: "Owner/Artist metadata contains personal name 'Alex Morgan Studios'.",
        },
        {
          id: "date",
          label: "Exact Sub-Second Timestamp",
          severity: "low",
          detail: "Captures original creation date/time down to milliseconds.",
        },
      ],
    },
    tableRows: [
      { category: "Camera", name: "Make", description: "Sony", value: "Sony" },
      { category: "Camera", name: "Model", description: "ILCE-7RM5", value: "ILCE-7RM5" },
      { category: "Camera", name: "LensModel", description: "FE 24-70mm F2.8 GM II", value: "FE 24-70mm F2.8 GM II" },
      { category: "Camera", name: "BodySerialNumber", description: "4829104", value: "4829104" },
      { category: "Camera", name: "LensSerialNumber", description: "9018420", value: "9018420" },
      { category: "Exposure", name: "FNumber", description: "f/2.8", value: "2.8" },
      { category: "Exposure", name: "ExposureTime", description: "1/250", value: "0.004" },
      { category: "Exposure", name: "ISOSpeedRatings", description: "100", value: "100" },
      { category: "Exposure", name: "FocalLength", description: "50 mm", value: "50" },
      { category: "Exposure", name: "FocalLengthIn35mmFormat", description: "50 mm", value: "50" },
      { category: "Exposure", name: "ExposureProgram", description: "Manual", value: "Manual" },
      { category: "Exposure", name: "ExposureBiasValue", description: "0 EV", value: "0" },
      { category: "Exposure", name: "MeteringMode", description: "Multi-segment", value: "Pattern" },
      { category: "Exposure", name: "Flash", description: "Flash did not fire", value: "0" },
      { category: "Exposure", name: "WhiteBalance", description: "Custom (Daylight 5500K)", value: "Manual" },
      { category: "GPS", name: "GPSLatitude", description: "37° 46' 29.74\" N", value: "37.774929" },
      { category: "GPS", name: "GPSLongitude", description: "122° 25' 9.90\" W", value: "-122.419416" },
      { category: "GPS", name: "GPSAltitude", description: "48.5 m Above Sea Level", value: "48.5" },
      { category: "GPS", name: "GPSMapDatum", description: "WGS-84", value: "WGS-84" },
      { category: "Date & Time", name: "DateTimeOriginal", description: "2026:08:14 18:42:19", value: "2026:08:14 18:42:19" },
      { category: "Date & Time", name: "OffsetTimeOriginal", description: "-07:00", value: "-07:00" },
      { category: "Image", name: "ColorSpace", description: "sRGB", value: "1" },
      { category: "Image", name: "Orientation", description: "Horizontal (normal)", value: "1" },
      { category: "Image", name: "ImageWidth", description: "9504 pixels", value: "9504" },
      { category: "Image", name: "ImageHeight", description: "6336 pixels", value: "6336" },
      { category: "Image", name: "Software", description: "Adobe Lightroom Classic 14.2 (Macintosh)", value: "Adobe Lightroom" },
      { category: "XMP", name: "Artist", description: "Alex Morgan Studios", value: "Alex Morgan Studios" },
      { category: "XMP", name: "Copyright", description: "© 2026 Alex Morgan. All Rights Reserved.", value: "Copyright" },
    ],
    rawJson: {
      Make: { description: "Sony", value: "Sony" },
      Model: { description: "ILCE-7RM5", value: "ILCE-7RM5" },
      LensModel: { description: "FE 24-70mm F2.8 GM II", value: "FE 24-70mm F2.8 GM II" },
      FNumber: { description: "f/2.8", value: 2.8 },
      ExposureTime: { description: "1/250", value: 0.004 },
      ISOSpeedRatings: { description: "100", value: 100 },
      FocalLength: { description: "50 mm", value: 50 },
      GPSLatitude: { description: "37° 46' 29.74\" N", value: 37.774929 },
      GPSLongitude: { description: "122° 25' 9.90\" W", value: -122.419416 },
      DateTimeOriginal: { description: "2026:08:14 18:42:19", value: "2026:08:14 18:42:19" },
    },
  };
}
