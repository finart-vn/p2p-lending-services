import {
  LoginRequest,
  UserResponse,
} from '@p2p-lending/common/interfaces/message-payloads';

import { ApiUserDto, LoginDto } from '../../applications/DTOs/auth';

// ===== DTO MAPPING UTILITIES =====

export class DtoMappers {
  // ===== API TO RMQ MAPPINGS =====

  static mapApiLoginToRmqLogin(apiDto: LoginDto): LoginRequest {
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
