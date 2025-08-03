// ===== AUTH SERVICE REQUEST INTERFACES =====
import {
  ApiLoginRequestDto,
  ApiRegisterRequestDto,
} from '@p2p-lending/api-gateway/src/dtos';

export interface LoginRequest extends ApiLoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequest extends ApiRegisterRequestDto {
  userId: string;
}

export interface ValidateTokenRequest {
  token: string;
  tokenType?: 'access' | 'refresh';
}

export interface RefreshTokenRequest {
  refreshToken: string;
  userId: string;
}

export interface RevokeTokenRequest {
  token: string;
  userId: string;
  tokenType: 'access' | 'refresh' | 'all';
}

export interface LogoutRequest {
  userId: string;
  token: string;
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
