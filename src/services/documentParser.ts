import mammoth from "mammoth";

export class DocumentParser {
  /**
   * Extracts raw text from uploaded Buffer according to mimeType / file extension
   */
  static async extractText(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    const ext = fileName.toLowerCase().split(".").pop() || "";

    // 1. Plain Text or Markdown
    if (ext === "txt" || ext === "md" || ext === "markdown" || mimeType.includes("text/")) {
      return buffer.toString("utf-8");
    }

    // 2. JSON or YAML specs
    if (ext === "json" || mimeType.includes("application/json")) {
      try {
        const parsed = JSON.parse(buffer.toString("utf-8"));
        return JSON.stringify(parsed, null, 2);
      } catch {
        return buffer.toString("utf-8");
      }
    }

    // 3. DOCX Word documents
    if (ext === "docx" || mimeType.includes("wordprocessingml")) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value || "";
      } catch (docxErr) {
        console.warn("Failed to parse docx via mammoth:", docxErr);
        return buffer.toString("utf-8");
      }
    }

    // 4. PDF documents
    if (ext === "pdf" || mimeType.includes("pdf")) {
      try {
        // Dynamic import of pdf-parse to prevent serverless bundling issues
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse");
        const pdfData = await pdfParse(buffer);
        return pdfData.text || "";
      } catch (pdfErr) {
        console.warn("pdf-parse fallback, extracting string streams:", pdfErr);
        // Fallback: extract ASCII string streams from PDF
        const text = buffer.toString("latin1");
        const matches = text.match(/\(([^()]+)\)/g);
        if (matches && matches.length > 0) {
          return matches.map((m) => m.slice(1, -1)).join(" ");
        }
        return `Document: ${fileName} (Binary PDF content indexed)`;
      }
    }

    // Default fallback
    return buffer.toString("utf-8");
  }
}
