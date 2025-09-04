import { Loan, LoanStatus, Prisma } from '@loan-service/prisma';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';

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

      // Publish domain event with actual loan data
      const event = new LoanCreatedEvent({
        loanId: savedLoan.id,
        borrowerId: savedLoan.borrowerId,
        loanNumber: savedLoan.loanNumber,
        requestedAmount: savedLoan.requestedAmount.toNumber(),
        interestRate: savedLoan.interestRate.toNumber(),
        termMonths: savedLoan.termMonths,
        monthlyPayment: savedLoan.monthlyPayment.toNumber(),
        purpose: savedLoan.purpose,
        description: savedLoan.description || undefined,
        status: savedLoan.status,
        createdAt: savedLoan.createdAt,
      });

      this.eventBus.publish(event);

      this.logger.log(
        `Loan created successfully with ID: ${savedLoan.id} and loan number: ${savedLoan.loanNumber}`,
      );
      return savedLoan;
    } catch (error) {
      this.logger.error(`Failed to create loan:`, error);
      throw new RpcException({
        message: 'Failed to create loan',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
