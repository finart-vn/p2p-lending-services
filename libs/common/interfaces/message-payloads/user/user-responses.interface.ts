// ===== USER SERVICE RESPONSE INTERFACES =====
import { RoleEnum } from '@p2p-lending/user-service/generated/prisma';

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: Date;
  address: string;
  city: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  roles: RoleEnum[];
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
