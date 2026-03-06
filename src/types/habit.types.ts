export type HabitFrequency = "daily" | "weekly";

export type HabitCategory =
  | "health"
  | "fitness"
  | "learning"
  | "mindfulness"
  | "productivity"
  | "custom";

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  category: HabitCategory;
  color?: string;
  icon?: string;
  targetPerWeek?: number;
  sortOrder: number;
  isArchived: boolean;
  reminderTime?: string;
  reminderOn: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  note?: string;
  createdAt: string;
}

export interface CreateHabitRequest {
  title: string;
  frequency: HabitFrequency;
  description?: string;
  category?: HabitCategory;
  color?: string;
  icon?: string;
  targetPerWeek?: number;
  reminderTime?: string;
  reminderOn?: boolean;
}

export interface UpdateHabitRequest {
  title?: string;
  description?: string;
  frequency?: HabitFrequency;
  category?: HabitCategory;
  color?: string;
  icon?: string;
  targetPerWeek?: number;
  reminderOn?: boolean;
  reminderTime?: string;
}

export interface CompleteHabitRequest {
  note?: string;
}

// Matches backend: log only has { id, date, note } — not the full HabitLog shape
export interface CompleteHabitResponse {
  message: string;
  log: {
    id: string;
    date: string;
    note?: string | null;
  };
  currentStreak: number;
  milestone: {
    days: number;
    message: string;
  } | null;
}

export interface ReorderHabitsRequest {
  habits: { id: string; sortOrder: number }[];
}

export interface HabitStreak {
  currentStreak: number;
  longestStreak: number;
}

export interface HabitAnalytics {
  totalCompletions: number;
  totalPossiblePeriods: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  missedPeriods: number;
  bestDayOfWeek: string | null;
  consistencyScore: number;
}

export interface HabitHeatmapDay {
  date: string;
  completed: 0 | 1;
}

export interface HabitHeatmapResponse {
  heatmap: HabitHeatmapDay[];
}

export interface HabitCalendarDay {
  date: string;
  completed: boolean;
}

export interface HabitMonthlySummary {
  month: string;
  completionsThisMonth: number;
  completionRate: number;
  calendar: HabitCalendarDay[];
}

// Matches backend: { logs, total, page, limit, totalPages }
export interface HabitLogEntry {
  id: string;
  date: string;
  note?: string | null;
  completed: boolean;
}

export interface HabitLogResponse {
  logs: HabitLogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateReminderRequest {
  reminderTime?: string;
  reminderOn: boolean;
}
