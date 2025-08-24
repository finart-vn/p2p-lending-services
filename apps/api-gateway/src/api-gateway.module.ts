import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {
  authRmqConfig,
  CONFIG_TOKENS,
  ConfigModule,
  createApiGatewayConfig,
  paymentRmqConfig,
  userRmqConfig,
} from '@p2p-lending/common/config';
import { loanRmqConfig } from '@p2p-lending/common/config/services/loan-service.config';
import { RmqExchange, RmqService } from '@p2p-lending/common/enums';

import { AuthClient } from './clients/auth.client';
import { BorrowerClient } from './clients/borrower.client';
import { UserClient } from './clients/user.client';
import { RequestLoggingMiddleware } from './middlewares/request-logging.middleware';
import { AuthController } from './routes/auth/auth.route';
import { BorrowerController } from './routes/borrower/borrower.route';
import { LenderController } from './routes/lender/lender.route';
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
      {
        name: RmqExchange.LOAN,
        useFactory: () => paymentRmqConfig,
      },
    ]),
  ],
  controllers: [
    AuthController,
    UserController,
    LenderController,
    BorrowerController,
  ],
  providers: [UserClient, AuthClient, BorrowerClient],
})
export class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
