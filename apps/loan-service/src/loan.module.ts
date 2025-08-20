import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RmqService } from '@p2p-lending/common';
import { CONFIG_TOKENS, ConfigModule } from '@p2p-lending/common/config';
import { createLoanServiceConfig } from '@p2p-lending/common/config/services/loan-service.config';
import { LoanServiceConfig } from '@p2p-lending/common/config/services/loan-service.config';

import { LoanServiceController } from './loan.controller';
import { LoanService } from './loan.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forService(
      createLoanServiceConfig,
      CONFIG_TOKENS.LOAN_SERVICE,
    ),
    ClientsModule.registerAsync([
      {
        name: RmqService.LOAN,
        useFactory: (config: LoanServiceConfig) => {
          console.log(config.rabbitmq);

          if (!config.rabbitmq) {
            throw new Error(
              'RabbitMQ configuration is required for LOAN service',
            );
          }
          return config.rabbitmq;
        },
        inject: [CONFIG_TOKENS.LOAN_SERVICE],
      },
    ]),
  ],
  controllers: [LoanServiceController],
  providers: [LoanService, PrismaService],
  exports: [PrismaService],
})
export class LoanServiceModule {}
