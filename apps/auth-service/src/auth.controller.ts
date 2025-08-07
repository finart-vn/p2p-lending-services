import { Controller, Logger, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common/constants/message-patterns';
import {
  AuthTokens,
  LoginRequest,
  LoginResponse,
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
          id: userAuthExists.id,
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

  // @MessagePattern({
  //   cmd: MESSAGE_PATTERNS.AUTH.VALIDATE_TOKEN,
  // })
  // async validateToken(
  //   @Payload() data: TokenPayloadDto,
  // ): Promise<TokenValidationResponse> {
  //   try {
  //     this.logger.log(`Validating token: ${data.tid.substring(0, 20)}...`);
  //     return await this.tokenService.validateToken(data.tid);
  //   } catch (error) {
  //     this.logger.error(`Token validation failed: ${error}`);
  //     return {
  //       valid: false,
  //     };
  //   }
  // }

  @MessagePattern('auth.refresh_token')
  async refreshToken(
    @Payload() data: RefreshTokenRequest,
  ): Promise<AuthTokens> {
    try {
      this.logger.log(
        `Refreshing token: ${data.refreshToken.substring(0, 20)}...`,
      );
      const payload = await this.tokenService.validateRefreshToken(
        data.payload,
        data.refreshToken,
      );
      return payload;
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error}`);
      throw error;
    }
  }

  // @MessagePattern('auth.revoke_token')
  // async revokeToken(
  //   @Payload() data: { token: string },
  // ): Promise<{ success: boolean }> {
  //   try {
  //     this.logger.log(`Revoking token: ${data.token.substring(0, 20)}...`);
  //     await this.authService.revokeToken(data.token);
  //     return { success: true };
  //   } catch (error) {
  //     this.logger.error(`Token revocation failed: ${error}`);
  //     throw error;
  //   }
  // }

  // @MessagePattern('auth.get_user_info')
  // async getUserInfo(
  //   @Payload() data: { userId: string },
  // ): Promise<UserInfoResponseDto | null> {
  //   try {
  //     this.logger.log(`Getting user info for: ${data.userId}`);
  //     return await this.authService.getUserInfo(data.userId);
  //   } catch (error) {
  //     this.logger.error(`Get user info failed: ${error}`);
  //     return null;
  //   }
  // }

  // Keep the original HTTP endpoint for direct access if needed
  @MessagePattern('auth.health_check')
  getHealthCheck(): { status: string; timestamp: string } {
    return {
      status: 'Auth service is running',
      timestamp: new Date().toISOString(),
    };
  }
}
