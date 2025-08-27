import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {
  authRmqConfig,
  CONFIG_TOKENS,
  ConfigModule,
  createApiGatewayConfig,
  investmentRmqConfig,
  paymentRmqConfig,
  userRmqConfig,
} from '@p2p-lending/common/config';
import { loanRmqConfig } from '@p2p-lending/common/config/services/loan-service.config';
import { RmqExchange, RmqService } from '@p2p-lending/common/enums';

import { AuthClient } from './clients/auth.client';
import { InvestmentClient } from './clients/investment.client';
import { LoanClient } from './clients/loan.client';
import { UserClient } from './clients/user.client';
import { RequestLoggingMiddleware } from './middlewares/request-logging.middleware';
import {
  AuthController,
  BorrowerLoanController,
  LenderController,
  UserController,
} from './routes/v1';
import { MarketplaceController } from './routes/v1/marketplace/marketplace.route';

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
      {
        name: RmqService.INVESTMENT,
        useFactory: () => investmentRmqConfig,
      },
    ]),
  ],
  controllers: [
    AuthController,
    UserController,
    LenderController,
    BorrowerLoanController,
    MarketplaceController,
  ],
  providers: [UserClient, AuthClient, LoanClient, InvestmentClient],
})
export class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
