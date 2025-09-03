import { Inject, Injectable, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import {
  Loan,
  LoanPurpose,
  LoanStatus,
  Prisma,
} from '@p2p-lending/loan-service/generated/prisma';

import { LoanCreatedEvent } from '../../../domain/events/loan-created.event';
import { LoanRepository } from '../../../domain/repositories/loan.repository.interface';
import { CreateLoanCommand } from '../create-loan.command';

@Injectable()
@CommandHandler(CreateLoanCommand)
export class CreateLoanHandler implements ICommandHandler<CreateLoanCommand> {
  private readonly logger = new Logger(CreateLoanHandler.name);

  constructor(
    @Inject('LoanRepository')
    private readonly loanRepository: LoanRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateLoanCommand) {
    this.logger.log(`Creating loan for borrower: ${command.borrowerId}`);

    try {
      // Create the loan data
      const loanData: Partial<Loan> = {
        borrowerId: command.borrowerId,
        requestedAmount: Prisma.Decimal(command.requestedAmount.toString()),
        interestRate: Prisma.Decimal(command.interestRate.toString()),
        termMonths: command.termMonths,
        monthlyPayment: Prisma.Decimal(command.monthlyPayment.toString()),
        purpose: command.purpose,
        description: command.description,
        status: LoanStatus.DRAFT,
      };

      // Save to repository
      const savedLoan = await this.loanRepository.save(loanData);

      // Publish domain event
      const event = new LoanCreatedEvent({
        loanId: '123',
        borrowerId: '123',
        loanNumber: 1,
        requestedAmount: 1000,
        interestRate: 10,
        termMonths: 12,
        monthlyPayment: 100,
        purpose: LoanPurpose.PERSONAL,
        description: 'Test',
        status: LoanStatus.DRAFT,
        createdAt: new Date(),
      });

      this.eventBus.publish(event);

      this.logger.log(
        `Loan created successfully with ID: ${command.borrowerId}`,
      );
      return savedLoan;
    } catch (error) {
      this.logger.error(`Failed to create loan: ${command.borrowerId}`, error);
      throw error;
    }
  }
}
