import { baseApi } from "./baseApi";
import type {
  FeedResponse,
  CommunityPost,
  CreatePostRequest,
  UpvoteResponse,
} from "../types/community.types";

export const communityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /community — public feed, optional sort/type/tag/page filters
    getCommunityFeed: builder.query<
      FeedResponse,
      {
        page?: number;
        limit?: number;
        sort?: "newest" | "popular";
        type?: "MILESTONE" | "REFLECTION";
        tag?: string;
      }
    >({
      query: ({ page = 1, limit = 20, sort = "newest", type, tag } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          sort,
        });
        if (type) params.set("type", type);
        if (tag) params.set("tag", tag);
        return `/community?${params}`;
      },
      providesTags: ["CommunityFeed"],
    }),

    // POST /community — create anonymous post (auth required)
    createCommunityPost: builder.mutation<
      { post: CommunityPost },
      CreatePostRequest
    >({
      query: (body) => ({ url: "/community", method: "POST", body }),
      invalidatesTags: ["CommunityFeed"],
    }),

    // POST /community/:id/upvote — toggle upvote
    toggleUpvote: builder.mutation<UpvoteResponse, string>({
      query: (id) => ({ url: `/community/${id}/upvote`, method: "POST" }),
      // Optimistic update handled in component; invalidate to sync
      invalidatesTags: ["CommunityFeed"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCommunityFeedQuery,
  useCreateCommunityPostMutation,
  useToggleUpvoteMutation,
} = communityApi;
