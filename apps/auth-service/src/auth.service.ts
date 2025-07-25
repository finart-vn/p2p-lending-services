import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from './dto/token-payload.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwtService: JwtService) {}

  getHello(): string {
    return 'Hello World!';
  }
  async createKeyPair(
    payload: TokenPayloadDto,
    publicKey: string,
    privateKey: string,
  ) {
    try {
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: privateKey,
        algorithm: 'RS256',
        expiresIn: '2 days',
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: privateKey,
        algorithm: 'RS256',
        expiresIn: '7 days',
      });

      const verifyToken: TokenPayloadDto = await this.jwtService.verifyAsync(
        accessToken,
        {
          secret: publicKey,
          algorithms: ['RS256'],
        },
      );
      if (!verifyToken) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      // Update refresh token for the user
      // await this.tokenKeyRepo.update(
      //   { user: { id: payload.sub } },
      //   { refreshToken },
      // );

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error('Error at CreateKeyPair::', error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
