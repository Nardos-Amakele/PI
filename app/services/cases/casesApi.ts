// cases.api.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CreateCaseRequest,
  CreateCaseResponse,
  GetCasesByPatientResponse,
} from "./casesTypes";

export const casesApi = createApi({
  reducerPath: "casesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Case"],
  endpoints: (builder) => ({
    /* ---------- GET CASES BY PATIENT ---------- */
    getCasesByPatient: builder.query<GetCasesByPatientResponse, string>({
      query: (patientId) => `/cases/patient/${patientId}`,
      providesTags: (result) =>
        result?.data?.cases
          ? [
            ...result.data.cases.map(({ id }) => ({ type: "Case" as const, id })),
            { type: "Case" as const, id: "LIST" },
          ]
          : [{ type: "Case" as const, id: "LIST" }],
    }),

    /* ---------- CREATE CASE ---------- */
    createCase: builder.mutation<CreateCaseResponse, CreateCaseRequest>({
      query: (body) => ({
        url: "/cases",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Case"],
    }),
  }),
});

export const {
  useGetCasesByPatientQuery,
  useCreateCaseMutation,
} = casesApi;
