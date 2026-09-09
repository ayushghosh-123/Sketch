import type { ProjectStateType } from "../state";

export async function securityAnalyzerNode(state: ProjectStateType): Promise<Partial<ProjectStateType>> {
  const sec: string[] = [];

  const customSec = state.projectRequirements?.security_requirements;
  if (customSec) {
    sec.push(customSec);
  }

  sec.push(
    "JWT & OAuth2 tokens with short-lived expiration and refresh rotation",
    "TLS 1.3 encryption in transit and AES-256 encryption at rest",
    "Strict Row-Level Security (RLS) and Tenant Isolation policies",
    "Role-Based Access Control (RBAC) across API endpoints with rate limiting"
  );

  return {
    securityRecommendations: sec,
    analysisStatus: "security_analyzed",
  };
}
