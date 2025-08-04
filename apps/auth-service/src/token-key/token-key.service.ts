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
    payload: TokenPayloadDto,
    publicKey: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log('Generating token key', publicKey);
    this.logger.log('Load Config', this.configService.get('JWT_SECRET'));
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '7d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
