/**
 * Sketch Agent System & Model API Logger
 * Provides structured, visually distinctive console logging for tracking
 * multi-agent state flows, LLM API calls, and outputs.
 */

const isServer = typeof window === "undefined";

const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
  gray: "\x1b[90m",
  bgBlue: "\x1b[44m\x1b[37m",
  bgMagenta: "\x1b[45m\x1b[37m",
  bgCyan: "\x1b[46m\x1b[30m",
};

function formatTag(prefix: string, tag: string, color: string): string {
  if (isServer) {
    return `${color}${ANSI.bold}[${prefix}] ${tag}${ANSI.reset}`;
  }
  return `[${prefix}] ${tag}`;
}

export const AgentLogger = {
  /**
   * Log major workflow banner
   */
  banner(title: string, meta?: Record<string, unknown>) {
    const divider = "=".repeat(60);
    if (isServer) {
      console.log(`\n${ANSI.cyan}${divider}${ANSI.reset}`);
      console.log(`${ANSI.cyan}${ANSI.bold}🤖 [AGENT SYSTEM] ${title.toUpperCase()}${ANSI.reset}`);
      if (meta) {
        console.log(`${ANSI.dim}${JSON.stringify(meta, null, 2)}${ANSI.reset}`);
      }
      console.log(`${ANSI.cyan}${divider}${ANSI.reset}\n`);
    } else {
      console.log(`🤖 [AGENT SYSTEM] ${title}`, meta || "");
    }
  },

  /**
   * Log when a workflow node begins
   */
  nodeStart(nodeName: string, inputState: Record<string, unknown>) {
    const tag = formatTag("STATE FLOW", `▶ STARTING NODE: ${nodeName}`, ANSI.cyan);
    console.log(`\n${tag}`);
    console.log(
      isServer ? `${ANSI.gray}── Input State ──${ANSI.reset}` : "── Input State ──"
    );
    console.dir(inputState, { depth: 3, colors: isServer });
  },

  /**
   * Log when a workflow node finishes
   */
  nodeEnd(nodeName: string, durationMs: number, outputState: Record<string, unknown>) {
    const tag = formatTag("STATE FLOW", `✔ COMPLETED NODE: ${nodeName} (${durationMs}ms)`, ANSI.green);
    console.log(`${tag}`);
    console.log(
      isServer ? `${ANSI.gray}── Output State Produced ──${ANSI.reset}` : "── Output State Produced ──"
    );
    console.dir(outputState, { depth: 3, colors: isServer });
  },

  /**
   * Log routing / conditional edge decisions
   */
  routing(fromNode: string, toNode: string, reason: string, details?: Record<string, unknown>) {
    const tag = formatTag("ROUTER", `🔀 ${fromNode} ➔ ${toNode}`, ANSI.magenta);
    console.log(`${tag}`);
    console.log(`   Reason: ${reason}`);
    if (details) {
      console.dir(details, { depth: 2, colors: isServer });
    }
  },

  /**
   * Log Model API Call Initiation
   */
  modelApiCall(modelName: string, agentName: string, promptPreview: string, isConfigured: boolean) {
    const statusColor = isConfigured ? ANSI.green : ANSI.yellow;
    const statusText = isConfigured ? "API Key Configured" : "NO API Key / Placeholder (Fallback Mode)";
    
    console.log(`\n${formatTag("MODEL API", `⚡ INVOCATION [${modelName}]`, ANSI.blue)}`);
    console.log(`   Caller Agent:   ${agentName}`);
    console.log(`   API Status:     ${statusColor}${statusText}${ANSI.reset}`);
    console.log(`   Prompt Preview: ${promptPreview.replace(/\n+/g, " ").slice(0, 180)}...`);
  },

  /**
   * Log Model API Success
   */
  modelApiSuccess(modelName: string, agentName: string, durationMs: number, outputPreview: unknown) {
    console.log(`${formatTag("MODEL API", `✨ SUCCESS [${modelName}] in ${durationMs}ms`, ANSI.green)}`);
    console.log(`   Caller Agent:   ${agentName}`);
    console.log(`   Response Payload:`);
    console.dir(outputPreview, { depth: 3, colors: isServer });
  },

  /**
   * Log Model API Error
   */
  modelApiError(modelName: string, agentName: string, error: unknown, willFallback: boolean) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.log(`\n${formatTag("MODEL API", `❌ FAILED [${modelName}]`, ANSI.red)}`);
    console.log(`   Caller Agent:   ${agentName}`);
    console.log(`   Error Details:  ${errMsg}`);
    if (willFallback) {
      console.log(`   ${ANSI.yellow}⚠ Fallback Strategy: Using intelligent deterministic blueprint${ANSI.reset}`);
    }
  },

  /**
   * Log Model API Fallback usage
   */
  modelApiFallback(modelName: string, agentName: string, reason: string, fallbackData: unknown) {
    console.log(`${formatTag("MODEL API", `🛡 FALLBACK ENGAGED [${modelName}]`, ANSI.yellow)}`);
    console.log(`   Caller Agent:   ${agentName}`);
    console.log(`   Trigger Reason: ${reason}`);
    console.log(`   Fallback Data Output:`);
    console.dir(fallbackData, { depth: 2, colors: isServer });
  },

  /**
   * Log specialized Agent actions
   */
  agentAction(agentName: string, actionName: string, details?: unknown) {
    const tag = formatTag(agentName.toUpperCase(), actionName, ANSI.cyan);
    console.log(`${tag}`);
    if (details) {
      console.dir(details, { depth: 3, colors: isServer });
    }
  },
};
