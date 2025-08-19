import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AuthServiceConfig,
  CONFIG_TOKENS,
  ConfigModule,
  createAuthServiceConfig,
} from '@p2p-lending/common/config';
import { RmqService } from '@p2p-lending/common/enums';

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
        secret: config.jwt?.secret,
        signOptions: {
          expiresIn: config.jwt?.accessTokenExpiresIn,
          issuer: config.jwt?.issuer,
          audience: config.jwt?.audience,
        },
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: RmqService.USER,
        useFactory: (config: AuthServiceConfig) => {
          if (!config.rabbitmq) {
            throw new Error(
              'RabbitMQ configuration is required for USER service',
            );
          }
          return config.rabbitmq;
        },
        inject: [CONFIG_TOKENS.AUTH_SERVICE],
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
            ...config.redis,
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
