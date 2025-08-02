// ===== USER SERVICE RESPONSE INTERFACES =====

export interface UserResponse {
  id: string;
  email: string;
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
