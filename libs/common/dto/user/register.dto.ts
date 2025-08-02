import { Controller } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

@ApiTags('Auth')
@Controller('auth')
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email',
    example: 'hoaitran@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Password',
    example: '123456',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'First Name',
    example: 'Hoai',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Last Name',
    example: 'Tran',
  })
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Date of Birth',
    example: '1999-02-05',
  })
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Phone',
    example: '0909090909',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Address',
    example: '35/7 Nha Tho, Dang Tat',
  })
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'City',
    example: 'Nha Trang',
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Country',
    example: 'Vietnam',
  })
  country: string;
}
