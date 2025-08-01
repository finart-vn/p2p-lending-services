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
  login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    console.log(loginDto);
  }

  @Post('register')
  async register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
    const user = await this.userClient.createUser(registerDto);
    const createToken = await this.authClient.createAuthToken({
      email: user.email,
      password: registerDto.password,
      userId: user.id,
    });
    return {
      message: 'Login successful',
      user: JSON.stringify(user),
      createToken,
    };
  }
}
