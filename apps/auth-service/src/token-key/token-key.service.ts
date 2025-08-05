import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
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
    private readonly configService: ConfigService,
  ) {}

  async generateTokenKey(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      tid: userId,
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
}
