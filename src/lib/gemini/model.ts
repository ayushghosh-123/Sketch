import { getGeminiClient, isGeminiConfigured } from "./client";
import { GroqService } from "@/lib/groq/groqService";
import { isGroqConfigured } from "@/lib/groq/client";
import { AgentLogger } from "@/lib/logger/agentLogger";

export class GeminiService {
  private static DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

  /**
   * Generates text or JSON response using Groq or Gemini
   */
  static async generateContent(
    prompt: string,
    systemInstruction?: string,
    caller: string = "AgentService",
    overrideModel?: string
  ): Promise<string> {
    if (isGroqConfigured()) {
      return GroqService.generateContent(prompt, systemInstruction, caller, overrideModel);
    }

    const modelToUse = overrideModel || this.DEFAULT_MODEL;
    const configured = isGeminiConfigured();
    AgentLogger.modelApiCall(modelToUse, caller, prompt, configured);

    if (!configured) {
      AgentLogger.modelApiFallback(
        modelToUse,
        caller,
        "Neither Groq nor Gemini API key is configured in .env",
        ""
      );
      return "";
    }

    const startTime = Date.now();
    try {
      const client = getGeminiClient();
      const model = client.getGenerativeModel({
        model: modelToUse,
        systemInstruction: systemInstruction ? { role: "system", parts: [{ text: systemInstruction }] } : undefined,
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const duration = Date.now() - startTime;

      AgentLogger.modelApiSuccess(
        modelToUse,
        caller,
        duration,
        text.length > 300 ? `${text.slice(0, 300)}... [${text.length} chars]` : text
      );
      return text;
    } catch (err) {
      AgentLogger.modelApiError(modelToUse, caller, err, true);
      return "";
    }
  }

  /**
   * Generates structured JSON response conforming to a schema using Groq or Gemini
   */
  static async generateStructuredJson<T>(
    prompt: string,
    systemInstruction: string,
    fallbackValue: T,
    caller: string = "AgentService",
    overrideModel?: string
  ): Promise<T> {
    if (isGroqConfigured()) {
      return GroqService.generateStructuredJson<T>(
        prompt,
        systemInstruction,
        fallbackValue,
        caller,
        overrideModel
      );
    }

    const modelToUse = overrideModel || this.DEFAULT_MODEL;
    const configured = isGeminiConfigured();
    AgentLogger.modelApiCall(modelToUse, caller, prompt, configured);

    if (!configured) {
      AgentLogger.modelApiFallback(
        modelToUse,
        caller,
        "No active AI API key found (GROQ_API_KEY/GEMINI_API_KEY). Using deterministic fallback.",
        fallbackValue
      );
      return fallbackValue;
    }

    const startTime = Date.now();
    try {
      const client = getGeminiClient();
      const model = client.getGenerativeModel({
        model: modelToUse,
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
      const duration = Date.now() - startTime;

      const parsed = JSON.parse(text) as T;
      AgentLogger.modelApiSuccess(modelToUse, caller, duration, parsed);
      return parsed;
    } catch (err) {
      AgentLogger.modelApiError(modelToUse, caller, err, true);
      AgentLogger.modelApiFallback(
        modelToUse,
        caller,
        "Gemini call or JSON parsing failed. Recovered with intelligent fallback.",
        fallbackValue
      );
      return fallbackValue;
    }
  }
}
