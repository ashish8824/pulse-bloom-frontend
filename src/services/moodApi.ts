import { baseApi } from "./baseApi";
import type {
  MoodEntry,
  CreateMood,
  UpdateMood,
  MoodListResponse,
  MoodAnalytics,
  MoodStreak,
  MoodHeatmapResponse,
  MoodMonthlySummary,
  MoodDailyInsights,
  WeeklyTrend,
  RollingAverageDay,
  BurnoutRisk,
  SentimentTrendsResponse,
  MoodForecastResponse,
} from "@/types/mood.types";

export const moodApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ── CREATE ───────────────────────────────────────────────────
    createMood: build.mutation<MoodEntry, CreateMood>({
      query: (body) => ({ url: "/mood", method: "POST", body }),
      invalidatesTags: [
        "MoodEntry",
        "MoodAnalytics",
        "MoodStreak",
        "MoodHeatmap",
        "MoodSummary",
        "BurnoutRisk",
      ],
    }),

    // ── LIST — paginated ─────────────────────────────────────────
    getMoods: build.query<
      MoodListResponse,
      {
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: (params = {}) => ({ url: "/mood", params }),
      providesTags: ["MoodEntry"],
    }),

    // ── SINGLE ───────────────────────────────────────────────────
    getMoodById: build.query<MoodEntry, string>({
      query: (id) => `/mood/${id}`,
      providesTags: ["MoodEntry"],
    }),

    // ── UPDATE ───────────────────────────────────────────────────
    updateMood: build.mutation<MoodEntry, { id: string; body: UpdateMood }>({
      query: ({ id, body }) => ({ url: `/mood/${id}`, method: "PATCH", body }),
      invalidatesTags: [
        "MoodEntry",
        "MoodAnalytics",
        "MoodHeatmap",
        "MoodSummary",
      ],
    }),

    // ── DELETE ───────────────────────────────────────────────────
    deleteMood: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/mood/${id}`, method: "DELETE" }),
      invalidatesTags: [
        "MoodEntry",
        "MoodAnalytics",
        "MoodStreak",
        "MoodHeatmap",
        "MoodSummary",
        "BurnoutRisk",
      ],
    }),

    // ── ANALYTICS ────────────────────────────────────────────────
    getMoodAnalytics: build.query<
      MoodAnalytics,
      {
        startDate?: string;
        endDate?: string;
      } | void
    >({
      query: (params) => ({ url: "/mood/analytics", params: params ?? {} }),
      providesTags: ["MoodAnalytics"],
    }),

    // ── STREAK ───────────────────────────────────────────────────
    getMoodStreak: build.query<MoodStreak, void>({
      query: () => "/mood/streak",
      providesTags: ["MoodStreak"],
    }),

    // ── HEATMAP ──────────────────────────────────────────────────
    getMoodHeatmap: build.query<MoodHeatmapResponse, { days?: number }>({
      query: (params) => ({ url: "/mood/heatmap", params }),
      providesTags: ["MoodHeatmap"],
    }),

    // ── MONTHLY SUMMARY ── fixed URL: /mood/summary/monthly ──────
    getMoodMonthlySummary: build.query<
      MoodMonthlySummary,
      { month?: string } | void
    >({
      query: (params) => ({
        url: "/mood/summary/monthly",
        params: params ?? {},
      }),
      providesTags: ["MoodSummary"],
    }),

    // ── DAILY INSIGHTS ── fixed URL: /mood/insights/daily ────────
    getMoodDailyInsights: build.query<
      MoodDailyInsights,
      {
        startDate?: string;
        endDate?: string;
      } | void
    >({
      query: (params) => ({
        url: "/mood/insights/daily",
        params: params ?? {},
      }),
      providesTags: ["MoodInsights"],
    }),

    // ── WEEKLY TRENDS ── fixed URL: /mood/trends/weekly ──────────
    getWeeklyTrends: build.query<
      { weeklyTrends: WeeklyTrend[] },
      {
        startDate?: string;
        endDate?: string;
      } | void
    >({
      query: (params) => ({
        url: "/mood/trends/weekly",
        params: params ?? {},
      }),
      providesTags: ["MoodTrends"],
    }),

    // ── ROLLING AVERAGE ── fixed URL: /mood/trends/rolling ───────
    getRollingAverage: build.query<
      { rollingAverage: RollingAverageDay[] },
      {
        startDate?: string;
        endDate?: string;
      } | void
    >({
      query: (params) => ({
        url: "/mood/trends/rolling",
        params: params ?? {},
      }),
      providesTags: ["MoodRolling"],
    }),

    // ── BURNOUT RISK ── fixed URL: /mood/burnout-risk ─────────────
    getBurnoutRisk: build.query<
      BurnoutRisk,
      {
        startDate?: string;
        endDate?: string;
      } | void
    >({
      query: (params) => ({
        url: "/mood/burnout-risk",
        params: params ?? {},
      }),
      providesTags: ["BurnoutRisk"],
    }),

    // ── NEW: SENTIMENT TRENDS ── /mood/sentiment/trends ──────────
    getSentimentTrends: build.query<SentimentTrendsResponse, void>({
      query: () => "/mood/sentiment/trends",
      providesTags: ["MoodTrends"],
    }),

    // ── NEW: MOOD FORECAST ── /mood/forecast ─────────────────────
    getMoodForecast: build.query<
      MoodForecastResponse,
      { days?: number } | void
    >({
      query: (params) => ({
        url: "/mood/forecast",
        params: params ?? {},
      }),
      // No cache tag — forecast changes with time, not mutations
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateMoodMutation,
  useGetMoodsQuery,
  useGetMoodByIdQuery,
  useUpdateMoodMutation,
  useDeleteMoodMutation,
  useGetMoodAnalyticsQuery,
  useGetMoodStreakQuery,
  useGetMoodHeatmapQuery,
  useGetMoodMonthlySummaryQuery,
  useGetMoodDailyInsightsQuery,
  useGetWeeklyTrendsQuery,
  useGetRollingAverageQuery,
  useGetBurnoutRiskQuery,
  useGetSentimentTrendsQuery, // 🆕
  useGetMoodForecastQuery, // 🆕
} = moodApi;
