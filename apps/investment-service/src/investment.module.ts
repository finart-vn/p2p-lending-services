import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RmqService } from '@p2p-lending/common';
import { CONFIG_TOKENS, ConfigModule } from '@p2p-lending/common/config';
import { createInvestmentServiceConfig } from '@p2p-lending/common/config/services/investment-service.config';
import { InvestmentServiceConfig } from '@p2p-lending/common/config/services/investment-service.config';

import { InvestmentServiceController } from './investment.controller';
import { InvestmentService } from './investment.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forService(
      createInvestmentServiceConfig,
      CONFIG_TOKENS.INVESTMENT_SERVICE,
    ),
    ClientsModule.registerAsync([
      {
        name: RmqService.INVESTMENT
        useFactory: (config: InvestmentServiceConfig) => {
          console.log(config.rabbitmq);

          if (!config.rabbitmq) {
            throw new Error(
              'RabbitMQ configuration is required for INVESTMENT service',
            );
          }
          return config.rabbitmq;
        },
        inject: [CONFIG_TOKENS.INVESTMENT_SERVICE],
      },
    ]),
  ],
  controllers: [InvestmentServiceController],
  providers: [InvestmentService, PrismaService],
  exports: [PrismaService],
})
export class InvestmentServiceModule {}
