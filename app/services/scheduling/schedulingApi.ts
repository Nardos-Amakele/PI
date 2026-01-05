import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  BookingPreference,
  BookingPreferenceResponse,
  BookingPreferencesResponse,
  CreateBookingPreferenceRequest,
  CreateScheduleTemplateRequest,
  ScheduleTemplate,
  ScheduleTemplateResponse,
  ScheduleTemplatesResponse,
  UpdateScheduleTemplateRequest,
} from "./schedulingTypes";

export const schedulingApi = createApi({
  reducerPath: "schedulingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["BookingPreference", "ScheduleTemplate"],
  endpoints: (builder) => ({

    /* ======================
       BOOKING PREFERENCES
    ====================== */

    createBookingPreference: builder.mutation<
      ApiResponse<BookingPreferenceResponse>,
      CreateBookingPreferenceRequest
    >({
      query: (body) => ({
        url: "/scheduling/booking-preferences",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BookingPreference"],
    }),

    getBookingPreferences: builder.query<
      ApiResponse<BookingPreferencesResponse>,
      { providerId?: string; serviceTypeId?: string } | void
    >({
      query: (params) => ({
        url: "/scheduling/booking-preferences",
        params: params ?? undefined,
      }),
      providesTags: ["BookingPreference"],
    }),

    getBookingPreferenceById: builder.query<
      ApiResponse<BookingPreferenceResponse>,
      string
    >({
      query: (id) => `/scheduling/booking-preferences/${id}`,
      providesTags: (result, error, id) => [
        { type: "BookingPreference", id },
      ],
    }),

    updateBookingPreference: builder.mutation<
      ApiResponse<BookingPreferenceResponse>,
      { id: string; body: Partial<CreateBookingPreferenceRequest> }
    >({
      query: ({ id, body }) => ({
        url: `/scheduling/booking-preferences/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["BookingPreference"],
    }),

    deleteBookingPreference: builder.mutation<
      ApiResponse<null>,
      string
    >({
      query: (id) => ({
        url: `/scheduling/booking-preferences/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BookingPreference"],
    }),

    /* ======================
       SCHEDULE TEMPLATES
    ====================== */

    createScheduleTemplate: builder.mutation<
      ApiResponse<ScheduleTemplateResponse>,
      CreateScheduleTemplateRequest
    >({
      query: (body) => ({
        url: "/scheduling/schedule-templates",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ScheduleTemplate"],
    }),

    getScheduleTemplates: builder.query<
      ApiResponse<ScheduleTemplatesResponse>,
      { providerId?: string; locationId?: string }
    >({
      query: (params) => ({
        url: "/scheduling/schedule-templates",
        params,
      }),
      providesTags: ["ScheduleTemplate"],
    }),

    getScheduleTemplateById: builder.query<
      ApiResponse<ScheduleTemplateResponse>,
      string
    >({
      query: (id) => `/scheduling/schedule-templates/${id}`,
      providesTags: (result, error, id) => [
        { type: "ScheduleTemplate", id },
      ],
    }),

    updateScheduleTemplate: builder.mutation<
      ApiResponse<ScheduleTemplateResponse>,
      { id: string; body: UpdateScheduleTemplateRequest }
    >({
      query: ({ id, body }) => ({
        url: `/scheduling/schedule-templates/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ScheduleTemplate"],
    }),

    deleteScheduleTemplate: builder.mutation<
      ApiResponse<null>,
      string
    >({
      query: (id) => ({
        url: `/scheduling/schedule-templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ScheduleTemplate"],
    }),

  }),
});

export const {
  /* Booking Preferences */
  useCreateBookingPreferenceMutation,
  useGetBookingPreferencesQuery,
  useGetBookingPreferenceByIdQuery,
  useUpdateBookingPreferenceMutation,
  useDeleteBookingPreferenceMutation,

  /* Schedule Templates */
  useCreateScheduleTemplateMutation,
  useGetScheduleTemplatesQuery,
  useGetScheduleTemplateByIdQuery,
  useUpdateScheduleTemplateMutation,
  useDeleteScheduleTemplateMutation,
} = schedulingApi;
