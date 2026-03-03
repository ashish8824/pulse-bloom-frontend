import { baseApi } from "./baseApi";
import type {
  Habit,
  HabitAnalytics,
  HabitStreak,
  HabitHeatmapResponse,
  HabitMonthlySummary,
  HabitLogResponse,
  CreateHabitRequest,
  UpdateHabitRequest,
  CompleteHabitRequest,
  CompleteHabitResponse,
  ReorderHabitsRequest,
  UpdateReminderRequest,
} from "@/types/habit.types";

export const habitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createHabit: builder.mutation<Habit, CreateHabitRequest>({
      query: (body) => ({ url: "/habits", method: "POST", body }),
      invalidatesTags: ["Habit"],
    }),

    getHabits: builder.query<Habit[], { category?: string } | void>({
      query: (params) => ({ url: "/habits", params: params ?? {} }),
      providesTags: ["Habit"],
    }),

    getArchivedHabits: builder.query<Habit[], void>({
      query: () => "/habits/archived",
      providesTags: ["Habit"],
    }),

    updateHabit: builder.mutation<
      Habit,
      { id: string; body: UpdateHabitRequest }
    >({
      query: ({ id, body }) => ({
        url: `/habits/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Habit"],
    }),

    deleteHabit: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/habits/${id}`, method: "DELETE" }),
      invalidatesTags: ["Habit"],
    }),

    restoreHabit: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/habits/${id}/restore`, method: "PATCH" }),
      invalidatesTags: ["Habit"],
    }),

    reorderHabits: builder.mutation<{ message: string }, ReorderHabitsRequest>({
      query: (body) => ({ url: "/habits/reorder", method: "PATCH", body }),
      invalidatesTags: ["Habit"],
    }),

    completeHabit: builder.mutation<
      CompleteHabitResponse,
      { id: string; body: CompleteHabitRequest }
    >({
      query: ({ id, body }) => ({
        url: `/habits/${id}/complete`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "HabitLog",
        "HabitStreak",
        "HabitAnalytics",
        "HabitHeatmap",
        "HabitSummary",
      ],
    }),

    undoCompletion: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/habits/${id}/complete`, method: "DELETE" }),
      invalidatesTags: [
        "HabitLog",
        "HabitStreak",
        "HabitAnalytics",
        "HabitHeatmap",
        "HabitSummary",
      ],
    }),

    updateReminder: builder.mutation<
      { message: string },
      { id: string; body: UpdateReminderRequest }
    >({
      query: ({ id, body }) => ({
        url: `/habits/${id}/reminder`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Habit"],
    }),

    getHabitStreak: builder.query<HabitStreak, string>({
      query: (id) => `/habits/${id}/streak`,
      providesTags: ["HabitStreak"],
    }),

    getHabitAnalytics: builder.query<HabitAnalytics, string>({
      query: (id) => `/habits/${id}/analytics`,
      providesTags: ["HabitAnalytics"],
    }),

    getHabitMonthlySummary: builder.query<
      HabitMonthlySummary,
      { id: string; month?: string }
    >({
      query: ({ id, month }) => ({
        url: `/habits/${id}/summary`,
        params: month ? { month } : {},
      }),
      providesTags: ["HabitSummary"],
    }),

    getHabitHeatmap: builder.query<
      HabitHeatmapResponse,
      { id: string; days?: number }
    >({
      query: ({ id, days }) => ({
        url: `/habits/${id}/heatmap`,
        params: days ? { days } : {},
      }),
      providesTags: ["HabitHeatmap"],
    }),

    getHabitLogs: builder.query<
      HabitLogResponse,
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, ...params }) => ({ url: `/habits/${id}/logs`, params }),
      providesTags: ["HabitLog"],
    }),
  }),
});

export const {
  useCreateHabitMutation,
  useGetHabitsQuery,
  useGetArchivedHabitsQuery,
  useUpdateHabitMutation,
  useDeleteHabitMutation,
  useRestoreHabitMutation,
  useReorderHabitsMutation,
  useCompleteHabitMutation,
  useUndoCompletionMutation,
  useUpdateReminderMutation,
  useGetHabitStreakQuery,
  useGetHabitAnalyticsQuery,
  useGetHabitMonthlySummaryQuery,
  useGetHabitHeatmapQuery,
  useGetHabitLogsQuery,
} = habitApi;
