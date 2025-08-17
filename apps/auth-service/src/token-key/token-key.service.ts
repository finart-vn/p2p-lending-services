import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  AuthTokens,
  LogoutResponse,
  TokenPayloadDto,
} from '@p2p-lending/contracts/auth/auth.responses';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TokenKeyService {
  private readonly logger = new Logger(TokenKeyService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokenKey(
    userAuthId: string,
    userId: string,
  ): Promise<AuthTokens> {
    const payload = {
      tid: userAuthId,
      sub: userId,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      algorithm: 'HS256',
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      algorithm: 'HS256',
      expiresIn: '7d',
    });

    // Store the new refresh token in database
    await this.prismaService.userAuth.update({
      where: { id: userAuthId },
      data: {
        refreshToken,
        lastSuccessfulLoginAt: new Date(),
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async validateToken(token: string): Promise<TokenPayloadDto> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayloadDto>(
        token,
        {
          secret: this.configService.get('JWT_SECRET'),
          algorithms: ['HS256'],
        },
      );
      if (!payload) {
        throw new ForbiddenException('Invalid refresh token');
      }
      return payload;
    } catch (error) {
      this.logger.error('Error validating token', error);
      throw error;
    }
  }

  async validateRefreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = await this.validateToken(refreshToken);
      this.logger.log(`Validating refresh token for user: ${payload.tid}`);

      const userAuth = await this.prismaService.userAuth.findUnique({
        where: {
          id: payload.tid,
        },
      });

      if (!userAuth) {
        throw new ForbiddenException('User not found');
      }

      // Validate that the provided refresh token matches the stored one
      if (!userAuth.refreshToken || userAuth.refreshToken !== refreshToken) {
        throw new ForbiddenException('Invalid refresh token');
      }

      // Check if user is still active
      if (!userAuth.isActive) {
        throw new ForbiddenException('User account is inactive');
      }

      // Use refresh token rotation for enhanced security
      const tokens = await this.generateTokenKey(userAuth.id, userAuth.userId);
      return tokens;
    } catch (error) {
      this.logger.error('Error validating refresh token', error);
      throw error;
    }
  }

  async revokeToken(refreshToken: string): Promise<LogoutResponse> {
    try {
      const payload = await this.validateToken(refreshToken);

      await this.prismaService.userAuth.update({
        where: { id: payload.tid },
        data: { refreshToken: null },
      });

      this.logger.log(`Refresh token revoked for user: ${payload.tid}`);

      return {
        success: true,
        message: 'Token revoked successfully',
      };
    } catch (error) {
      this.logger.error('Error revoking token', error);
      throw new ForbiddenException('Failed to revoke token');
    }
  }

  /**
   * Validates access token and returns payload (for API Gateway use)
   */
  async validateAccessToken(accessToken: string): Promise<TokenPayloadDto> {
    try {
      const payload = await this.validateToken(accessToken);

      // Verify user is still active
      const userAuth = await this.prismaService.userAuth.findUnique({
        where: { id: payload.tid },
        select: { isActive: true },
      });

      if (!userAuth?.isActive) {
        throw new ForbiddenException('User account is inactive');
      }

      return payload;
    } catch (error) {
      this.logger.error('Error validating access token', error);
      throw error;
    }
  }
}
