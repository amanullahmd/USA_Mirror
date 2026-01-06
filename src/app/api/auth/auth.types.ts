/**
 * Auth API types
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface LoginResponse {
  success: boolean;
  email: string;
  username?: string;
  user?: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    emailVerified: boolean;
  };
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
