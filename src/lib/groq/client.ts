import { ChatGroq } from "@langchain/groq";

export function getGroqApiKey(): string {
  const envKey = process.env.GROQ_API_KEY || "";
  if (envKey && envKey.startsWith("gsk_")) {
    return envKey;
  }
  const fallbackKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || "";
  if (fallbackKey && fallbackKey.startsWith("gsk_")) {
    return fallbackKey;
  }
  return envKey || fallbackKey || "";
}

export function isGroqConfigured(): boolean {
  const key = getGroqApiKey();
  return Boolean(key && key.startsWith("gsk_") && !key.includes("placeholder"));
}

export function getGroqDefaultModel(): string {
  return process.env.GROQ_MODEL || "openai/gpt-oss-120b";
}

export interface ChatGroqOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export function createChatGroq(options?: ChatGroqOptions): ChatGroq {
  const apiKey = getGroqApiKey();
  const model = options?.model || getGroqDefaultModel();
  const temperature = options?.temperature ?? 0.1;

  return new ChatGroq({
    apiKey,
    model,
    temperature,
    maxTokens: options?.maxTokens,
  });
}
