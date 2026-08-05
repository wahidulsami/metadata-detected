import type { Tags } from "exifreader";
import type { GpsCoordinates, PrivacyFlag, PrivacyReport } from "@/types/exif";

function hasTag(tags: Tags, key: string): boolean {
  return Boolean(tags[key as keyof Tags]);
}

function tagText(tags: Tags, key: string): string | null {
  const tag = tags[key as keyof Tags];
  if (!tag || typeof tag !== "object" || !("description" in tag)) return null;
  const d = (tag as { description?: string }).description;
  return d && d !== "—" ? d : null;
}

export function analyzePrivacy(tags: Tags, gps: GpsCoordinates | null): PrivacyReport {
  const flags: PrivacyFlag[] = [];
  let score = 100;

  if (gps) {
    score -= 35;
    flags.push({
      id: "gps",
      label: "GPS coordinates embedded",
      severity: "high",
      detail: "Exact capture location can be recovered from this file.",
    });
  }

  if (hasTag(tags, "BodySerialNumber") || hasTag(tags, "CameraSerialNumber")) {
    score -= 18;
    flags.push({
      id: "serial",
      label: "Camera serial number",
      severity: "high",
      detail: "Hardware serials can tie photos to a specific device.",
    });
  }

  if (hasTag(tags, "Artist") || hasTag(tags, "Creator") || hasTag(tags, "OwnerName")) {
    score -= 12;
    flags.push({
      id: "identity",
      label: "Creator / owner identity",
      severity: "medium",
      detail: "Name fields may reveal who shot or owns the image.",
    });
  }

  if (hasTag(tags, "DateTimeOriginal") || hasTag(tags, "CreateDate")) {
    score -= 8;
    flags.push({
      id: "datetime",
      label: "Capture timestamp",
      severity: "medium",
      detail: "Exact date and time of capture is stored in metadata.",
    });
  }

  if (hasTag(tags, "Software") || hasTag(tags, "ProcessingSoftware")) {
    score -= 6;
    flags.push({
      id: "software",
      label: "Editing software fingerprint",
      severity: "low",
      detail: tagText(tags, "Software") ?? "Software tag present in metadata.",
    });
  }

  if (hasTag(tags, "GPSImgDirection") || hasTag(tags, "GPSSpeed")) {
    score -= 5;
    flags.push({
      id: "gps-extra",
      label: "Extended GPS telemetry",
      severity: "medium",
      detail: "Direction, speed, or altitude may accompany coordinates.",
    });
  }

  score = Math.max(0, Math.min(100, score));

  let grade: PrivacyReport["grade"] = "A";
  if (score < 85) grade = "B";
  if (score < 70) grade = "C";
  if (score < 50) grade = "D";
  if (score < 30) grade = "F";

  if (flags.length === 0) {
    flags.push({
      id: "clean",
      label: "Minimal sensitive metadata",
      severity: "low",
      detail: "No high-risk tags detected. Still review before publishing.",
    });
  }

  return { score, grade, flags };
}
