import { baseApi } from "./baseApi";
import type {
  AiInsightsResponse,
  AiSuggestionsResponse,
  AiChatResponse,
} from "@/types/ai.types";

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

    getAiSuggestions: builder.query<
      AiSuggestionsResponse,
      { refresh?: boolean } | void
    >({
      query: (params) => ({
        url: "/ai/suggestions",
        params: params ?? {},
      }),
    }),

    sendAiChat: builder.mutation<
      AiChatResponse,
      { message: string; conversationId?: string }
    >({
      query: (body) => ({
        url: "/ai/chat",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAiInsightsQuery,
  useGetAiSuggestionsQuery,
  useSendAiChatMutation,
} = aiApi;
