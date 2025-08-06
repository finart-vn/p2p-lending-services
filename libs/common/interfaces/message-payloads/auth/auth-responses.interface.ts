// ===== AUTH SERVICE RESPONSE INTERFACES =====

import { UserAuth } from '@p2p-lending/auth-service/generated/prisma';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    isVerified: boolean;
    isActive: boolean;
  };
  tokens: AuthTokens;
}

export type RegisterResponse = Omit<UserAuth, 'passwordHash'>;

export interface TokenValidationResponse {
  isValid: boolean;
  userId?: string;
  email?: string;
  roles?: string[];
  expiresAt?: Date;
  error?: string;
}

export interface RefreshTokenResponse {
  tokens: AuthTokens;
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface OtpVerificationResponse {
  success: boolean;
  message: string;
  isVerified: boolean;
  nextStep?: 'complete_registration' | 'login' | 'reset_password';
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  requiresLogin: boolean;
}
