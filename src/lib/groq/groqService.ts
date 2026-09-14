import { createChatGroq, isGroqConfigured, getGroqDefaultModel } from "./client";
import { SystemMessage, HumanMessage, BaseMessage } from "@langchain/core/messages";
import { AgentLogger } from "@/lib/logger/agentLogger";

export class GroqService {
  /**
   * Generates text content using Groq via LangChain ChatGroq
   */
  static async generateContent(
    prompt: string,
    systemInstruction?: string,
    caller: string = "GroqService",
    overrideModel?: string
  ): Promise<string> {
    const modelToUse = overrideModel || getGroqDefaultModel();
    const configured = isGroqConfigured();
    AgentLogger.modelApiCall(modelToUse, caller, prompt, configured);

    if (!configured) {
      AgentLogger.modelApiFallback(
        modelToUse,
        caller,
        "Groq API key (GROQ_API_KEY or gsk_*) not configured",
        ""
      );
      return "";
    }

    const startTime = Date.now();
    try {
      const chat = createChatGroq({
        model: modelToUse,
        temperature: 0.2,
      });

      const messages: BaseMessage[] = [];
      if (systemInstruction) {
        messages.push(new SystemMessage(systemInstruction));
      }
      messages.push(new HumanMessage(prompt));

      const response = await chat.invoke(messages);
      const text = String(response.content || "");
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
   * Generates structured JSON conforming to schema using LangChain ChatGroq in JSON mode
   */
  static async generateStructuredJson<T>(
    prompt: string,
    systemInstruction: string,
    fallbackValue: T,
    caller: string = "GroqService",
    overrideModel?: string
  ): Promise<T> {
    const modelToUse = overrideModel || getGroqDefaultModel();
    const configured = isGroqConfigured();
    AgentLogger.modelApiCall(modelToUse, caller, prompt, configured);

    if (!configured) {
      AgentLogger.modelApiFallback(
        modelToUse,
        caller,
        "Groq API key not configured. Using intelligent deterministic fallback.",
        fallbackValue
      );
      return fallbackValue;
    }

    const startTime = Date.now();
    try {
      const chat = createChatGroq({
        model: modelToUse,
        temperature: 0.1,
      });

      const messages: BaseMessage[] = [
        new SystemMessage(
          `${systemInstruction}\nReturn ONLY a valid JSON object matching the requested schema. Do not include markdown code block formatting or backticks.`
        ),
        new HumanMessage(prompt),
      ];

      const response = await chat.invoke(messages, {
        response_format: { type: "json_object" },
      });
      let text = String(response.content || "").trim();

      // Clean markdown if present
      if (text.startsWith("```json")) text = text.slice(7);
      if (text.startsWith("```")) text = text.slice(3);
      if (text.endsWith("```")) text = text.slice(0, -3);
      text = text.trim();

      const parsed = JSON.parse(text) as T;
      const duration = Date.now() - startTime;

      AgentLogger.modelApiSuccess(modelToUse, caller, duration, parsed);
      return parsed;
    } catch (err) {
      AgentLogger.modelApiError(modelToUse, caller, err, true);
      AgentLogger.modelApiFallback(
        modelToUse,
        caller,
        "Groq generation or JSON parsing failed. Recovered with intelligent fallback.",
        fallbackValue
      );
      return fallbackValue;
    }
  }
}
