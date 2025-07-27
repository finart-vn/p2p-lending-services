import { LoginDto } from '@api-gateway/dtos/auth/login.dto';
import { RegisterDto } from '@api-gateway/dtos/auth/register.dto';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    console.log(loginDto);
    return {
      message: 'Login successful',
    };
  }

  @Post('register')
  register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
    console.log(registerDto);
    return {
      message: 'Register successful',
    };
  }
}
