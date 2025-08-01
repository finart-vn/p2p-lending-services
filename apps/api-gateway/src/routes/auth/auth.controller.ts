import { AuthClient } from '@api-gateway/clients/auth.client';
import { UserClient } from '@api-gateway/clients/user.client';
import { LoginDto } from '@api-gateway/dtos/auth/login.dto';
import { RegisterDto } from '@api-gateway/dtos/auth/register.dto';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userClient: UserClient,
    private readonly authClient: AuthClient,
  ) {}

  @Post('login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    const user = await this.userClient.createUser(loginDto);
    const createToken = await this.authClient.createAuthToken(user);
    return {
      message: 'Login successful',
      user: JSON.stringify(user),
      createToken,
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
