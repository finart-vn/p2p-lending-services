import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @IsISO8601()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Date of birth in ISO format',
    example: '1990-01-01T00:00:00.000Z',
  })
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Phone number',
    example: '+1234567890',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Address',
    example: '123 Main St',
  })
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'City',
    example: 'New York',
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Country',
    example: 'United States',
  })
  country: string;
}
