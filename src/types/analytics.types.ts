// ── Correlation ───────────────────────────────────────────────────

export interface CorrelationResult {
  habitId: string;
  habitTitle: string;
  frequency: "daily" | "weekly";
  completionDayAvg: number; // avg mood on days habit was completed
  skipDayAvg: number; // avg mood on days habit was skipped
  lift: number; // completionDayAvg - skipDayAvg
  completionDaysAnalyzed: number;
  skipDaysAnalyzed: number;
}

export interface CorrelationResponse {
  correlations: CorrelationResult[];
  analyzedDays: number;
  moodLoggedDays: number;
  message: string;
}

// ── Habit Matrix ──────────────────────────────────────────────────

export interface HabitPairResult {
  habitA: { id: string; title: string };
  habitB: { id: string; title: string };
  coCompletionRate: number; // 0–100 (intersection/union × 100)
  coCompletedDays: number;
  eitherCompletedDays: number;
  suggestion: string;
}

export interface HabitMatrixResponse {
  matrix: HabitPairResult[];
  analyzedDays: number;
  totalHabits: number;
  message: string;
}
