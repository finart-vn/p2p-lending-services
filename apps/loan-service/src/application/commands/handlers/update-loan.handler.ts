import { Injectable, Logger, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Loan } from '@p2p-lending/loan-service/generated/prisma';
import { LoanRepository } from '../../domain/repositories/loan.repository.interface';
import { UpdateLoanCommand } from '../update-loan.command';
import { LoanUpdatedEvent } from '../../domain/events/loan-updated.event';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

@Injectable()
@CommandHandler(UpdateLoanCommand)
export class UpdateLoanHandler implements ICommandHandler<UpdateLoanCommand> {
  private readonly logger = new Logger(UpdateLoanHandler.name);

  constructor(
    @Inject('LoanRepository')
    private readonly loanRepository: LoanRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateLoanCommand): Promise<Loan> {
    this.logger.log(`Updating loan: ${command.loanId}`);

    try {
      // Find the loan
      const existingLoan = await this.loanRepository.findById(command.loanId);
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

      // Update the loan data
      const updatedLoanData: Partial<Loan> = {
        ...existingLoan,
        ...command.updates,
        updatedAt: new Date(),
      };

      // Save to repository
      const updatedLoan = await this.loanRepository.save(updatedLoanData);

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
      this.logger.error(`Failed to update loan: ${error.message}`, error.stack);
      throw error;
    }
  }
}
