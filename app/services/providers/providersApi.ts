import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ApiResponse,
  GetProvidersResponse,
  CreateProviderRequest,
  ProviderResponse,
  CapacitySetting,
  CapacitySettingResponse,
} from "./providersTypes";

export const providersApi = createApi({
  reducerPath: "providersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Providers", "ProviderCapacity"],
  endpoints: (builder) => ({

    /* ======================
       GET PROVIDERS (EXISTING)
    ====================== */

    getProviders: builder.query<
      GetProvidersResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/providers",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Providers"],
    }),
    /* ======================
       GET PROVIDER BY ID
    ====================== */

    getProviderById: builder.query<
      ApiResponse<ProviderResponse>,
      string
    >({
      query: (providerId) => `/providers/${providerId}`,
      providesTags: (result, error, providerId) => [
        { type: "Providers", id: providerId },
      ],
    }),

    /* ======================
       CREATE PROVIDER
    ====================== */

    createProvider: builder.mutation<
      ApiResponse<ProviderResponse>,
      CreateProviderRequest
    >({
      query: (body) => ({
        url: "/providers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Providers"],
    }),

    /* ======================
       GET PROVIDER CAPACITY
    ====================== */

    getProviderCapacitySetting: builder.query<
      ApiResponse<CapacitySettingResponse>,
      string
    >({
      query: (providerId) =>
        `/providers/${providerId}/capacity-setting`,
      providesTags: (result, error, providerId) => [
        { type: "ProviderCapacity", id: providerId },
      ],
    }),

    /* ======================
       UPDATE PROVIDER CAPACITY
    ====================== */

    updateProviderCapacitySetting: builder.mutation<
      ApiResponse<CapacitySettingResponse>,
      { providerId: string; body: CapacitySetting }
    >({
      query: ({ providerId, body }) => ({
        url: `/providers/${providerId}/capacity-setting`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { providerId }) => [
        { type: "ProviderCapacity", id: providerId },
      ],
    }),

  }),
});

export const {
  useGetProvidersQuery,
  useCreateProviderMutation,
  useGetProviderCapacitySettingQuery,
  useUpdateProviderCapacitySettingMutation,
  useGetProviderByIdQuery,
} = providersApi;
