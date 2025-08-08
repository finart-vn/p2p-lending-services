import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import {
  ApiGatewayConfig,
  CONFIG_TOKENS,
  ConfigModule,
  createApiGatewayConfig,
} from '@p2p-lending/common/config';
import { RmqQueue } from '@p2p-lending/common/enums';
import { RmqService } from '@p2p-lending/common/enums';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';

import { AuthClient } from './clients/auth.client';
import { UserClient } from './clients/user.client';
import { AuthController } from './routes/auth/auth.route';
import { UserController } from './routes/user/user.route';

@Module({
  imports: [
    ConfigModule.forService(createApiGatewayConfig, CONFIG_TOKENS.API_GATEWAY),
    ClientsModule.register([
      { name: RmqService.AUTH, ...getRmqOptions(RmqQueue.AUTH) },
      { name: RmqService.USER, ...getRmqOptions(RmqQueue.USER) },
    ]),
    JwtModule.registerAsync({
      global: true,
      inject: [CONFIG_TOKENS.API_GATEWAY],
      useFactory: (config: ApiGatewayConfig) => ({
        secret: config.jwt?.secret || 'DefaultSecret',
        signOptions: {
          expiresIn: config.jwt?.accessTokenExpiresIn || '15m',
          issuer: config.jwt?.issuer || config.serviceName,
          audience: config.jwt?.audience,
        },
      }),
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [UserClient, AuthClient],
})
export class ApiGatewayModule {}
