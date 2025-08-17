// ===== USER SERVICE REQUEST INTERFACES =====

import { RoleEnum } from '@p2p-lending/user-service/generated/prisma';

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: RoleEnum;
}

export interface UpdateUserRequest {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface GetUserByIdRequest {
  id: string;
}

export interface GetUserByEmailRequest {
  email: string;
}

export interface DeleteUserRequest {
  id: string;
}

export interface GetUserListRequest {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'email' | 'firstName' | 'lastName';
  sortOrder?: 'asc' | 'desc';
}

export interface ValidateCredentialsRequest {
  email: string;
  password: string;
}

export interface UpdateUserProfileRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface VerifyIdentityRequest {
  id: string;
  documentType: 'passport' | 'national_id' | 'drivers_license';
  documentNumber: string;
  documentUrl?: string;
}

export interface UpdateLoanStatusRequest {
  userId: string;
  loanId: string;
  status: 'active' | 'completed' | 'defaulted';
}
