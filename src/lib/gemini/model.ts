import { getGeminiClient, isGeminiConfigured } from "./client";

export class GeminiService {
  private static DEFAULT_MODEL = "gemini-1.5-flash";

  /**
   * Generates text or JSON response using Gemini
   */
  static async generateContent(prompt: string, systemInstruction?: string): Promise<string> {
    if (!isGeminiConfigured()) {
      return "";
    }

    try {
      const client = getGeminiClient();
      const model = client.getGenerativeModel({
        model: this.DEFAULT_MODEL,
        systemInstruction: systemInstruction ? { role: "system", parts: [{ text: systemInstruction }] } : undefined,
      });

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.warn("Gemini generateContent error:", err);
      return "";
    }
  }

  /**
   * Generates structured JSON response conforming to a schema
   */
  static async generateStructuredJson<T>(
    prompt: string,
    systemInstruction: string,
    fallbackValue: T
  ): Promise<T> {
    if (!isGeminiConfigured()) {
      return fallbackValue;
    }

    try {
      const client = getGeminiClient();
      const model = client.getGenerativeModel({
        model: this.DEFAULT_MODEL,
        generationConfig: {
          responseMimeType: "application/json",
        },
        systemInstruction: {
          role: "system",
          parts: [{ text: `${systemInstruction}\nReturn ONLY valid JSON matching the requested structure.` }],
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text) as T;
    } catch (err) {
      console.warn("Gemini generateStructuredJson failed, using intelligent fallback:", err);
      return fallbackValue;
    }
  }
}
