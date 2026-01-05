import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Referral,
  PaginatedReferrals,
  ProcessEmailRequest,
  ApiResponse,
} from "./referralsTypes";

export const referralsApi = createApi({
  reducerPath: "referralsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Referral"],
  endpoints: (builder) => ({
    // Process email content
    processEmail: builder.mutation<ApiResponse<Referral>, ProcessEmailRequest>({
      query: (body) => ({
        url: "/referrals/process-email",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Referral"],
    }),

    // ✅ FIXED: wrapped in ApiResponse
    getReferrals: builder.query<
      ApiResponse<PaginatedReferrals>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/referrals?page=${page}&limit=${limit}`,
      providesTags: ["Referral"],
    }),

    // Get a referral by ID
    getReferralById: builder.query<ApiResponse<Referral>, number>({
      query: (id) => `/referrals/${id}`,
      providesTags: (result, error, id) => [{ type: "Referral", id }],
    }),
  }),
});

export const {
  useProcessEmailMutation,
  useGetReferralsQuery,
  useGetReferralByIdQuery,
} = referralsApi;
