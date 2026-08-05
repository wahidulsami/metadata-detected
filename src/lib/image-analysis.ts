function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image decode failed"));
    img.src = src;
  });
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export async function extractDominantColors(
  previewUrl: string,
  maxColors = 6
): Promise<string[]> {
  const img = await loadImage(previewUrl);
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  const buckets = new Map<string, { r: number; g: number; b: number; n: number }>();

  for (let i = 0; i < data.length; i += 4 * 3) {
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i + 1] / 32) * 32;
    const b = Math.round(data[i + 2] / 32) * 32;
    const key = `${r},${g},${b}`;
    const prev = buckets.get(key);
    if (prev) {
      prev.n += 1;
    } else {
      buckets.set(key, { r, g, b, n: 1 });
    }
  }

  return [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, maxColors)
    .map(({ r, g, b }) => rgbToHex(Math.min(255, r), Math.min(255, g), Math.min(255, b)));
}

export async function computeLuminanceHistogram(previewUrl: string): Promise<number[]> {
  const img = await loadImage(previewUrl);
  const w = 120;
  const h = Math.round((img.naturalHeight / img.naturalWidth) * w) || 80;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Array(32).fill(0);

  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  const bins = Array(32).fill(0);

  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    const bin = Math.min(31, Math.floor((lum / 255) * 32));
    bins[bin] += 1;
  }

  const peak = Math.max(...bins, 1);
  return bins.map((v) => v / peak);
}

export async function computeFileSha256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
