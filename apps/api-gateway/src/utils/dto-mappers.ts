import {
  // AuthTokens,
  LoginRequest,
  //   LoginResponse,
  // RegisterResponse,
  UserResponse,
} from '@p2p-lending/common/interfaces/message-payloads';

import {
  // ApiAuthTokensDto,
  ApiLoginRequestDto,
  // ApiRegisterResponseDto,
  ApiUserDto,
} from '../dtos/auth';

// ===== DTO MAPPING UTILITIES =====

export class DtoMappers {
  // ===== API TO RMQ MAPPINGS =====

  static mapApiLoginToRmqLogin(apiDto: ApiLoginRequestDto): LoginRequest {
    return {
      email: apiDto.email,
      password: apiDto.password,
    };
  }

  // ===== RMQ TO API MAPPINGS =====

  static mapRmqUserToApiUser(rmqUser: UserResponse): ApiUserDto {
    return {
      id: rmqUser.id,
      email: rmqUser.email,
      //   firstName: rmqUser.firstName || '',
      //   lastName: rmqUser.lastName || '',
      //   isVerified: rmqUser.isVerified || false,
      //   roles: rmqUser.roles || ['user'],
      //   createdAt: rmqUser.createdAt.toISOString(),
    };
  }

  // static mapRmqTokensToApiTokens(rmqTokens: AuthTokens): ApiAuthTokensDto {
  //   return {
  //     accessToken: rmqTokens.accessToken,
  //     refreshToken: rmqTokens.refreshToken,
  //     // expiresIn: rmqTokens.expiresIn,
  //     // refreshExpiresIn: rmqTokens.refreshExpiresIn,
  //   };
  // }

  //   static mapRmqLoginResponseToApiLoginResponse(
  //     rmqResponse: LoginResponse,
  //   ): ApiLoginResponseDto {
  //     return {
  //       user: this.mapRmqUserToApiUser(rmqResponse.user),
  //       tokens: this.mapRmqTokensToApiTokens(rmqResponse.tokens),
  //       isFirstLogin: rmqResponse.isFirstLogin,
  //     };
  //   }

  // ===== UTILITY FUNCTIONS =====

  static createSuccessResponse<T>(data: T, message?: string, path?: string) {
    return {
      success: true,
      data,
      message: message || 'Operation completed successfully',
      timestamp: new Date().toISOString(),
      path: path || '',
    };
  }

  static createErrorResponse(
    statusCode: number,
    message: string,
    errorCode?: string,
    details?: unknown,
    path?: string,
  ) {
    return {
      success: false,
      statusCode,
      message,
      errorCode,
      details: details || null,
      timestamp: new Date().toISOString(),
      path: path || '',
    };
  }
}
