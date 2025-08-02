import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common/constants/message-patterns';
import {
  RegisterRequest,
  RegisterResponse,
} from '@p2p-lending/common/interfaces/message-payloads';

import { AuthService } from './auth.service';
// import {
//   AuthValidationRequestDto,
//   AuthValidationResponseDto,
//   RefreshTokenRequestDto,
//   RefreshTokenResponseDto,
//   UserInfoResponseDto,
// } from './dto';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @MessagePattern({
    cmd: MESSAGE_PATTERNS.AUTH.REGISTER,
  })
  async createUserAuthToken(
    @Payload() user: RegisterRequest,
  ): Promise<RegisterResponse> {
    try {
      this.logger.log('Creating auth token for user:: ', user);
      return await this.authService.createUserAuthToken(user);
    } catch (error) {
      this.logger.error(`Create auth token failed: ${error}`);
      throw error;
    }
  }

  // @MessagePattern('auth.validate_token')
  // async validateToken(
  //   @Payload() data: AuthValidationRequestDto,
  // ): Promise<AuthValidationResponseDto> {
  //   try {
  //     this.logger.log(`Validating token: ${data.token.substring(0, 20)}...`);
  //     return await this.authService.validateToken(data.token);
  //   } catch (error) {
  //     this.logger.error(`Token validation failed: ${error}`);
  //     return {
  //       valid: false,
  //     };
  //   }
  // }

  // @MessagePattern('auth.refresh_token')
  // async refreshToken(
  //   @Payload() data: RefreshTokenRequestDto,
  // ): Promise<RefreshTokenResponseDto> {
  //   try {
  //     this.logger.log(
  //       `Refreshing token: ${data.refreshToken.substring(0, 20)}...`,
  //     );
  //     return await this.authService.refreshToken(data.refreshToken);
  //   } catch (error) {
  //     this.logger.error(`Token refresh failed: ${error}`);
  //     throw error;
  //   }
  // }

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
