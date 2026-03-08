import { baseApi } from "./baseApi";
import type {
  CorrelationResponse,
  HabitMatrixResponse,
} from "@/types/analytics.types";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCorrelation: builder.query<CorrelationResponse, void>({
      query: () => "/analytics/correlation",
    }),

    getHabitMatrix: builder.query<HabitMatrixResponse, void>({
      query: () => "/analytics/habit-matrix",
    }),
  }),
  overrideExisting: false,
});

export const { useGetCorrelationQuery, useGetHabitMatrixQuery } = analyticsApi;
