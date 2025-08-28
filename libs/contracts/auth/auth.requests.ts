// ===== AUTH SERVICE REQUEST INTERFACES =====
import { LoginDto, RegisterDto } from '@api-gateway/applications/DTOs';

export type LoginRequest = LoginDto;

export interface RegisterRequest extends RegisterDto {
  userId: string;
}

export interface ValidateTokenRequest {
  token: string;
  tokenType?: 'access' | 'refresh';
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RevokeTokenRequest {
  token: string;
  userId: string;
  tokenType: 'access' | 'refresh' | 'all';
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  purpose: 'registration' | 'password_reset' | 'login_verification';
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  resetToken: string;
}
