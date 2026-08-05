import type { ParsedImageExif } from "@/types/exif";

export function downloadTextFile(content: string, fileName: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportJson(data: ParsedImageExif): void {
  const payload = {
    fileName: data.fileName,
    fileSize: data.fileSize,
    mimeType: data.mimeType,
    dimensions: { width: data.width, height: data.height },
    privacy: data.privacy,
    gps: data.gps,
    overview: data.overview,
    exif: data.rawJson,
    fileHash: data.fileHash,
  };
  const base = data.fileName.replace(/\.[^.]+$/, "");
  downloadTextFile(JSON.stringify(payload, null, 2), `${base}-metadata.json`, "application/json");
}

export function exportCsv(data: ParsedImageExif): void {
  const lines = ["tag,description,category"];
  for (const row of data.tableRows) {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    lines.push([esc(row.name), esc(row.description), esc(row.category)].join(","));
  }
  const base = data.fileName.replace(/\.[^.]+$/, "");
  downloadTextFile(lines.join("\n"), `${base}-metadata.csv`, "text/csv");
}

export function buildShareSummary(data: ParsedImageExif): string {
  const lines = [
    `📷 ${data.fileName}`,
    `${data.width}×${data.height} · ${data.tableRows.length} EXIF tags`,
    `Privacy score: ${data.privacy.score}/100 (${data.privacy.grade})`,
    ...data.overview.filter((s) => s.value !== "—").map((s) => `${s.label}: ${s.value}`),
  ];
  if (data.gps) {
    lines.push(`GPS: ${data.gps.latitude.toFixed(5)}, ${data.gps.longitude.toFixed(5)}`);
  }
  return lines.join("\n");
}
