import { RegisterDto } from '../../../dto/auth/register.dto';
import { CreateUserRequest } from './user-requests.interface';

// ===== UTILITY TYPES =====

export type CreateUserFromRegisterDto = Omit<RegisterDto, 'password'>;

// Helper function to convert RegisterDto to CreateUserRequest
export const mapRegisterDtoToCreateUserRequest = (
  registerDto: RegisterDto,
): CreateUserRequest => ({
  email: registerDto.email,
  firstName: registerDto.firstName,
  lastName: registerDto.lastName,
  dateOfBirth: registerDto.dateOfBirth,
  phone: registerDto.phone,
  address: registerDto.address,
  city: registerDto.city,
  country: registerDto.country,
});
