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
  category?: HabitCategory;
  color?: string;
  icon?: string;
  targetPerWeek?: number;
}

export interface CompleteHabitRequest {
  note?: string;
}

export interface CompleteHabitResponse {
  message: string;
  log: HabitLog;
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
  bestDayOfWeek: string;
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

export interface HabitLogResponse {
  data: HabitLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UpdateReminderRequest {
  reminderTime?: string;
  reminderOn: boolean;
}
