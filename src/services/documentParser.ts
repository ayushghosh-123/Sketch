import mammoth from "mammoth";
import { getGeminiClient, isGeminiConfigured } from "@/lib/gemini/client";
import { getGroqApiKey, isGroqConfigured } from "@/lib/groq/client";
import Groq from "groq-sdk";

export class DocumentParser {
  /**
   * Analyzes an uploaded architecture diagram, whiteboard sketch, screenshot, or UI mockup
   * using multimodal vision (Gemini 1.5 Flash or Groq Vision) to extract architectural components,
   * data flows, databases, APIs, and requirements for RAG chunking and vector search.
   */
  static async extractFromImage(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    const cleanMime = mimeType || (fileName.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg");

    // 1. If SVG: extract all text elements, labels, and shape descriptions directly from XML
    if (cleanMime.includes("svg") || fileName.toLowerCase().endsWith(".svg")) {
      try {
        const svgContent = buffer.toString("utf-8");
        const textMatches = svgContent.match(/<text[^>]*>([^<]+)<\/text>/gi);
        const extractedTexts = textMatches
          ? textMatches.map((t) => t.replace(/<[^>]+>/g, "").trim()).filter(Boolean)
          : [];

        if (extractedTexts.length > 0) {
          return `### Architecture Diagram (SVG): ${fileName}\n\n` +
            `**Extracted Labels & Components:**\n` +
            extractedTexts.map((txt) => `- ${txt}`).join("\n") +
            `\n\n**Raw Vector Data Summary:** System vector diagram with ${extractedTexts.length} labeled elements.`;
        }
      } catch (svgErr) {
        console.warn("SVG text extraction notice:", svgErr);
      }
    }

    const base64Data = buffer.toString("base64");
    const visionPrompt = `You are a Principal Software Architect analyzing an architecture diagram, system topology, whiteboard sketch, or product mockup.
Analyze the image thoroughly and return a structured markdown architectural breakdown:
1. **System Overview**: What is the core application or system depicted?
2. **Components & Services**: List each component/microservice, its role, and technology (if visible).
3. **Data Flows & Communication**: Describe the connections, protocols (REST, gRPC, WebSocket, message queues), and directional flows.
4. **Databases & Storage**: Identify SQL, NoSQL, caches (Redis), object storage (S3/blob), or message brokers (Kafka/RabbitMQ).
5. **Security & Ingress**: Detail gateways, auth providers, firewalls, or load balancers shown.
6. **Key Constraints & Notes**: Any visible scale targets, annotations, or requirements written in the image.

Provide a clear, detailed, and comprehensive technical analysis.`;

    // 2. Try Gemini 1.5 Flash Vision first
    if (isGeminiConfigured()) {
      try {
        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
          {
            inlineData: {
              data: base64Data,
              mimeType: cleanMime.startsWith("image/") ? cleanMime : "image/png",
            },
          },
          visionPrompt,
        ]);
        const responseText = result.response.text();
        if (responseText && responseText.trim()) {
          return `### Visual Architecture Specification (AI Analyzed): ${fileName}\n\n${responseText.trim()}`;
        }
      } catch (geminiErr) {
        console.warn("Gemini vision analysis notice, trying Groq vision fallback:", geminiErr);
      }
    }

    // 3. Try Groq Llama 3.2 Vision fallback
    if (isGroqConfigured()) {
      try {
        const apiKey = getGroqApiKey();
        const groq = new Groq({ apiKey });
        const completion = await groq.chat.completions.create({
          model: "llama-3.2-11b-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: visionPrompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${cleanMime};base64,${base64Data}`,
                  },
                },
              ],
            },
          ],
          temperature: 0.1,
          max_tokens: 1500,
        });

        const groqText = completion.choices[0]?.message?.content;
        if (groqText && groqText.trim()) {
          return `### Visual Architecture Specification (AI Analyzed): ${fileName}\n\n${groqText.trim()}`;
        }
      } catch (groqErr) {
        console.warn("Groq vision analysis notice:", groqErr);
      }
    }

    // 4. Intelligent Fallback for offline / demo mode
    return `### Uploaded Architecture Diagram: ${fileName}\n\n` +
      `**Image File:** ${fileName} (${(buffer.length / 1024).toFixed(1)} KB, format: ${cleanMime})\n` +
      `**Description:** Visual system architecture diagram / component blueprint uploaded by user. ` +
      `Components, database schemas, and communication links illustrated in this image serve as primary structural requirements ` +
      `for system synthesis, service topology design, and technology stack selection.`;
  }

  /**
   * Extracts raw text from uploaded Buffer according to mimeType / file extension
   */
  static async extractText(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    const ext = fileName.toLowerCase().split(".").pop() || "";
    const cleanMime = (mimeType || "").toLowerCase();

    // 0. Images (PNG, JPG, JPEG, WEBP, GIF, SVG)
    if (
      ext === "png" ||
      ext === "jpg" ||
      ext === "jpeg" ||
      ext === "webp" ||
      ext === "gif" ||
      ext === "svg" ||
      cleanMime.startsWith("image/")
    ) {
      return await this.extractFromImage(buffer, fileName, cleanMime);
    }

    // 1. Plain Text or Markdown
    if (ext === "txt" || ext === "md" || ext === "markdown" || cleanMime.includes("text/")) {
      return buffer.toString("utf-8");
    }

    // 2. JSON or YAML specs
    if (ext === "json" || cleanMime.includes("application/json")) {
      try {
        const parsed = JSON.parse(buffer.toString("utf-8"));
        return JSON.stringify(parsed, null, 2);
      } catch {
        return buffer.toString("utf-8");
      }
    }

    // 3. DOCX Word documents
    if (ext === "docx" || cleanMime.includes("wordprocessingml")) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value || "";
      } catch (docxErr) {
        console.warn("Failed to parse docx via mammoth:", docxErr);
        return buffer.toString("utf-8");
      }
    }

    // 4. PDF documents
    if (ext === "pdf" || cleanMime.includes("pdf")) {
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
