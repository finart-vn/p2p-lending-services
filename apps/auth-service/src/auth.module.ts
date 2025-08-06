import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import appConfig from '@p2p-lending/common/config/app.config';
import redisConfig, {
  getRedisConfig,
} from '@p2p-lending/common/config/redis.config';
import { RmqQueue, RmqService } from '@p2p-lending/common/enums';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from './prisma/prisma.service';
import { TokenKeyModule } from './token-key/token-key.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, redisConfig],
      envFilePath: ['.env.local', '.env'],
      expandVariables: true,
      cache: true,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: process.env.JWT_SECRET || 'DefaultSecret',
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN || '2h',
          issuer: configService.get<string>('app.APP_NAME'),
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
        useFactory: () => {
          const redisConf = getRedisConfig();
          return {
            transport: Transport.REDIS,
            options: {
              host: redisConf.host,
              port: redisConf.port,
              password: redisConf.password,
              username: redisConf.username,
              db: redisConf.db,
              retryDelay: redisConf.retryDelay,
              retryAttempts: redisConf.retryAttempts,
              connectTimeout: redisConf.connectTimeout,
              commandTimeout: redisConf.commandTimeout,
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
