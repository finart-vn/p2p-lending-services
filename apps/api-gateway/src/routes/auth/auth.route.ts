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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthGuard } from '../../guards/auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly userClient: UserClient,
    private readonly authClient: AuthClient,
  ) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: ApiResponseDto<ApiLoginResponseDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ApiErrorResponseDto,
  })
  @Post('login')
  async login(
    @Body(new ValidationPipe()) loginDto: ApiLoginRequestDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      this.logger.log(`Login attempt for email: ${loginDto.email}`);
      // Call auth service via RMQ
      const loginResponse = await this.authClient.login(loginDto);

      const userProfile = await this.userClient.getUserById(
        loginResponse.user.id,
      );

      this.logger.log(`Login successful for user: ${loginResponse.user.email}`);
      // Set refresh token cookie (7 days expiry)
      res.cookie('refreshToken', loginResponse.tokens.refreshToken, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
      });

      return {
        accessToken: loginResponse.tokens.accessToken,
        user: userProfile,
      };
    } catch (error) {
      this.logger.error(`Login failed for email: ${loginDto.email}`, error);
      throw new HttpException(
        `Login failed for email: ${loginDto.email}`,
        HttpStatus.BAD_REQUEST,
      );
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
  ) {
    try {
      this.logger.log(`Registration attempt for email: ${registerDto.email}`);
      // Create user via RMQ
      const userResponse = await this.userClient.createUser(registerDto);
      // Register with auth service
      const authResponse = await this.authClient.register(
        registerDto,
        userResponse.id,
      );

      return {
        userResponse,
        authResponse,
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

  @ApiOperation({ summary: 'User logout' })
  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@Req() req: Request) {
    const refreshToken = req.cookies['refreshToken'] as string;
    this.logger.debug(`Refresh token: ${refreshToken}`);
    return this.authClient.logout(refreshToken);
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
      const refreshToken = req.cookies['refreshToken'] as string;
      this.logger.debug(`Refresh token: ${refreshToken}`);

      if (!refreshToken) {
        throw new HttpException(
          'Refresh token not found',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Parse payload from signed cookie
      const refreshTokenResponse =
        await this.authClient.validateRefreshToken(refreshToken);

      // Update cookies with new tokens if refresh was successful
      if (refreshTokenResponse) {
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict' as const,
        };

        // Update refresh token cookie
        res.cookie(
          'refreshToken',
          refreshTokenResponse.refreshToken,
          cookieOptions,
        );

        res.cookie(refreshTokenResponse.accessToken, cookieOptions);
      }

      return refreshTokenResponse.accessToken;
    } catch (error) {
      this.logger.error('Error refreshing token', error);
      return new HttpException(
        'Error refreshing token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
