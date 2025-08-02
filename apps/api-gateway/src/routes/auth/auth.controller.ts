import { AuthClient } from '@api-gateway/clients/auth.client';
import { UserClient } from '@api-gateway/clients/user.client';
import { Body, Controller, Logger, Post, ValidationPipe } from '@nestjs/common';
import { LoginDto } from '@p2p-lending/common/dto/user/login.dto';
import { RegisterDto } from '@p2p-lending/common/dto/user/register.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
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
    this.logger.log(`Registering user: ${JSON.stringify(registerDto)}`);
    const user = await this.userClient.createUser(registerDto);
    const createToken = await this.authClient.createAuthToken(user);

    return {
      message: 'Login successful',
      user: JSON.stringify(user),
      createToken,
    };
  }
}
