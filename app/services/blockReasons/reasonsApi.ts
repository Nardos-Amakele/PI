// blockReasonsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BlockReason, BlockReasonResponse, BlockReasonsListResponse } from './reasonsTypes';

export const blockReasonsApi = createApi({
    reducerPath: 'blockReasonsApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
    tagTypes: ['BlockReason'],
    endpoints: (builder) => ({
        // Create a new block reason
        createBlockReason: builder.mutation<BlockReasonResponse, BlockReason>({
            query: (body) => ({
                url: '/scheduling/block-reasons',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['BlockReason'],
        }),

        // Get all block reasons
        getBlockReasons: builder.query<BlockReasonsListResponse, void>({
            query: () => '/scheduling/block-reasons',
            providesTags: ['BlockReason'],
        }),

        // Get a block reason by ID
        getBlockReasonById: builder.query<BlockReasonResponse, string>({
            query: (id) => `/scheduling/block-reasons/${id}`,
            providesTags: (result, error, id) => [{ type: 'BlockReason', id }],
        }),

        // Update a block reason by ID
        updateBlockReason: builder.mutation<BlockReasonResponse, { id: string; body: BlockReason }>({
            query: ({ id, body }) => ({
                url: `/scheduling/block-reasons/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'BlockReason', id }],
        }),

        // Delete a block reason by ID
        deleteBlockReason: builder.mutation<{ success: boolean; message: string; statusCode: number }, string>({
            query: (id) => ({
                url: `/scheduling/block-reasons/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['BlockReason'],
        }),

        // Toggle status of block reason
        toggleBlockReasonStatus: builder.mutation<BlockReasonResponse, string>({
            query: (id) => ({
                url: `/scheduling/block-reasons/${id}/toggle-status`,
                method: 'PATCH',
            }),
            invalidatesTags: ['BlockReason'],
        }),
    }),
});

// Export hooks
export const {
    useCreateBlockReasonMutation,
    useGetBlockReasonsQuery,
    useGetBlockReasonByIdQuery,
    useUpdateBlockReasonMutation,
    useDeleteBlockReasonMutation,
    useToggleBlockReasonStatusMutation,
} = blockReasonsApi;
