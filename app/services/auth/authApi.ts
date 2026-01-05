// src/features/auth/api/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  RegisterRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  LoginRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendPasswordResetRequest,
  AuthResponse,
  User,
} from './authTypes';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`,
    credentials: 'include', // to include httpOnly cookies for login/refresh
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    // Register new user
    register: builder.mutation<AuthResponse<{ user: User }>, RegisterRequest>({
      query: (body) => ({
        url: '/register',
        method: 'POST',
        body,
      }),
    }),

    // Verify email
    verifyEmail: builder.mutation<AuthResponse<{ user: User }>, VerifyEmailRequest>({
      query: (body) => ({
        url: '/verify-email',
        method: 'POST',
        body,
      }),
    }),

    // Resend verification email
    resendVerification: builder.mutation<AuthResponse, ResendVerificationRequest>({
      query: (body) => ({
        url: '/resend-verification-email',
        method: 'POST',
        body,
      }),
    }),

    // Login
    login: builder.mutation<AuthResponse<{ user: User }>, LoginRequest>({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Logout
    logout: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    // Refresh token
    // refreshToken: builder.mutation<AuthResponse<{ message: string }>, RefreshTokenRequest>({
    //   query: (body) => ({
    //     url: '/refresh-token',
    //     method: 'POST',
    //     body,
    //   }),
    // }),

    // Forgot password
    forgotPassword: builder.mutation<AuthResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation<AuthResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: '/reset-password',
        method: 'POST',
        body,
      }),
    }),

    // Resend password reset code
    resendPasswordReset: builder.mutation<AuthResponse, ResendPasswordResetRequest>({
      query: (body) => ({
        url: '/resend-password-reset-code',
        method: 'POST',
        body,
      }),
    }),

    // Get current user profile
    getCurrentUser: builder.query<AuthResponse<{ user: User }>, void>({
      query: () => ({
        url: '/me',
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
  }),
});

// Export hooks
export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useLoginMutation,
  useLogoutMutation,
  // useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendPasswordResetMutation,
  useGetCurrentUserQuery,
} = authApi;
