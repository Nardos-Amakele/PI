// src/features/service-types/api/serviceTypesApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ServiceType, PaginatedServiceTypes, ApiResponse } from './serviceTypes';

export const serviceApi = createApi({
  reducerPath: 'serviceApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  tagTypes: ['ServiceType'],
  endpoints: (builder) => ({
    // CREATE
    createServiceType: builder.mutation<ApiResponse<ServiceType>, ServiceType>({
      query: (body) => ({
        url: '/service-types',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ServiceType'],
    }),

    // GET all with pagination
    // getServiceTypes: builder.query<PaginatedServiceTypes, { page?: number; limit?: number }>({
    //   query: ({ page = 1, limit = 10 }) => `/service-types?page=${page}&limit=${limit}`,
    //   providesTags: ['ServiceType'],
    // }),

    // GET all without pagination

    getServiceTypes: builder.query<
      ApiResponse<ServiceType[]>,
      void
    >({
      query: () => ({
        url: '/service-types',
      }),
      providesTags: ['ServiceType'],
    }),

    // GET by ID
    getServiceTypeById: builder.query<ServiceType, string>({
      query: (id) => `/service-types/${id}`,
      providesTags: (result, error, id) => [{ type: 'ServiceType', id }],
    }),

    // UPDATE
    updateServiceType: builder.mutation<ApiResponse<ServiceType>, { id: string; data: ServiceType }>({
      query: ({ id, data }) => ({
        url: `/service-types/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'ServiceType', id }],
    }),

    // DELETE
    deleteServiceType: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/service-types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ServiceType'],
    }),
  }),
});

export const {
  useCreateServiceTypeMutation,
  useGetServiceTypesQuery,
  useGetServiceTypeByIdQuery,
  useLazyGetServiceTypeByIdQuery,
  useUpdateServiceTypeMutation,
  useDeleteServiceTypeMutation,
} = serviceApi;
