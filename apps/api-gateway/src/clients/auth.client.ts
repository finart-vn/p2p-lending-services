import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common/constants/message-patternns';
import { RmqService } from '@p2p-lending/common/enums';

import { BaseClient } from './base.client';

export interface AuthValidationRequest {
  token: string;
}

export interface AuthValidationResponse {
  valid: boolean;
  userId?: string;
  roles?: string[];
  error?: string;
}

export interface UserInfoResponse {
  id: string;
  email: string;
  roles: string[];
  // TODO: Add more user properties
}

export interface AuthUserCreateDto {
  email: string;
  password: string;
  userId: string;
}

@Injectable()
export class AuthClient extends BaseClient {
  constructor(@Inject(RmqService.AUTH) protected readonly client: ClientProxy) {
    super(client, RmqService.AUTH);
  }
  async createAuthToken(user: AuthUserCreateDto): Promise<string> {
    const result = await this.send<AuthUserCreateDto, string>(
      { cmd: MESSAGE_PATTERNS.AUTH.REGISTER },
      user,
    );
    this.logger.log(`Auth token created: ${JSON.stringify(result)}`);
    return result;
  }
  //   async validateToken(token: string): Promise<AuthValidationResponse> {
  //     // TODO: Implement token validation with auth service
  //     try {
  //       // TODO: Send request to auth microservice
  //       // const result = await this.authService.send('validate_token', { token }).toPromise();
  //       // return result;

  //       // Placeholder return
  //       return { valid: false, error: 'Not implemented' };
  //     } catch (error) {
  //       this.logger.error(`Token validation failed: ${error.message}`);
  //       return { valid: false, error: error.message };
  //     }
  //   }

  //   async getUserInfo(userId: string): Promise<UserInfoResponse | null> {
  //     // TODO: Implement user info retrieval
  //     try {
  //       // TODO: Send request to user service
  //       // const result = await this.userService.send('get_user', { id: userId }).toPromise();
  //       // return result;

  //       // Placeholder return
  //       return null;
  //     } catch (error) {
  //       this.logger.error(`Failed to get user info: ${error.message}`);
  //       return null;
  //     }
  //   }

  //   async refreshToken(refreshToken: string): Promise<any> {
  //     // TODO: Implement token refresh logic
  //     try {
  //       // TODO: Send request to auth service
  //       return null;
  //     } catch (error) {
  //       this.logger.error(`Token refresh failed: ${error.message}`);
  //       throw error;
  //     }
  //   }
}
