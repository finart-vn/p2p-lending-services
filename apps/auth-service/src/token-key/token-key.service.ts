import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthTokens } from '@p2p-lending/common/interfaces/message-payloads/auth/auth-responses.interface';

import { PrismaService } from '../prisma/prisma.service';
export interface TokenPayloadDto {
  tid: string;
  sub: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class TokenKeyService {
  private readonly logger = new Logger(TokenKeyService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokenKey(
    userId: string,
    userAuthId: string,
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

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateToken(token: string): Promise<TokenPayloadDto> {
    try {
      return this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
        algorithms: ['HS256'],
      });
    } catch (error) {
      this.logger.error('Error validating token', error);
      throw error;
    }
  }

  async validateRefreshToken(
    payload: TokenPayloadDto,
    refreshToken: string,
  ): Promise<AuthTokens> {
    try {
      const userAuth = await this.prismaService.userAuth.findUnique({
        where: {
          id: payload.tid,
        },
      });
      if (!userAuth) {
        throw new ForbiddenException('User not found');
      }
      const tokens = await this.generateTokenKey(payload.sub, payload.tid);
      this.logger.log(`User auth: ${JSON.stringify(refreshToken)}`);
      return tokens;
    } catch (error) {
      this.logger.error('Error validating refresh token', error);
      throw error;
    }
  }
}
