export type InsightType =
  | "correlation"
  | "streak"
  | "warning"
  | "positive"
  | "suggestion";

export type InsightSeverity = "info" | "warning" | "success";

export interface AiInsight {
  type: InsightType;
  title: string;
  description: string;
  severity: InsightSeverity;
}

export interface AiInsightsResponse {
  insights: AiInsight[];
  cached: boolean;
  generatedAt: string;
  message: string;
}

// ── Suggestions ──────────────────────────────────────────────────

export interface AiSuggestion {
  title: string;
  frequency: "daily" | "weekly";
  category: string;
  rationale: string;
  expectedMoodImpact: string;
}

export interface AiSuggestionsResponse {
  suggestions: AiSuggestion[];
  cached: boolean;
  generatedAt: string | null;
  message: string;
}

// ── Chat ─────────────────────────────────────────────────────────

export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiChatResponse {
  reply: string;
  conversationId: string;
  messageCount: number;
}
