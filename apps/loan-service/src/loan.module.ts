import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RmqQueue, RmqService } from '@p2p-lending/common';
import { CONFIG_TOKENS, ConfigModule } from '@p2p-lending/common/config';
import { createLoanServiceConfig } from '@p2p-lending/common/config/services/loan-service.config';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';

import { LoanServiceController } from './loan.controller';
import { LoanServiceService } from './loan.service';
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
        useFactory: () => getRmqOptions(RmqQueue.LOAN),
      },
    ]),
  ],
  controllers: [LoanServiceController],
  providers: [LoanServiceService, PrismaService],
  exports: [PrismaService],
})
export class LoanServiceModule {}
