import { baseApi } from "./baseApi";
import type {
  Challenge,
  ChallengeListResponse,
  JoinedChallengeListResponse,
  JoinChallengeResponse,
  CompleteChallengeResponse,
  LeaderboardResponse,
  CreateChallengeRequest,
} from "../types/challenge.types";

export const challengeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /challenges — public paginated list
    getChallenges: builder.query<
      ChallengeListResponse,
      { page?: number; limit?: number; active?: boolean }
    >({
      query: ({ page = 1, limit = 10, active } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (active !== undefined) params.set("active", String(active));
        return `/challenges?${params}`;
      },
      providesTags: ["Challenge"],
    }),

    // POST /challenges — create a new challenge
    createChallenge: builder.mutation<
      { challenge: Challenge },
      CreateChallengeRequest
    >({
      query: (body) => ({ url: "/challenges", method: "POST", body }),
      invalidatesTags: ["Challenge", "MyChallenge", "JoinedChallenge"],
    }),

    // GET /challenges/mine — challenges I created
    getMyChallenges: builder.query<ChallengeListResponse, void>({
      query: () => "/challenges/mine",
      providesTags: ["MyChallenge"],
    }),

    // GET /challenges/joined — challenges I joined (with progress)
    getJoinedChallenges: builder.query<JoinedChallengeListResponse, void>({
      query: () => "/challenges/joined",
      providesTags: ["JoinedChallenge"],
    }),

    // POST /challenges/:id/join
    joinChallenge: builder.mutation<
      JoinChallengeResponse,
      { id: string; joinCode?: string }
    >({
      query: ({ id, joinCode }) => ({
        url: `/challenges/${id}/join`,
        method: "POST",
        body: joinCode ? { joinCode } : {},
      }),
      invalidatesTags: ["Challenge", "JoinedChallenge"],
    }),

    // POST /challenges/:id/complete — free-form manual day completion
    completeChallengeDay: builder.mutation<
      CompleteChallengeResponse,
      { id: string; note?: string }
    >({
      query: ({ id, note }) => ({
        url: `/challenges/${id}/complete`,
        method: "POST",
        body: note ? { note } : {},
      }),
      invalidatesTags: ["JoinedChallenge", "ChallengeLeaderboard"],
    }),

    // GET /challenges/:id/leaderboard
    getLeaderboard: builder.query<LeaderboardResponse, string>({
      query: (id) => `/challenges/${id}/leaderboard`,
      providesTags: (_result, _error, id) => [
        { type: "ChallengeLeaderboard", id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetChallengesQuery,
  useCreateChallengeMutation,
  useGetMyChallengesQuery,
  useGetJoinedChallengesQuery,
  useJoinChallengeMutation,
  useCompleteChallengeDayMutation,
  useGetLeaderboardQuery,
} = challengeApi;
