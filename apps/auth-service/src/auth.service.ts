import {
  // HttpException,
  // HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@p2p-lending/common/enums';

import { AuthUserCreateDto } from './dto/auth-user-create.dto';
import { PrismaService } from './prisma/prisma.service';
// import { firstValueFrom } from 'rxjs';

// import {
//   AuthValidationResponseDto,
//   RefreshTokenResponseDto,
//   TokenPayloadDto,
//   UserInfoResponseDto,
// } from './dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @Inject(RmqService.USER) private readonly userClient: ClientProxy,
    private readonly prismaService: PrismaService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createUserAuthToken(
    user: AuthUserCreateDto,
  ): Promise<AuthUserCreateDto> {
    try {
      this.logger.log('Creating auth token for user:: ', user);
      await this.prismaService.userAuth.create({
        data: {
          email: user.email,
          userId: user.userId,
          passwordHash: user.password,
        },
      });

      return user;
    } catch (error) {
      this.logger.log('Error creating auth token for user:: ', error);
      throw error;
    }
  }
  // async validateToken(token: string): Promise<AuthValidationResponseDto> {
  //   try {
  //     // TODO: Get public key from database or key management service
  //     const publicKey =
  //       process.env.JWT_PUBLIC_KEY || process.env.JWT_SECRET || 'DefaultSecret';

  //     const payload: TokenPayloadDto = await this.jwtService.verifyAsync(
  //       token,
  //       {
  //         secret: publicKey,
  //         // algorithms: ['RS256'], // Uncomment when using RSA keys
  //       },
  //     );

  //     if (!payload || !payload.sub) {
  //       return {
  //         valid: false,
  //         error: 'Invalid token payload',
  //       };
  //     }

  //     // TODO: Check if token is blacklisted
  //     // const isBlacklisted = await this.isTokenBlacklisted(token);
  //     // if (isBlacklisted) {
  //     //   return { valid: false, error: 'Token has been revoked' };
  //     // }

  //     // Get user info from user service
  //     try {
  //       const userInfo = await this.getUserInfo(payload.sub.toString());

  //       return {
  //         valid: true,
  //         userId: payload.sub.toString(),
  //         roles: userInfo?.roles || [],
  //       };
  //     } catch (userError) {
  //       this.logger.warn(
  //         `Could not fetch user info for user ${payload.sub}: ${userError.message}`,
  //       );
  //       // Still return valid token but without user details
  //       return {
  //         valid: true,
  //         userId: payload.sub.toString(),
  //         roles: [],
  //       };
  //     }
  //   } catch (error) {
  //     this.logger.error(`Token validation error: ${error.message}`);

  //     if (error.name === 'TokenExpiredError') {
  //       return { valid: false, error: 'Token has expired' };
  //     }

  //     if (error.name === 'JsonWebTokenError') {
  //       return { valid: false, error: 'Invalid token format' };
  //     }

  //     return { valid: false, error: 'Token validation failed' };
  //   }
  // }

  // async refreshToken(refreshToken: string): Promise<RefreshTokenResponseDto> {
  //   try {
  //     // TODO: Get private key from database or key management service
  //     const privateKey =
  //       process.env.JWT_PRIVATE_KEY ||
  //       process.env.JWT_SECRET ||
  //       'DefaultSecret';
  //     const publicKey =
  //       process.env.JWT_PUBLIC_KEY || process.env.JWT_SECRET || 'DefaultSecret';

  //     // Verify refresh token
  //     const payload: TokenPayloadDto = await this.jwtService.verifyAsync(
  //       refreshToken,
  //       {
  //         secret: publicKey,
  //         // algorithms: ['RS256'], // Uncomment when using RSA keys
  //       },
  //     );

  //     if (!payload || !payload.sub) {
  //       throw new HttpException(
  //         'Invalid refresh token',
  //         HttpStatus.UNAUTHORIZED,
  //       );
  //     }

  //     // TODO: Check if refresh token exists in database and is not revoked
  //     // const storedRefreshToken = await this.getStoredRefreshToken(payload.sub);
  //     // if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
  //     //   throw new HttpException('Refresh token not found or revoked', HttpStatus.UNAUTHORIZED);
  //     // }

  //     // Generate new token pair
  //     const newTokenPair = await this.createKeyPair(
  //       payload,
  //       publicKey,
  //       privateKey,
  //     );

  //     return {
  //       accessToken: newTokenPair.accessToken,
  //       refreshToken: newTokenPair.refreshToken,
  //       tokenType: 'Bearer',
  //       expiresIn: 7200, // 2 hours in seconds
  //     };
  //   } catch (error) {
  //     this.logger.error(`Token refresh error: ${error.message}`);
  //     throw new HttpException('Token refresh failed', HttpStatus.UNAUTHORIZED);
  //   }
  // }

  // async revokeToken(token: string): Promise<void> {
  //   try {
  //     // TODO: Add token to blacklist in database/cache
  //     // await this.addToBlacklist(token);

  //     // For now, just log the revocation
  //     this.logger.log(`Token revoked: ${token.substring(0, 20)}...`);

  //     // TODO: Implement token blacklisting logic
  //     // Example: Add to Redis cache or database
  //     // await this.cacheService.set(`blacklist:${tokenId}`, true, ttl);
  //   } catch (error) {
  //     this.logger.error(`Token revocation error: ${error.message}`);
  //     throw new HttpException(
  //       'Token revocation failed',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async getUserInfo(userId: string): Promise<UserInfoResponseDto | null> {
  //   try {
  //     // Connect to user service and get user information
  //     await this.userClient.connect();

  //     const userInfo = await firstValueFrom(
  //       this.userClient.send('user.get_by_id', { id: userId }),
  //     );

  //     if (!userInfo) {
  //       return null;
  //     }

  //     return {
  //       id: userInfo.id,
  //       email: userInfo.email,
  //       roles: userInfo.roles || [],
  //       firstName: userInfo.firstName,
  //       lastName: userInfo.lastName,
  //     };
  //   } catch (error) {
  //     this.logger.error(`Failed to get user info: ${error.message}`);
  //     return null;
  //   }
  // }

  // async createKeyPair(
  //   payload: TokenPayloadDto,
  //   publicKey: string,
  //   privateKey: string,
  // ) {
  //   try {
  //     const accessToken = await this.jwtService.signAsync(payload, {
  //       secret: privateKey,
  //       // algorithm: 'RS256', // Uncomment when using RSA keys
  //       expiresIn: '2 hours',
  //     });

  //     const refreshToken = await this.jwtService.signAsync(payload, {
  //       secret: privateKey,
  //       // algorithm: 'RS256', // Uncomment when using RSA keys
  //       expiresIn: '7 days',
  //     });

  //     const verifyToken: TokenPayloadDto = await this.jwtService.verifyAsync(
  //       accessToken,
  //       {
  //         secret: publicKey,
  //         // algorithms: ['RS256'], // Uncomment when using RSA keys
  //       },
  //     );

  //     if (!verifyToken) {
  //       throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
  //     }

  //     // TODO: Update refresh token for the user in database
  //     // await this.tokenKeyRepo.update(
  //     //   { user: { id: payload.sub } },
  //     //   { refreshToken },
  //     // );

  //     return {
  //       accessToken,
  //       refreshToken,
  //     };
  //   } catch (error) {
  //     this.logger.error('Error at CreateKeyPair::', error);
  //     throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // // TODO: Implement token blacklisting
  // // private async isTokenBlacklisted(token: string): Promise<boolean> {
  // //   // Check if token is in blacklist (Redis/Database)
  // //   return false;
  // // }

  // // TODO: Implement stored refresh token retrieval
  // // private async getStoredRefreshToken(userId: number): Promise<string | null> {
  // //   // Get refresh token from database
  // //   return null;
  // // }
}
