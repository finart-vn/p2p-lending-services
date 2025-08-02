import { LoginDto } from '../../../dto/auth/login.dto';
import { RegisterDto } from '../../../dto/auth/register.dto';

// ===== AUTH SERVICE REQUEST INTERFACES =====

export interface LoginRequest extends LoginDto {
  email: string;
  password: string;
}

export interface RegisterRequest extends RegisterDto {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phone: string;
  address: string;
  city: string;
  country: string;
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
