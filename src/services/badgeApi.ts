import { baseApi } from "./baseApi";
import type { BadgeShelfResponse } from "../types/badge.types";

export const badgeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBadgeShelf: builder.query<BadgeShelfResponse, void>({
      query: () => "/badges",
      providesTags: ["Badge"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetBadgeShelfQuery } = badgeApi;
