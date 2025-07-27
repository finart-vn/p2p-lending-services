import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authClient: ClientProxy) {}

  @Post('login')
  login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    this.authClient.send('login', loginDto);
    return {
      message: 'Login successful',
    };
  }

  @Post('register')
  register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
    this.authClient.send('register', registerDto);
    return {
      message: 'Register successful',
    };
  }
}
