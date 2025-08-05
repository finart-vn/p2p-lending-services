import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common/constants/message-patterns';
import { RmqService } from '@p2p-lending/common/enums';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@p2p-lending/common/interfaces/message-payloads';

import { ApiRegisterRequestDto } from '../dtos';
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
}

@Injectable()
export class AuthClient extends BaseClient {
  constructor(@Inject(RmqService.AUTH) protected readonly client: ClientProxy) {
    super(client, RmqService.AUTH);
  }
  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    try {
      this.logger.log(`Login request for email: ${loginRequest.email}`);
      const result = await this.send<LoginRequest, LoginResponse>(
        { cmd: MESSAGE_PATTERNS.AUTH.LOGIN },
        loginRequest,
      );
      this.logger.log(`Login successful for user: ${result.user.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Login failed:`, error);
      throw error;
    }
  }

  async register(
    registerRequest: ApiRegisterRequestDto,
    userId: string,
  ): Promise<RegisterResponse> {
    try {
      this.logger.log(`Register request for email: ${registerRequest.email}`);
      const result = await this.send<RegisterRequest, RegisterResponse>(
        { cmd: MESSAGE_PATTERNS.AUTH.REGISTER },
        { ...registerRequest, userId },
      );
      this.logger.log(`Registration successful for user: `, result);
      return result;
    } catch (error) {
      this.logger.error(`Registration failed:`, error);
      throw error;
    }
  }

  async createAuthToken(user: UserInfoResponse): Promise<UserInfoResponse> {
    const result = await this.send<UserInfoResponse, UserInfoResponse>(
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
