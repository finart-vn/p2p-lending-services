import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from '@user-service/prisma';

import { LoanUpdatedEvent } from '../../../domain/events/loan-updated.event';
import { LoanRepository } from '../../../domain/repositories/loan.repository.interface';
import { UpdateLoanCommand } from '../update-loan.command';

@Injectable()
@CommandHandler(UpdateLoanCommand)
export class UpdateLoanHandler implements ICommandHandler<UpdateLoanCommand> {
  private readonly logger = new Logger(UpdateLoanHandler.name);

  constructor(
    @Inject('LoanRepository')
    private readonly loanRepository: LoanRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateLoanCommand) {
    this.logger.log(`Updating loan: ${command.updates.id}`);

    try {
      // Find the loan
      const existingLoan = await this.loanRepository.findById(
        command.updates.id,
      );
      if (!existingLoan) {
        throw new RpcException({
          message: 'Loan not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      // Check if loan is in draft status (only draft loans can be updated)
      if (existingLoan.status !== 'DRAFT') {
        throw new RpcException({
          message: 'Only draft loans can be updated',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      if (command.updates.description) {
        existingLoan.description = command.updates.description;
      }
      if (command.updates.purpose) {
        existingLoan.purpose = command.updates.purpose;
      }
      if (command.updates.termMonths) {
        existingLoan.termMonths = command.updates.termMonths;
      }
      if (command.updates.interestRate) {
        existingLoan.interestRate = Prisma.Decimal(
          command.updates.interestRate.toString(),
        );
      }
      if (command.updates.monthlyPayment) {
        existingLoan.monthlyPayment = Prisma.Decimal(
          command.updates.monthlyPayment.toString(),
        );
      }

      // Save to repository
      const updatedLoan = await this.loanRepository.save(existingLoan);

      // Publish domain event
      const event = new LoanUpdatedEvent({
        loanId: updatedLoan.id,
        borrowerId: updatedLoan.borrowerId,
        changes: command.updates,
        updatedAt: updatedLoan.updatedAt,
      });

      this.eventBus.publish(event);

      this.logger.log(`Loan updated successfully: ${updatedLoan.id}`);
      return updatedLoan;
    } catch (error) {
      this.logger.error(`Failed to update loan: ${command.updates.id}`, error);
      throw error;
    }
  }
}
