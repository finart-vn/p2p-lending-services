import { TokenPayloadDto } from '@auth-service/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseClient } from '@p2p-lending/common/brokers/base.client';
import { MESSAGE_PATTERNS } from '@p2p-lending/common/constants/message-patterns';
import { RmqService } from '@p2p-lending/common/enums';
import {
  AuthTokens,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponseMQ,
} from '@p2p-lending/common/interfaces/message-payloads';

import { LoginDto, RegisterDto } from '../applications/DTOs';

export interface AuthValidationRequest {
  token: TokenPayloadDto;
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
  async login(loginRequest: LoginDto): Promise<LoginResponse> {
    this.logger.log(`Login request for email: ${loginRequest.email}`);
    const result = await this.send<LoginRequest, LoginResponse>(
      { cmd: MESSAGE_PATTERNS.AUTH.LOGIN },
      loginRequest,
    );
    return result;
  }

  async register(
    registerRequest: RegisterDto,
    userId: string,
  ): Promise<RegisterResponseMQ> {
    try {
      this.logger.log(`Register request for email: ${registerRequest.email}`);
      const result = await this.send<RegisterRequest, RegisterResponseMQ>(
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

  async validateRefreshToken(refreshToken: string) {
    const result = await this.send<RefreshTokenRequest, AuthTokens>(
      { cmd: MESSAGE_PATTERNS.AUTH.REFRESH_TOKEN },
      { refreshToken },
    );
    return result;
  }

  async validateToken(token: string) {
    try {
      this.logger.log(`Validating access token`);
      const result = await this.send<
        { token: string },
        { valid: boolean; payload: TokenPayloadDto }
      >({ cmd: MESSAGE_PATTERNS.AUTH.VALIDATE_TOKEN }, { token });
      this.logger.log(`Token validation result: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Token validation failed: ${JSON.stringify(error)}`);
      return false;
    }
  }

  async logout(refreshToken: string) {
    const result = await this.send<LogoutRequest, LogoutResponse>(
      { cmd: MESSAGE_PATTERNS.AUTH.LOGOUT },
      { refreshToken },
    );
    return result;
  }
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
}
