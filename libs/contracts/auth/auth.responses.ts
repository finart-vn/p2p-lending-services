// ===== AUTH SERVICE RESPONSE INTERFACES =====

import { UserAuth } from '@p2p-lending/auth-service/generated/prisma';

import { UserResponse } from '../user';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type LoginResponse = {
  user: {
    id: string;
    email: string;
    isVerified: boolean;
    emailVerifiedAt: Date | null;
    isActive: boolean;
  };
  tokens: AuthTokens;
};

export type RegisterResponseMQ = {
  userAuthCreated: Omit<UserAuth, 'passwordHash'>;
  tokenKey: AuthTokens;
};

export interface RegisterResponseApi {
  user: UserResponse &
    Pick<UserAuth, 'emailVerified' | 'emailVerifiedAt' | 'isActive'>;
  accessToken: string;
}
export interface TokenValidationResponse {
  isValid: boolean;
  userId?: string;
  email?: string;
  roles?: string[];
  expiresAt?: Date;
  error?: string;
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
export interface TokenPayloadDto {
  tid: string;
  sub: string;
  iat?: number;
  exp?: number;
}
