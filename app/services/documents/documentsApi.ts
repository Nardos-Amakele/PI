// documentClassification.api.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetDocumentClassificationResponse, GetDocumentsByPatientResponse, UploadDocumentRequest, UploadDocumentResponse } from "./documentsTypes";

export const documentClassificationApi = createApi({
    reducerPath: "documentClassificationApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    }),
    tagTypes: ["DocumentClassification", "Document"],
    endpoints: (builder) => ({
        getDocumentClassification: builder.query<
            GetDocumentClassificationResponse,
            void
        >({
            query: () => "/documents/classification",
            providesTags: ["DocumentClassification"],
        }),

        getDocumentsByPatient: builder.query<GetDocumentsByPatientResponse, string>({
            query: (patientId) => `/documents/list/${patientId}`,
            providesTags: (result, error, patientId) => [
                { type: "Document", id: patientId },
                { type: "Document", id: "LIST" },
            ],
        }),

        uploadDocument: builder.mutation<UploadDocumentResponse, UploadDocumentRequest>({
            query: ({ files, patientId, categoryId, typeId, subTypeId, originalName, dateOfStudy, uploadedBy, notes }) => {
                const formData = new FormData();
                files.forEach((file) => formData.append("files", file));
                formData.append("patientId", patientId);
                formData.append("categoryId", categoryId);
                formData.append("typeId", typeId);
                if (subTypeId) formData.append("subTypeId", subTypeId);
                if (originalName) formData.append("originalName", originalName);
                if (dateOfStudy) formData.append("dateOfStudy", dateOfStudy);
                if (uploadedBy) formData.append("uploadedBy", uploadedBy);
                if (notes) formData.append("notes", notes);

                return {
                    url: "/documents/upload",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["Document"],
        }),
    }),
});

export const {
    useGetDocumentClassificationQuery,
    useGetDocumentsByPatientQuery,
    useUploadDocumentMutation,
} = documentClassificationApi;
