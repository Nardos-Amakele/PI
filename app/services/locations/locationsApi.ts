import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Location,
  LocationData,
  LocationsData,
  CreateLocationRequest,
  ApiResponse,
} from "./locationsTypes";

export const locationsApi = createApi({
  reducerPath: "locationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Location"],
  endpoints: (builder) => ({
    // Create a location
    createLocation: builder.mutation<ApiResponse<LocationData>, CreateLocationRequest>({
      query: (body) => ({
        url: "/scheduling/locations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Location"],
    }),

    // Get all locations (with optional filters)
    getLocations: builder.query<
      ApiResponse<LocationsData>,
      | void
      | {
        page?: number;
        limit?: number;
        status?: "active" | "inactive";
        serviceCode?: number;
        locationType?: "surgical" | "clinical";
        name?: string;
        npiNumber?: string;
        city?: string;
        state?: string;
        postalCode?: string;
      }
    >({
      query: (params) => {
        const {
          page = 1,
          limit = 10,
          status,
          serviceCode,
          locationType,
          name,
          npiNumber,
          city,
          state,
          postalCode,
          ...rest
        } = params || {};
        return {
          url: "/scheduling/locations",
          method: "GET",
          params: {
            page,
            limit,
            status,
            serviceCode,
            locationType,
            name,
            npiNumber,
            city,
            state,
            postalCode,
            ...rest,
          },
        };
      },
      providesTags: ["Location"],
    }),


    // Get a location by ID
    getLocationById: builder.query<ApiResponse<LocationData>, string>({
      query: (id) => `/scheduling/locations/${id}`,
      providesTags: (result, error, id) => [{ type: "Location", id }],
    }),

    // Update a location
    updateLocation: builder.mutation<ApiResponse<LocationData>, { id: string; body: CreateLocationRequest }>({
      query: ({ id, body }) => ({
        url: `/scheduling/locations/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => ["Location", { type: "Location", id }],
    }),

    // Toggle location status
    toggleLocationStatus: builder.mutation<ApiResponse<LocationData>, string>({
      query: (id) => ({
        url: `/scheduling/locations/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => ["Location", { type: "Location", id }],
    }),

    // Delete a location
    deleteLocation: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/scheduling/locations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Location"],
    }),
  }),
});

export const {
  useCreateLocationMutation,
  useGetLocationsQuery,
  useGetLocationByIdQuery,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
  useToggleLocationStatusMutation,
} = locationsApi;
