import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_MIME_LABEL,
  MAX_FILE_SIZE_MB,
} from "@/lib/constants";

export type ImageValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export function validateImageFile(file: File): ImageValidationResult {
  const accepted = ACCEPTED_IMAGE_TYPES as readonly string[];
  if (!accepted.includes(file.type)) {
    return {
      ok: false,
      message: `Unsupported format. Please upload ${ACCEPTED_MIME_LABEL}.`,
    };
  }

  const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      ok: false,
      message: `File exceeds ${MAX_FILE_SIZE_MB} MB limit.`,
    };
  }

  return { ok: true };
}
