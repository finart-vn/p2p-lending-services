import { AuthClient } from '@api-gateway/clients/auth.client';
import { UserClient } from '@api-gateway/clients/user.client';
import {
  ApiLoginRequestDto,
  ApiLoginResponseDto,
  ApiRegisterRequestDto,
  ApiRegisterResponseDto,
} from '@api-gateway/dtos/auth';
import {
  ApiErrorResponseDto,
  ApiResponseDto,
} from '@api-gateway/dtos/common.dto';
import { DtoMappers } from '@api-gateway/utils/dto-mappers';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly userClient: UserClient,
    private readonly authClient: AuthClient,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: ApiResponseDto<ApiLoginResponseDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ApiErrorResponseDto,
  })
  async login(
    @Body(new ValidationPipe()) loginDto: ApiLoginRequestDto,
    // @Req() req: Request,
  ) {
    try {
      this.logger.log(`Login attempt for email: ${loginDto.email}`);

      // Map API DTO to RMQ request
      const rmqLoginRequest = DtoMappers.mapApiLoginToRmqLogin(loginDto);

      // Call auth service via RMQ
      const loginResponse = await this.authClient.login(rmqLoginRequest);

      // Map RMQ response to API response
      // const apiResponse =
      //   DtoMappers.mapRmqLoginResponseToApiLoginResponse(loginResponse);

      this.logger.log(`Login successful for user: ${loginResponse.user.id}`);

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(`Login failed for email: ${loginDto.email}`, error);
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    type: ApiResponseDto<ApiRegisterResponseDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid registration data',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
    type: ApiErrorResponseDto,
  })
  async register(
    @Body(new ValidationPipe()) registerDto: ApiRegisterRequestDto,
    @Req() req: Request,
  ) {
    try {
      this.logger.log(`Registration attempt for email: ${registerDto.email}`);
      // Create user via RMQ
      const userResponse = await this.userClient.createUser(registerDto);
      // // Register with auth service
      const authResponse = await this.authClient.register(
        registerDto,
        userResponse.id,
      );

      return {
        success: true,
        data: { userResponse, authResponse },
        message: 'Registration successful',
        path: req.url,
      };
    } catch (error) {
      this.logger.error(
        `Registration failed for email: ${registerDto.email}`,
        error,
      );
      return new HttpException(
        `Registration failed for email: ${registerDto.email}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
