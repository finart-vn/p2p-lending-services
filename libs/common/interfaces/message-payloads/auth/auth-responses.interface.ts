// ===== AUTH SERVICE RESPONSE INTERFACES =====

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    isVerified: boolean;
  };
  tokens: AuthTokens;
  isFirstLogin: boolean;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
  };
  message: string;
}

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
