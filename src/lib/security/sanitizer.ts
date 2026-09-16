/**
 * Security sanitization helpers for file handling, user input, and prompt protection.
 */

/**
 * Sanitizes a file name to prevent path traversal (../, ..\, null bytes, control characters).
 * Keeps valid alphanumeric, hyphen, underscore, and dots.
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName || typeof fileName !== "string") {
    return `file-${Date.now()}.bin`;
  }

  // 1. Strip null bytes and control characters
  let clean = fileName.replace(/[\x00-\x1f\x7f]/g, "");

  // 2. Remove directory traversal sequences (../, ..\) and backslashes/slashes
  clean = clean.replace(/(\.\.[\/\\])+/g, "").replace(/[\/\\]+/g, "-");

  // 3. Keep only alphanumeric, hyphens, underscores, dots, and spaces
  clean = clean.replace(/[^a-zA-Z0-9.\-_ ]/g, "");

  // 4. Strip leading/trailing dots and spaces
  clean = clean.trim().replace(/^\.+/, "");

  // 5. Cap length (max 100 chars, preserving extension)
  if (clean.length > 100) {
    const ext = clean.includes(".") ? "." + clean.split(".").pop() : "";
    clean = clean.slice(0, 100 - ext.length) + ext;
  }

  return clean || `upload-${Date.now()}.bin`;
}

/**
 * Validates file upload constraints (size and allowed extensions/mimes).
 */
export const ALLOWED_DOCUMENT_MIME_TYPES = new Set([
  "text/plain",
  "text/markdown",
  "application/json",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export const ALLOWED_DOCUMENT_EXTENSIONS = new Set([
  "txt",
  "md",
  "markdown",
  "json",
  "pdf",
  "docx",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "svg",
]);

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function validateDocumentFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 10MB limit (uploaded: ${(file.size / 1024 / 1024).toFixed(1)}MB)`,
    };
  }

  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const mime = (file.type || "").toLowerCase();

  const isAllowedExt = ALLOWED_DOCUMENT_EXTENSIONS.has(ext);
  const isAllowedMime =
    ALLOWED_DOCUMENT_MIME_TYPES.has(mime) ||
    mime.startsWith("text/") ||
    mime.startsWith("image/") ||
    mime === "";

  if (!isAllowedExt && !isAllowedMime) {
    return {
      valid: false,
      error: `Unsupported file format (.${ext}). Only PDF, DOCX, TXT, MD, JSON, and Images (PNG, JPG, WEBP, SVG) are supported.`,
    };
  }

  return { valid: true };
}

/**
 * Sanitizes input before embedding into LLM prompts.
 * Strips null bytes and caps length to prevent token overflow/prompt stuffing.
 */
export function sanitizePromptInput(input: string, maxLength: number = 4000): string {
  if (!input || typeof input !== "string") return "";

  // Strip null bytes
  let sanitized = input.replace(/\0/g, "");

  // Truncate to maximum characters
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
}

/**
 * Wraps retrieved RAG context in XML tags to insulate prompt against indirect prompt injection.
 */
export function wrapUntrustedContext(context: string, tag: string = "untrusted_retrieved_context"): string {
  return `<${tag}>\n${context}\n</${tag}>`;
}
