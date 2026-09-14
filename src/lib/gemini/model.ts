import { getGeminiClient, isGeminiConfigured } from "./client";
import { AgentLogger } from "@/lib/logger/agentLogger";

export class GeminiService {
  private static DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

  /**
   * Generates text or JSON response using Gemini
   */
  static async generateContent(
    prompt: string,
    systemInstruction?: string,
    caller: string = "GeminiService",
    overrideModel?: string
  ): Promise<string> {
    const modelToUse = overrideModel || this.DEFAULT_MODEL;
    const configured = isGeminiConfigured();
    AgentLogger.modelApiCall(modelToUse, caller, prompt, configured);

    if (!configured) {
      AgentLogger.modelApiFallback(
        modelToUse,
        caller,
        "API key is not configured or is a placeholder in .env",
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
   * Generates structured JSON response conforming to a schema
   */
  static async generateStructuredJson<T>(
    prompt: string,
    systemInstruction: string,
    fallbackValue: T,
    caller: string = "GeminiService",
    overrideModel?: string
  ): Promise<T> {
    const modelToUse = overrideModel || this.DEFAULT_MODEL;
    const configured = isGeminiConfigured();
    AgentLogger.modelApiCall(modelToUse, caller, prompt, configured);

    if (!configured) {
      AgentLogger.modelApiFallback(
        modelToUse,
        caller,
        "No active Gemini API key found (GEMINI_API_KEY/GOOGLE_GENERATIVE_AI_API_KEY). Using deterministic fallback.",
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
