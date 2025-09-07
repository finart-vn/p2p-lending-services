// ===== USER SERVICE RESPONSE INTERFACES =====
import { RoleEnum } from '@user-service/prisma';

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  dateOfBirth: Date | null;
  address: string | null;
  city: string | null;
  country: string | null;
  role: RoleEnum;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListResponse {
  users: UserResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserCreateResponse extends UserResponse {
  createdBySystem: boolean;
}

export interface UserValidationResponse {
  isValid: boolean;
  user?: UserResponse;
  error?: string;
}

export interface UserVerificationResponse {
  id: string;
  isVerified: boolean;
  verifiedAt?: Date;
  verificationLevel: 'basic' | 'identity' | 'full';
}
