import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  AppointmentType,
  AppointmentTypeResponse,
  AppointmentTypesResponse,
  CreateAppointmentTypeRequest,
  UpdateAppointmentTypeRequest,
} from "./appointmentTypesTypes";

export const appointmentTypesApi = createApi({
  reducerPath: "appointmentTypesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["AppointmentType"],
  endpoints: (builder) => ({

    /* ======================
       CREATE APPOINTMENT TYPE
    ====================== */
 createAppointmentType: builder.mutation<
  ApiResponse<AppointmentTypeResponse>,
  CreateAppointmentTypeRequest
>({
  query: (body) => ({
    url: "/appointment-types",
    method: "POST",
    body,
  }),
  invalidatesTags: ["AppointmentType"],
}),


    /* ======================
       GET ALL APPOINTMENT TYPES
    ====================== */
    getAppointmentTypes: builder.query<
      ApiResponse<AppointmentTypesResponse>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/appointment-types",
        params: params ?? undefined,
      }),
      providesTags: ["AppointmentType"],
    }),

    /* ======================
       GET APPOINTMENT TYPE BY ID
    ====================== */
    getAppointmentTypeById: builder.query<
      ApiResponse<AppointmentTypeResponse>,
      string
    >({
      query: (id) => `/appointment-types/${id}`,
      providesTags: (result, error, id) => [{ type: "AppointmentType", id }],
    }),

    /* ======================
       UPDATE APPOINTMENT TYPE
    ====================== */
    updateAppointmentType: builder.mutation<
      ApiResponse<AppointmentTypeResponse>,
      { id: string; body: UpdateAppointmentTypeRequest }
    >({
      query: ({ id, body }) => ({
        url: `/appointment-types/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AppointmentType"],
    }),

    /* ======================
       DELETE APPOINTMENT TYPE
    ====================== */
    deleteAppointmentType: builder.mutation<
      ApiResponse<null>,
      string
    >({
      query: (id) => ({
        url: `/appointment-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AppointmentType"],
    }),
  }),
});

export const {
  useCreateAppointmentTypeMutation,
  useGetAppointmentTypesQuery,
  useGetAppointmentTypeByIdQuery,
  useUpdateAppointmentTypeMutation,
  useDeleteAppointmentTypeMutation,
} = appointmentTypesApi;
