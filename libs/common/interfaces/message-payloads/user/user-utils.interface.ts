import { ApiRegisterRequestDto } from '@p2p-lending/api-gateway/src/dtos';

import { CreateUserRequest } from './user-requests.interface';

// ===== UTILITY TYPES =====

export type CreateUserFromRegisterDto = Omit<ApiRegisterRequestDto, 'password'>;

// Helper function to convert RegisterDto to CreateUserRequest
export const mapRegisterDtoToCreateUserRequest = (
  registerDto: ApiRegisterRequestDto,
): CreateUserRequest => ({
  email: registerDto.email,
  firstName: registerDto.firstName,
  lastName: registerDto.lastName,
  dateOfBirth: new Date(registerDto.dateOfBirth),
  phone: registerDto.phone,
  address: registerDto.address,
  city: registerDto.city,
  country: registerDto.country,
  role: registerDto.role,
});
