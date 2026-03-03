import { baseApi } from "./baseApi";
import type {
  MoodEntry,
  MoodListResponse,
  CreateMoodRequest,
  UpdateMoodRequest,
  MoodAnalytics,
  MoodStreak,
  MoodHeatmapResponse,
  MoodMonthlySummary,
  MoodDailyInsights,
  WeeklyTrendResponse,
  RollingAverageResponse,
  BurnoutRisk,
} from "@/types/mood.types";

export const moodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMood: builder.mutation<MoodEntry, CreateMoodRequest>({
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

    getMoods: builder.query<
      MoodListResponse,
      { page?: number; limit?: number; startDate?: string; endDate?: string }
    >({
      query: (params) => ({ url: "/mood", params }),
      providesTags: ["MoodEntry"],
    }),

    getMoodById: builder.query<MoodEntry, string>({
      query: (id) => `/mood/${id}`,
      providesTags: ["MoodEntry"],
    }),

    updateMood: builder.mutation<
      MoodEntry,
      { id: string; body: UpdateMoodRequest }
    >({
      query: ({ id, body }) => ({ url: `/mood/${id}`, method: "PATCH", body }),
      invalidatesTags: [
        "MoodEntry",
        "MoodAnalytics",
        "MoodHeatmap",
        "MoodSummary",
      ],
    }),

    deleteMood: builder.mutation<{ message: string }, string>({
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

    getMoodAnalytics: builder.query<
      MoodAnalytics,
      { startDate?: string; endDate?: string } | void
    >({
      query: (params) => ({ url: "/mood/analytics", params: params ?? {} }),
      providesTags: ["MoodAnalytics"],
    }),

    getMoodStreak: builder.query<MoodStreak, void>({
      query: () => "/mood/streak",
      providesTags: ["MoodStreak"],
    }),

    getMoodHeatmap: builder.query<
      MoodHeatmapResponse,
      { days?: number } | void
    >({
      query: (params) => ({ url: "/mood/heatmap", params: params ?? {} }),
      providesTags: ["MoodHeatmap"],
    }),

    getMoodMonthlySummary: builder.query<
      MoodMonthlySummary,
      { month?: string } | void
    >({
      query: (params) => ({
        url: "/mood/summary/monthly",
        params: params ?? {},
      }),
      providesTags: ["MoodSummary"],
    }),

    getMoodDailyInsights: builder.query<
      MoodDailyInsights,
      { startDate?: string; endDate?: string } | void
    >({
      query: (params) => ({
        url: "/mood/insights/daily",
        params: params ?? {},
      }),
      providesTags: ["MoodInsights"],
    }),

    getWeeklyTrends: builder.query<WeeklyTrendResponse, void>({
      query: () => "/mood/trends/weekly",
      providesTags: ["MoodTrends"],
    }),

    getRollingAverage: builder.query<RollingAverageResponse, void>({
      query: () => "/mood/trends/rolling",
      providesTags: ["MoodRolling"],
    }),

    getBurnoutRisk: builder.query<BurnoutRisk, void>({
      query: () => "/mood/burnout-risk",
      providesTags: ["BurnoutRisk"],
    }),
  }),
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
} = moodApi;
