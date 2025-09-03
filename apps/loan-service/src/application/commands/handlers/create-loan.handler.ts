import { Inject, Injectable, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import {
  Loan,
  LoanStatus,
  Prisma,
} from '@p2p-lending/loan-service/generated/prisma';

import { LoanCreatedEvent } from '../../domain/events/loan-created.event';
import { LoanRepository } from '../../domain/repositories/loan.repository.interface';
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

  async execute(command: CreateLoanCommand): Promise<Loan> {
    this.logger.log(`Creating loan for borrower: ${command.borrowerId}`);

    try {
      // Create the loan data
      const loanData: Partial<Loan> = {
        id: crypto.randomUUID(),
        borrowerId: command.borrowerId,
        requestedAmount: Prisma.Decimal(command.requestedAmount.toString()),
        interestRate: Prisma.Decimal(command.interestRate.toString()),
        termMonths: command.termMonths,
        monthlyPayment: Prisma.Decimal(command.monthlyPayment.toString()),
        purpose: command.purpose,
        description: command.description,
        status: LoanStatus.DRAFT,
        fundedAmount: Prisma.Decimal('0'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to repository
      const savedLoan = await this.loanRepository.save(loanData);

      // Publish domain event
      const event = new LoanCreatedEvent({
        loanId: savedLoan.id,
        borrowerId: savedLoan.borrowerId,
        loanNumber: savedLoan.loanNumber,
        requestedAmount: Number(savedLoan.requestedAmount),
        interestRate: Number(savedLoan.interestRate),
        termMonths: savedLoan.termMonths,
        monthlyPayment: Number(savedLoan.monthlyPayment),
        purpose: savedLoan.purpose,
        description: savedLoan.description,
        status: savedLoan.status,
        createdAt: savedLoan.createdAt,
      });

      this.eventBus.publish(event);

      this.logger.log(`Loan created successfully with ID: ${savedLoan.id}`);
      return savedLoan;
    } catch (error) {
      this.logger.error(`Failed to create loan: ${error.message}`, error.stack);
      throw error;
    }
  }
}
