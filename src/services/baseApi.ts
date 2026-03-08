import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout, updateAccessToken } from "@/features/auth/authSlice";
import type { RootState } from "@/app/store";
import type { TokenResponse } from "@/types/auth.types";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        { url: "/auth/refresh-token", method: "POST", body: { refreshToken } },
        api,
        extraOptions,
      );
      if (refreshResult.data) {
        api.dispatch(updateAccessToken(refreshResult.data as TokenResponse));
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "MoodEntry",
    "MoodAnalytics",
    "MoodStreak",
    "MoodHeatmap",
    "MoodSummary",
    "MoodInsights",
    "MoodTrends",
    "MoodRolling",
    "BurnoutRisk",
    "Habit",
    "HabitLog",
    "HabitStreak",
    "HabitAnalytics",
    "HabitSummary",
    "HabitHeatmap",
    "AiInsights",
    "BillingStatus",
    "Badge",
    "Notification",
    "Challenge",
    "MyChallenge",
    "JoinedChallenge",
    "ChallengeLeaderboard",
    "CommunityFeed",
    "UserProfile", // getMe + updatePreferences
  ],
  endpoints: () => ({}),
});
