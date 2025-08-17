import { AuthClient } from '@api-gateway/clients/auth.client';
import { UserClient } from '@api-gateway/clients/user.client';
import {
  ApiUserAuthResponseDto,
  LoginDto,
  RegisterDto,
  UserAuthResponseDto,
} from '@api-gateway/dtos/auth';
import { ApiErrorResponseDto } from '@api-gateway/dtos/common.dto';
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
    type: ApiUserAuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ApiErrorResponseDto,
  })
  @Post('login')
  async login(
    @Body(new ValidationPipe()) loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserAuthResponseDto> {
    try {
      this.logger.log(`Login attempt for email: ${loginDto.email}`);
      // Check if login response is valid
      const loginResponse = await this.authClient.login(loginDto);
      if (!loginResponse) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      // Get user profile from user service
      const userProfile = await this.userClient.getUserById(
        loginResponse.user.id,
      );
      if (!userProfile) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(`Login successful for user: ${loginResponse.user.email}`);
      // Set refresh token cookie (7 days expiry)
      res.cookie('refreshToken', loginResponse.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });

      return {
        accessToken: loginResponse.tokens.accessToken,
        user: {
          ...userProfile,
          emailVerified: loginResponse.user.isVerified,
          emailVerifiedAt: loginResponse.user.emailVerifiedAt,
          isActive: loginResponse.user.isActive,
        },
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
    type: ApiUserAuthResponseDto,
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
    @Body(new ValidationPipe()) registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserAuthResponseDto> {
    try {
      this.logger.log(`Registration attempt for email: ${registerDto.email}`);
      // Create user via RMQ
      const userCreated = await this.userClient.createUser(registerDto);
      // Register with auth service
      const { userAuthCreated, tokenKey } = await this.authClient.register(
        registerDto,
        userCreated.id,
      );
      // Set refresh token cookie (7 days expiry)
      res.cookie('refreshToken', tokenKey.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });

      return {
        user: {
          ...userCreated,
          emailVerified: userAuthCreated.emailVerified,
          emailVerifiedAt: userAuthCreated.emailVerifiedAt,
          isActive: userAuthCreated.isActive,
        },
        accessToken: tokenKey.accessToken,
      };
    } catch (error) {
      this.logger.error(
        `Registration failed for email: ${registerDto.email}`,
        error,
      );
      throw new HttpException(
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
    try {
      const refreshToken = req.cookies['refreshToken'] as string;
      this.logger.debug(`Refresh token: ${refreshToken}`);
      return this.authClient.logout(refreshToken);
    } catch (error) {
      this.logger.error('Error logging out', error);
      throw new HttpException('Error logging out', HttpStatus.BAD_REQUEST);
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
        };

        // Update refresh token cookie
        res.cookie(
          'refreshToken',
          refreshTokenResponse.refreshToken,
          cookieOptions,
        );
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
