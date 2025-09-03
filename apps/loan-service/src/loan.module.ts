import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { RmqService } from '@p2p-lending/common';
import { CONFIG_TOKENS, ConfigModule } from '@p2p-lending/common/config';
import { createLoanServiceConfig } from '@p2p-lending/common/config/services/loan-service.config';
import { LoanServiceConfig } from '@p2p-lending/common/config/services/loan-service.config';

import { LoanServiceController } from './loan.controller';
import { LoanService } from './loan.service';
import { PrismaService } from './prisma/prisma.service';
import { LoanCqrsService } from './application/loan-cqrs.service';

// Command Handlers
import { CreateLoanHandler } from './application/commands/create-loan.handler';
import { UpdateLoanHandler } from './application/commands/update-loan.handler';
import { DeleteLoanHandler } from './application/commands/delete-loan.handler';
import { ChangeLoanStatusHandler } from './application/commands/change-loan-status.handler';

// Query Handlers
import { GetLoanByIdHandler } from './application/queries/handlers/get-loan-by-id.handler';
import { GetLoansByIdsHandler } from './application/queries/handlers/get-loans-by-ids.handler';
import { GetLoansByBorrowerHandler } from './application/queries/handlers/get-loans-by-borrower.handler';
import { GetActiveLoansHandler } from './application/queries/handlers/get-active-loans.handler';
import { GetAllLoansHandler } from './application/queries/handlers/get-all-loans.handler';

// Event Handlers
import { LoanCreatedHandler } from './application/events/handlers/loan-created.handler';
import { LoanUpdatedHandler } from './application/events/handlers/loan-updated.handler';
import { LoanStatusChangedHandler } from './application/events/handlers/loan-status-changed.handler';
import { LoanDeletedHandler } from './application/events/handlers/loan-deleted.handler';

// Repository
import { LoanRepository } from './infrastructure/repositories/loan.repository';

@Module({
  imports: [
    CqrsModule,
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
  providers: [
    // Legacy service (can be removed later)
    LoanService,

    // CQRS Service
    LoanCqrsService,

    // Database
    PrismaService,

    // Repository
    {
      provide: 'LoanRepository',
      useClass: LoanRepository,
    },

    // Command Handlers
    CreateLoanHandler,
    UpdateLoanHandler,
    DeleteLoanHandler,
    ChangeLoanStatusHandler,

    // Query Handlers
    GetLoanByIdHandler,
    GetLoansByIdsHandler,
    GetLoansByBorrowerHandler,
    GetActiveLoansHandler,
    GetAllLoansHandler,

    // Event Handlers
    LoanCreatedHandler,
    LoanUpdatedHandler,
    LoanStatusChangedHandler,
    LoanDeletedHandler,
  ],
  exports: [PrismaService, LoanCqrsService],
})
export class LoanServiceModule {}
