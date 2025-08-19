import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {
  authRmqConfig,
  CONFIG_TOKENS,
  ConfigModule,
  createApiGatewayConfig,
  userRmqConfig,
} from '@p2p-lending/common/config';
import { loanRmqConfig } from '@p2p-lending/common/config/services/loan-service.config';
import { RmqService } from '@p2p-lending/common/enums';

import { AuthClient } from './clients/auth.client';
import { UserClient } from './clients/user.client';
import { RequestLoggingMiddleware } from './middlewares/request-logging.middleware';
import { AuthController } from './routes/auth/auth.route';
import { LenderController } from './routes/lender/lender.controller';
import { UserController } from './routes/user/user.route';

@Module({
  imports: [
    ConfigModule.forService(createApiGatewayConfig, CONFIG_TOKENS.API_GATEWAY),
    ClientsModule.registerAsync([
      {
        name: RmqService.AUTH,
        useFactory: () => authRmqConfig,
      },
      {
        name: RmqService.USER,
        useFactory: () => userRmqConfig,
      },
      {
        name: RmqService.LOAN,
        useFactory: () => loanRmqConfig,
      },
    ]),
  ],
  controllers: [AuthController, UserController, LenderController],
  providers: [UserClient, AuthClient],
})
export class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
