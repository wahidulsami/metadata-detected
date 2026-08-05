const STRIPPABLE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function canStripExif(mimeType: string): boolean {
  return STRIPPABLE_TYPES.has(mimeType);
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Unable to decode image for stripping."));
    img.src = src;
  });
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function stripExifAndDownload(
  previewUrl: string,
  originalName: string,
  mimeType: string
): Promise<void> {
  if (!canStripExif(mimeType)) {
    throw new Error("This format cannot be stripped in the browser. Try JPEG, PNG, or WEBP.");
  }

  const img = await loadImageElement(previewUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas is not available in this browser.");
  }

  ctx.drawImage(img, 0, 0);

  const outputType =
    mimeType === "image/png"
      ? "image/png"
      : mimeType === "image/webp"
        ? "image/webp"
        : "image/jpeg";

  const quality = outputType === "image/jpeg" ? 0.92 : undefined;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to export clean image."))),
      outputType,
      quality
    );
  });

  const base = originalName.replace(/\.[^.]+$/, "");
  const ext =
    outputType === "image/png" ? "png" : outputType === "image/webp" ? "webp" : "jpg";
  downloadBlob(blob, `${base}-no-exif.${ext}`);
}
