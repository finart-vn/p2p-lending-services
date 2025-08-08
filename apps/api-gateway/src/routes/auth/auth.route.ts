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
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenPayloadDto } from '@p2p-lending/auth-service/src/dto/token-payload.dto';
import { Request, Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly userClient: UserClient,
    private readonly authClient: AuthClient,
    private readonly jwtService: JwtService,
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
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      this.logger.log(`Login attempt for email: ${loginDto.email}`);

      // Map API DTO to RMQ request
      // const rmqLoginRequest = DtoMappers.mapApiLoginToRmqLogin(loginDto);

      // Call auth service via RMQ
      const loginResponse = await this.authClient.login(loginDto);

      this.logger.log(`Login successful for user: ${loginResponse.user.email}`);

      // Set cookies with proper security options
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        signed: true,
      };

      // Set refresh token cookie (7 days expiry)
      res.cookie('refreshToken', loginResponse.tokens.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return {
        success: true,
        data: {
          accessToken: loginResponse.tokens.accessToken,
        },
        message: 'Login successful',
        path: req.url,
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
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh token' })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      this.logger.debug('start refresh token');

      // Read signed cookies instead of regular cookies
      const refreshToken = req.signedCookies['refreshToken'] as string;
      console.log('Signed cookies:', req.signedCookies);
      console.log('Regular cookies:', req.cookies);

      if (!refreshToken) {
        throw new HttpException(
          'Refresh token not found',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Parse payload from signed cookie
      const payloadString = req.signedCookies['payload'] as string;
      if (!payloadString) {
        throw new HttpException('Payload not found', HttpStatus.BAD_REQUEST);
      }

      const payload = JSON.parse(payloadString) as TokenPayloadDto;
      const refreshTokenResponse = await this.authClient.validateRefreshToken(
        refreshToken,
        payload,
      );

      // Update cookies with new tokens if refresh was successful
      if (refreshTokenResponse) {
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict' as const,
          signed: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };

        // Update refresh token cookie
        res.cookie(
          'refreshToken',
          refreshTokenResponse.refreshToken,
          cookieOptions,
        );

        res.cookie(refreshTokenResponse.accessToken, cookieOptions);
      }

      return {
        success: true,
        data: {
          accessToken: refreshTokenResponse.accessToken,
        },
        message: 'Token refreshed',
        path: req.url,
      };
    } catch (error) {
      this.logger.error('Error refreshing token', error);
      return new HttpException(
        'Error refreshing token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
