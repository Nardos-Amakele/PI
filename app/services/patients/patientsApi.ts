// src/features/patients/api/patientsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GetPatientsResponse, GetPatientByIdResponse, PaginatedPatients, Patient, PatientAlertsResponse, PatientNotesResponse } from './patientsTypes';

export const patientsApi = createApi({
  reducerPath: 'patientsApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  tagTypes: ['Patient'],
  endpoints: (builder) => ({
    // CREATE a new patient
    createPatient: builder.mutation<Patient, Patient>({
      query: (newPatient) => ({
        url: '/patients',
        method: 'POST',
        body: newPatient,
      }),
      invalidatesTags: ['Patient'],
    }),

    // GET all patients with pagination
    getPatients: builder.query<GetPatientsResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/patients?page=${page}&limit=${limit}`,
      providesTags: ['Patient'],
    }),


    // GET a patient by ID
    getPatientById: builder.query<GetPatientByIdResponse, string>({
      query: (id) => `/patients/${id}`,
      providesTags: (result, error, id) => [{ type: 'Patient', id }],
    }),

    // UPDATE a patient by ID
    updatePatient: builder.mutation<Patient, { id: number; data: Patient }>({
      query: ({ id, data }) => ({
        url: `/patients/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Patient', id }],
    }),

    // DELETE a patient by ID
    deletePatient: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/patients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Patient'],
    }),

    // GET alerts for a patient
    getPatientAlerts: builder.query<PatientAlertsResponse, string>({
      query: (id) => `/patients/${id}/alerts`,
      providesTags: (result, error, id) => [{ type: 'Patient', id }],
    }),
    // GET notes for a patient
    getPatientNotes: builder.query<PatientNotesResponse, string>({
      query: (id) => `/patients/${id}/notes`,
      providesTags: (result, error, id) => [{ type: 'Patient', id }],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreatePatientMutation,
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useGetPatientAlertsQuery,
  useGetPatientNotesQuery,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientsApi;