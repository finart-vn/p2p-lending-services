import { RegisterDto } from '@api-gateway/applications/DTOs';

import { CreateUserRequest } from './user-requests';

// ===== UTILITY TYPES =====

export type CreateUserFromRegisterDto = Omit<RegisterDto, 'password'>;

// Helper function to convert RegisterDto to CreateUserRequest
export const mapRegisterDtoToCreateUserRequest = (
  registerDto: RegisterDto,
): CreateUserRequest => ({
  email: registerDto.email,
  firstName: registerDto.firstName,
  lastName: registerDto.lastName,
  phone: registerDto.phone,
  role: registerDto.role,
});
