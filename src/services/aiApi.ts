import { baseApi } from "./baseApi";
import type { AiInsightsResponse } from "@/types/ai.types";

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiInsights: builder.query<
      AiInsightsResponse,
      { refresh?: boolean } | void
    >({
      query: (params) => ({
        url: "/ai/insights",
        params: params ?? {},
      }),
      providesTags: ["AiInsights"],
    }),
  }),
});

export const { useGetAiInsightsQuery } = aiApi;
