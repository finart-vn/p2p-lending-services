import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AuthServiceConfig,
  CONFIG_TOKENS,
  ConfigModule,
  createAuthServiceConfig,
} from '@p2p-lending/common/config';
import { RmqQueue, RmqService } from '@p2p-lending/common/enums';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from './prisma/prisma.service';
import { TokenKeyModule } from './token-key/token-key.module';

@Module({
  imports: [
    ConfigModule.forService(
      createAuthServiceConfig,
      CONFIG_TOKENS.AUTH_SERVICE,
    ),
    JwtModule.registerAsync({
      global: true,
      inject: [CONFIG_TOKENS.AUTH_SERVICE],
      useFactory: (config: AuthServiceConfig) => ({
        secret: config.jwt?.secret || 'DefaultSecret',
        signOptions: {
          expiresIn: config.jwt?.accessTokenExpiresIn || '15m',
          issuer: config.jwt?.issuer || config.serviceName,
          audience: config.jwt?.audience,
        },
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: RmqService.AUTH,
        useFactory: () => getRmqOptions(RmqQueue.AUTH),
      },
      {
        name: RmqService.USER,
        useFactory: () => getRmqOptions(RmqQueue.USER),
      },
      {
        name: 'REDIS_SERVICE',
        inject: [CONFIG_TOKENS.AUTH_SERVICE],
        useFactory: (config: AuthServiceConfig) => {
          if (!config.redis) {
            throw new Error('Redis configuration is required for AUTH service');
          }
          return {
            transport: Transport.REDIS,
            options: {
              host: config.redis.host,
              port: config.redis.port,
              password: config.redis.password,
              username: config.redis.username,
              db: config.redis.db,
              retryDelay: config.redis.retryDelay,
              retryAttempts: config.redis.retryAttempts,
              connectTimeout: config.redis.connectTimeout,
              commandTimeout: config.redis.commandTimeout,
              lazyConnect: true,
            },
          };
        },
      },
    ]),
    TokenKeyModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
