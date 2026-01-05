// providerTemplates.api.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    CreateProviderTemplateRequest,
    CreateProviderTemplateResponse,
    GetProviderTemplatesResponse,
    GetProviderTemplateResponse,
    UpdateProviderTemplateRequest,
    UpdateProviderTemplateResponse,
} from "./providerTemplatesTypes";

export const providerTemplatesApi = createApi({
    reducerPath: "providerTemplatesApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    }),
    tagTypes: ["ProviderTemplate"],
    endpoints: (builder) => ({
        /* ---------- CREATE ---------- */
        createProviderTemplate: builder.mutation<
            CreateProviderTemplateResponse,
            CreateProviderTemplateRequest
        >({
            query: ({ providerId, headerFile, footerFile, signatureFile, signatureRequired }) => {
                const formData = new FormData();

                if (headerFile) formData.append("headerFile", headerFile);
                if (footerFile) formData.append("footerFile", footerFile);
                formData.append("signatureFile", signatureFile);
                formData.append("signatureRequired", String(signatureRequired));

                return {
                    url: `/templates/${providerId}`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["ProviderTemplate"],
        }),

        /* ---------- LIST ---------- */
        getProviderTemplates: builder.query<
            GetProviderTemplatesResponse,
            { providerId: string }
        >({
            query: ({ providerId }) => `/templates/${providerId}`,
            providesTags: ["ProviderTemplate"],
        }),

        /* ---------- GET BY ID ---------- */
        getProviderTemplateById: builder.query<
            GetProviderTemplateResponse,
            { providerId: string; templateId: string }
        >({
            query: ({ providerId, templateId }) =>
                `/templates/${providerId}/${templateId}`,
            providesTags: ["ProviderTemplate"],
        }),

        /* ---------- UPDATE ---------- */
        updateProviderTemplate: builder.mutation<
            UpdateProviderTemplateResponse,
            UpdateProviderTemplateRequest
        >({
            query: ({
                providerId,
                templateId,
                headerFile,
                footerFile,
                signatureFile,
                signatureRequired,
            }) => {
                const formData = new FormData();

                if (headerFile) formData.append("headerFile", headerFile);
                if (footerFile) formData.append("footerFile", footerFile);
                if (signatureFile) formData.append("signatureFile", signatureFile);
                if (signatureRequired !== undefined) {
                    formData.append("signatureRequired", String(signatureRequired));
                }

                return {
                    url: `/templates/${providerId}/${templateId}`,
                    method: "PUT",
                    body: formData,
                };
            },
            invalidatesTags: ["ProviderTemplate"],
        }),
    }),
});

export const {
    useCreateProviderTemplateMutation,
    useGetProviderTemplatesQuery,
    useGetProviderTemplateByIdQuery,
    useUpdateProviderTemplateMutation,
} = providerTemplatesApi;
