import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule } from '@nestjs/microservices';
import { RmqService } from '@p2p-lending/common';
import { CONFIG_TOKENS, ConfigModule } from '@p2p-lending/common/config';
import { createLoanServiceConfig } from '@p2p-lending/common/config/services/loan-service.config';
import { LoanServiceConfig } from '@p2p-lending/common/config/services/loan-service.config';

import { ChangeLoanStatusHandler } from './application/commands/handler/change-loan-status.handler';
// Command Handlers
import { CreateLoanHandler } from './application/commands/handler/create-loan.handler';
import { DeleteLoanHandler } from './application/commands/handler/delete-loan.handler';
import { UpdateLoanHandler } from './application/commands/handler/update-loan.handler';
// Event Handlers
import { LoanCreatedHandler } from './application/events/handlers/loan-created.handler';
import { LoanDeletedHandler } from './application/events/handlers/loan-deleted.handler';
import { LoanStatusChangedHandler } from './application/events/handlers/loan-status-changed.handler';
import { LoanUpdatedHandler } from './application/events/handlers/loan-updated.handler';
import { LoanCqrsService } from './application/loan-cqrs.service';
import { GetActiveLoansHandler } from './application/queries/handlers/get-active-loans.handler';
import { GetAllLoansHandler } from './application/queries/handlers/get-all-loans.handler';
// Query Handlers
import { GetLoanByIdHandler } from './application/queries/handlers/get-loan-by-id.handler';
import { GetLoansByBorrowerHandler } from './application/queries/handlers/get-loans-by-borrower.handler';
import { GetLoansByIdsHandler } from './application/queries/handlers/get-loans-by-ids.handler';
import { GetMarketplaceLoansHandler } from './application/queries/handlers/get-market-loans.handler';
import { LoanValidationService } from './application/services/loan-validation.service';
// Clients
import { InvestmentClient } from './infrastructure/clients/investment.client';
import { PrismaService } from './infrastructure/database/prisma.service';
// Repository
import { LoanRepository } from './infrastructure/repositories/loan.repository';
import { LoanService } from './loan.service';
import { LoanServiceController } from './presentation/controllers/loan.controller';

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
      {
        name: RmqService.INVESTMENT,
        useFactory: (config: LoanServiceConfig) => {
          if (!config.rabbitmq) {
            throw new Error(
              'RabbitMQ configuration is required for INVESTMENT service',
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

    // Application Services
    LoanValidationService,

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
    GetMarketplaceLoansHandler,

    // Clients
    InvestmentClient,

    // Event Handlers
    LoanCreatedHandler,
    LoanUpdatedHandler,
    LoanStatusChangedHandler,
    LoanDeletedHandler,
  ],
  exports: [PrismaService, LoanCqrsService],
})
export class LoanServiceModule {}
