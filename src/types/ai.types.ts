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
