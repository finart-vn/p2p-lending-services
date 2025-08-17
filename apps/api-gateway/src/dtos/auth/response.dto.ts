import { ApiProperty } from '@nestjs/swagger';
import { UserAuth } from '@p2p-lending/auth-service/generated/prisma';
import { UserResponse } from '@p2p-lending/common/interfaces/message-payloads';
import { IsNotEmpty, IsString } from 'class-validator';

import { ApiResponseDto } from '../common.dto';

// ===== API AUTH RESPONSE DTOs (External Interface) =====

export class ApiUserDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  //   @ApiProperty({
  //     description: 'User first name',
  //     example: 'John',
  //   })
  //   firstName: string;

  //   @ApiProperty({
  //     description: 'User last name',
  //     example: 'Doe',
  //   })
  //   lastName: string;

  //   @ApiProperty({
  //     description: 'User verification status',
  //     example: true,
  //   })
  //   isVerified: boolean;

  //   @ApiProperty({
  //     description: 'User roles',
  //     example: ['user'],
  //     type: [String],
  //   })
  //   roles: string[];

  //   @ApiProperty({
  //     description: 'Account creation date',
  //     example: '2024-01-01T00:00:00Z',
  //   })
  //   createdAt: string;
}

export class UserAuthResponseDto {
  @ApiProperty({
    description: 'Access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: '123',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      dateOfBirth: '1990-01-01',
      address: '123 Main St',
      city: 'New York',
      country: 'United States',
      role: 'BORROWER',
      createdAt: '2021-01-01',
      updatedAt: '2021-01-01',
    },
  })
  @IsString()
  @IsNotEmpty()
  user: UserResponse &
    Pick<UserAuth, 'emailVerified' | 'emailVerifiedAt' | 'isActive'>;
}

export class ApiUserAuthResponseDto extends ApiResponseDto<UserAuthResponseDto> {
  @ApiProperty({
    description: 'User information',
    type: UserAuthResponseDto,
  })
  override data: UserAuthResponseDto;
}

export class ApiAuthTokensDto {
  @ApiProperty({
    description: 'Access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Access token expiration time in seconds',
    example: 3600,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Refresh token expiration time in seconds',
    example: 604800,
  })
  refreshExpiresIn: number;
}

export class ApiLoginResponseDto {
  @ApiProperty({
    description: 'User information',
    type: ApiUserDto,
  })
  user: ApiUserDto;

  @ApiProperty({
    description: 'Authentication tokens',
    type: ApiAuthTokensDto,
  })
  tokens: ApiAuthTokensDto;

  @ApiProperty({
    description: "Indicates if this is the user's first login",
    example: false,
  })
  isFirstLogin: boolean;
}

export class RegisterResponseDto {
  @ApiProperty({
    description: 'User information',
    type: ApiUserDto,
  })
  user: ApiUserDto;

  @ApiProperty({
    description: 'Registration message',
    example: 'User registered successfully. Please verify your email.',
  })
  message: string;

  @ApiProperty({
    description: 'Indicates if verification is required',
    example: true,
  })
  verificationRequired: boolean;
}

export class ApiOtpVerificationResponseDto {
  @ApiProperty({
    description: 'Verification success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Verification message',
    example: 'Email verified successfully',
  })
  message: string;

  @ApiProperty({
    description: 'User verification status',
    example: true,
  })
  isVerified: boolean;

  @ApiProperty({
    description: 'Next step in the process',
    example: 'complete_registration',
    required: false,
  })
  nextStep?: 'complete_registration' | 'login' | 'reset_password';
}
