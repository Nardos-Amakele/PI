// src/features/auth/types.ts

export interface User {
  id: string;
  fullName?: string;
  email: string;
  profileId?: number;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse<T = any> {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
}

export interface AuthError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResendPasswordResetRequest {
  email: string;
}
