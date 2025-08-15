import { Controller, Logger, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common/constants/message-patterns';
import {
  AuthTokens,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
} from '@p2p-lending/common/interfaces/message-payloads';

import { AuthService } from './auth.service';
import { TokenKeyService } from './token-key/token-key.service';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenKeyService,
  ) {}

  @MessagePattern({
    cmd: MESSAGE_PATTERNS.AUTH.REGISTER,
  })
  async createUserAuthToken(
    @Payload() user: RegisterRequest,
  ): Promise<RegisterResponse> {
    try {
      this.logger.log('Creating auth token for user:: ', user);
      return await this.authService.register(user);
    } catch (error) {
      this.logger.error(`Create auth token failed: ${error}`);
      throw error;
    }
  }

  @MessagePattern({
    cmd: MESSAGE_PATTERNS.AUTH.LOGIN,
  })
  async authLogin(@Payload() user: LoginRequest): Promise<LoginResponse> {
    try {
      this.logger.log('Logging in user:: ', user.email);
      const userAuthExists = await this.authService.login(user);

      if (!userAuthExists) {
        throw new NotFoundException('User not found');
      }
      const tokenKey = await this.tokenService.generateTokenKey(
        userAuthExists.id,
        userAuthExists.userId,
      );
      this.logger.log('Token key generated for user:: ', user.email);
      return {
        user: {
          id: userAuthExists.userId,
          email: userAuthExists.email,
          isVerified: userAuthExists.emailVerified,
          isActive: userAuthExists.isActive,
        },
        tokens: tokenKey,
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error}`);
      throw error;
    }
  }

  @MessagePattern({
    cmd: MESSAGE_PATTERNS.AUTH.REFRESH_TOKEN,
  })
  async refreshToken(
    @Payload() data: RefreshTokenRequest,
  ): Promise<AuthTokens> {
    try {
      this.logger.log(`Refreshing token: ${data.refreshToken}`);
      const payload = await this.tokenService.validateRefreshToken(
        data.refreshToken,
      );
      return payload;
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error}`);
      throw error;
    }
  }

  @MessagePattern({
    cmd: MESSAGE_PATTERNS.AUTH.LOGOUT,
  })
  async logout(@Payload() data: LogoutRequest): Promise<LogoutResponse> {
    return await this.tokenService.revokeToken(data.refreshToken);
  }

  @MessagePattern({
    cmd: MESSAGE_PATTERNS.AUTH.VALIDATE_TOKEN,
  })
  async validateToken(
    @Payload() data: { token: string },
  ): Promise<{ valid: boolean; payload?: any }> {
    try {
      this.logger.log(`Validating access token`);
      const payload = await this.tokenService.validateAccessToken(data.token);
      return {
        valid: true,
        payload,
      };
    } catch (error) {
      this.logger.error(
        `Token validation failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      return {
        valid: false,
      };
    }
  }

  // Keep the original HTTP endpoint for direct access if needed
  @MessagePattern('auth.health_check')
  getHealthCheck(): { status: string; timestamp: string } {
    return {
      status: 'Auth service is running',
      timestamp: new Date().toISOString(),
    };
  }
}
