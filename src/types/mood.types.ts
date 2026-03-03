export interface MoodEntry {
  id: string;
  moodScore: number;
  emoji: string;
  journalId: string | null;
  userId: string;
  createdAt: string;
  journal?: {
    text: string;
    tags: string[];
  } | null;
}

export interface CreateMoodRequest {
  moodScore: number;
  emoji: string;
  journalText?: string;
  tags?: string[];
}

export interface UpdateMoodRequest {
  moodScore?: number;
  emoji?: string;
  journalText?: string | null;
  tags?: string[];
}

export interface MoodListResponse {
  data: MoodEntry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  planLimitApplied?: boolean;
}

export interface MoodAnalytics {
  totalEntries: number;
  averageMood: number;
  highestMood: number;
  lowestMood: number;
  mostFrequentMood: number;
  distribution: Record<string, number>;
}

export interface MoodStreak {
  currentStreak: number;
  longestStreak: number;
  lastLoggedDate: string;
}

export interface HeatmapDay {
  date: string;
  averageScore: number;
  count: number;
}

export interface MoodHeatmapResponse {
  heatmap: HeatmapDay[];
  totalDays: number;
  loggedDays: number;
}

export interface MoodCalendarDay {
  date: string;
  day: number;
  averageScore: number | null;
  count: number;
}

export interface MoodMonthlySummary {
  month: string;
  totalEntries: number;
  loggedDays: number;
  averageMood: number;
  bestDay: { date: string; averageScore: number };
  worstDay: { date: string; averageScore: number };
  calendar: MoodCalendarDay[];
}

export interface DayOfWeekData {
  day: string;
  averageMood: number;
  entries: number;
}

export interface TimeOfDayData {
  timeOfDay: string;
  averageMood: number;
  entries: number;
}

export interface MoodDailyInsights {
  analyzedEntries: number;
  dayOfWeekPattern: {
    data: DayOfWeekData[];
    bestDay: string;
    worstDay: string;
    mostActiveDay: string;
    insight: string;
  };
  timeOfDayPattern: {
    data: TimeOfDayData[];
    bestTime: string;
    mostActiveTime: string;
    insight: string;
  };
}

export interface WeeklyTrend {
  week: string;
  averageMood: number;
  entries: number;
}

export interface WeeklyTrendResponse {
  weeklyTrends: WeeklyTrend[];
}

export interface RollingAverageDay {
  date: string;
  averageMood: number;
}

export interface RollingAverageResponse {
  rollingAverage: RollingAverageDay[];
}

export interface BurnoutRisk {
  riskScore: number;
  riskLevel: "Low" | "Moderate" | "High";
  metrics: {
    totalEntries: number;
    averageMood: number;
    lowMoodDays: number;
    volatility: number;
  };
}
