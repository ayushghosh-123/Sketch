export interface ChunkOptions {
  chunkSize?: number;
  chunkOverlap?: number;
}

export interface TextChunkItem {
  content: string;
  chunkIndex: number;
}

export class ChunkingService {
  /**
   * Clean raw extracted text by normalizing whitespace, linebreaks, and special chars
   */
  static cleanText(rawText: string): string {
    if (!rawText) return "";
    return rawText
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\0/g, "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  /**
   * Splits text into overlapping chunks using natural semantic boundaries (paragraphs, sentences)
   */
  static chunkText(text: string, options: ChunkOptions = {}): TextChunkItem[] {
    const chunkSize = options.chunkSize || 800;
    const chunkOverlap = options.chunkOverlap || 150;

    const cleaned = this.cleanText(text);
    if (!cleaned) return [];

    if (cleaned.length <= chunkSize) {
      return [{ content: cleaned, chunkIndex: 0 }];
    }

    const chunks: TextChunkItem[] = [];
    let start = 0;
    let chunkIndex = 0;

    while (start < cleaned.length) {
      let end = start + chunkSize;

      // If we haven't reached the end of the text, try to find a natural break point
      if (end < cleaned.length) {
        // Look for double newline (paragraph boundary)
        const paragraphBreak = cleaned.lastIndexOf("\n\n", end);
        if (paragraphBreak > start + chunkSize * 0.5) {
          end = paragraphBreak;
        } else {
          // Look for sentence end (period, exclamation, question mark followed by space)
          const sentenceBreak = cleaned.substring(start, end).search(/[.!?]\s+[A-Z0-9]/);
          if (sentenceBreak !== -1 && sentenceBreak > chunkSize * 0.4) {
            end = start + sentenceBreak + 1;
          } else {
            // Look for space/newline
            const spaceBreak = cleaned.lastIndexOf(" ", end);
            if (spaceBreak > start + chunkSize * 0.5) {
              end = spaceBreak;
            }
          }
        }
      } else {
        end = cleaned.length;
      }

      const chunkContent = cleaned.substring(start, end).trim();
      if (chunkContent.length > 0) {
        chunks.push({
          content: chunkContent,
          chunkIndex,
        });
        chunkIndex++;
      }

      // Slide start position forward with overlap
      if (end >= cleaned.length) {
        break;
      }

      start = Math.max(start + 1, end - chunkOverlap);
    }

    return chunks;
  }
}
