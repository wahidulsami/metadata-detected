import type { ExpandedTags, Tags } from "exifreader";
import type {
  ExifTableRow,
  GpsCoordinates,
  OverviewStat,
  ParsedImageExif,
} from "@/types/exif";

type TagLike = {
  description?: string;
  value?: unknown;
};

function tagDescription(tag: unknown): string {
  if (tag && typeof tag === "object" && "description" in tag) {
    const d = (tag as TagLike).description;
    return typeof d === "string" ? d : String(d ?? "—");
  }
  return "—";
}

function tagValue(tag: unknown): string {
  if (tag == null) return "—";
  if (typeof tag === "string" || typeof tag === "number" || typeof tag === "boolean") {
    return String(tag);
  }
  if (typeof tag === "object" && "description" in tag) {
    return tagDescription(tag);
  }
  try {
    return JSON.stringify(tag);
  } catch {
    return String(tag);
  }
}

function categorizeTag(name: string): string {
  if (name.startsWith("GPS")) return "GPS";
  if (name.includes("Xmp") || name.startsWith("x:")) return "XMP";
  if (/^(Image|Pixel|Orientation|Resolution)/.test(name)) return "Image";
  if (/^(Make|Model|Lens|Body|Serial)/.test(name)) return "Camera";
  if (/^(Exposure|ISO|FNumber|Aperture|Shutter|Focal|Flash|WhiteBalance|Metering|Scene)/.test(name)) {
    return "Exposure";
  }
  if (/^(Date|Time|SubSec)/.test(name)) return "Date & Time";
  return "Other";
}

function extractGps(expanded: ExpandedTags): GpsCoordinates | null {
  const gps = expanded.gps;
  if (
    gps?.Latitude != null &&
    gps?.Longitude != null &&
    Number.isFinite(gps.Latitude) &&
    Number.isFinite(gps.Longitude)
  ) {
    return {
      latitude: gps.Latitude,
      longitude: gps.Longitude,
      altitude: gps.Altitude,
    };
  }
  return null;
}

function getFlatTag(tags: Tags, key: string): string {
  const tag = tags[key as keyof Tags];
  if (!tag) return "—";
  return tagDescription(tag);
}

function buildOverview(
  tags: Tags,
  width: number,
  height: number
): OverviewStat[] {
  return [
    { label: "Camera Model", value: getFlatTag(tags, "Model") },
    {
      label: "Lens",
      value:
        getFlatTag(tags, "LensModel") !== "—"
          ? getFlatTag(tags, "LensModel")
          : getFlatTag(tags, "LensSpecification"),
    },
    {
      label: "ISO",
      value:
        getFlatTag(tags, "ISOSpeedRatings") !== "—"
          ? getFlatTag(tags, "ISOSpeedRatings")
          : getFlatTag(tags, "PhotographicSensitivity"),
    },
    { label: "Aperture", value: getFlatTag(tags, "FNumber") },
    { label: "Shutter Speed", value: getFlatTag(tags, "ExposureTime") },
    { label: "Focal Length", value: getFlatTag(tags, "FocalLength") },
    {
      label: "Capture Date",
      value:
        getFlatTag(tags, "DateTimeOriginal") !== "—"
          ? getFlatTag(tags, "DateTimeOriginal")
          : getFlatTag(tags, "CreateDate"),
    },
    { label: "Resolution", value: `${width.toLocaleString()} × ${height.toLocaleString()}` },
  ];
}

function flattenTags(tags: Tags): ExifTableRow[] {
  const rows: ExifTableRow[] = [];

  for (const [name, tag] of Object.entries(tags)) {
    if (name === "Thumbnail" || name === "Images") continue;
    if (tag == null) continue;
    rows.push({
      name,
      description: tagDescription(tag),
      value: tagValue(tag),
      category: categorizeTag(name),
    });
  }

  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

function buildRawJson(tags: Tags): Record<string, { description: string; value: unknown }> {
  const out: Record<string, { description: string; value: unknown }> = {};
  for (const [name, tag] of Object.entries(tags)) {
    if (name === "Thumbnail" || name === "Images") continue;
    if (!tag || typeof tag !== "object") continue;
    const t = tag as TagLike;
    out[name] = {
      description: t.description ?? "",
      value: "value" in t ? t.value : t.description,
    };
  }
  return out;
}

function countMeaningfulExif(tags: Tags): boolean {
  const keys = Object.keys(tags).filter(
    (k) => k !== "Thumbnail" && k !== "Images" && k !== "FileType"
  );
  return keys.length > 0;
}

export async function loadImageDimensions(
  previewUrl: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("Failed to load image dimensions"));
    img.src = previewUrl;
  });
}

export async function parseImageExif(
  file: File,
  previewUrl: string
): Promise<ParsedImageExif> {
  const ExifReader = (await import("exifreader")).default;
  const buffer = await file.arrayBuffer();

  let flat: Tags;
  let expanded: ExpandedTags;

  try {
    flat = ExifReader.load(buffer);
    expanded = ExifReader.load(buffer, { expanded: true });
  } catch {
    const { width, height } = await loadImageDimensions(previewUrl);
    return {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      previewUrl,
      width,
      height,
      hasExif: false,
      overview: buildOverview({} as Tags, width, height),
      gps: null,
      tableRows: [],
      rawJson: {},
    };
  }

  const { width, height } = await loadImageDimensions(previewUrl);
  const hasExif = countMeaningfulExif(flat);

  return {
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
    previewUrl,
    width,
    height,
    hasExif,
    overview: buildOverview(flat, width, height),
    gps: extractGps(expanded),
    tableRows: flattenTags(flat),
    rawJson: buildRawJson(flat),
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
