import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {
  CONFIG_TOKENS,
  ConfigModule,
  createApiGatewayConfig,
} from '@p2p-lending/common/config';
import { RmqQueue } from '@p2p-lending/common/enums';
import { RmqService } from '@p2p-lending/common/enums';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';

import { AuthClient } from './clients/auth.client';
import { UserClient } from './clients/user.client';
import { RequestLoggingMiddleware } from './middlewares/request-logging.middleware';
import { AuthController } from './routes/auth/auth.route';
import { UserController } from './routes/user/user.route';

@Module({
  imports: [
    ConfigModule.forService(createApiGatewayConfig, CONFIG_TOKENS.API_GATEWAY),
    ClientsModule.register([
      { name: RmqService.AUTH, ...getRmqOptions(RmqQueue.AUTH) },
      { name: RmqService.USER, ...getRmqOptions(RmqQueue.USER) },
    ]),
  ],
  controllers: [AuthController, UserController],
  providers: [UserClient, AuthClient],
})
export class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
