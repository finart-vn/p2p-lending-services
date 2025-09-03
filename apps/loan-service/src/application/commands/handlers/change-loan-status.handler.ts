import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { Loan, LoanStatus } from '@p2p-lending/loan-service/generated/prisma';

import { LoanStatusChangedEvent } from '../../domain/events/loan-status-changed.event';
import { LoanRepository } from '../../domain/repositories/loan.repository.interface';
import { ChangeLoanStatusCommand } from '../change-loan-status.command';

@Injectable()
@CommandHandler(ChangeLoanStatusCommand)
export class ChangeLoanStatusHandler
  implements ICommandHandler<ChangeLoanStatusCommand>
{
  private readonly logger = new Logger(ChangeLoanStatusHandler.name);

  constructor(
    @Inject('LoanRepository')
    private readonly loanRepository: LoanRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ChangeLoanStatusCommand): Promise<Loan> {
    this.logger.log(
      `Changing loan status: ${command.loanId} to ${command.newStatus}`,
    );

    try {
      // Find the loan
      const existingLoan = await this.loanRepository.findById(command.loanId);
      if (!existingLoan) {
        throw new RpcException({
          message: 'Loan not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      const previousStatus = existingLoan.status;

      // Validate status transitions
      this.validateStatusTransition(previousStatus, command.newStatus);

      // Prepare update data based on the new status
      const updateData: Partial<Loan> = {
        ...existingLoan,
        status: command.newStatus,
        updatedAt: new Date(),
      };

      // Add specific fields based on status
      switch (command.newStatus) {
        case 'LISTED':
          if (!command.listingDate || !command.fundingDeadline) {
            throw new RpcException({
              message:
                'Listing date and funding deadline are required for listing a loan',
              statusCode: HttpStatus.BAD_REQUEST,
            });
          }
          updateData.listingDate = command.listingDate;
          updateData.fundingDeadline = command.fundingDeadline;
          break;
        case 'ACTIVE':
          updateData.disbursedAt = new Date();
          break;
      }

      // Save to repository
      const updatedLoan = await this.loanRepository.save(updateData);

      // Publish domain event
      const event = new LoanStatusChangedEvent({
        loanId: updatedLoan.id,
        borrowerId: updatedLoan.borrowerId,
        previousStatus,
        newStatus: updatedLoan.status,
        changedAt: updatedLoan.updatedAt,
      });

      this.eventBus.publish(event);

      this.logger.log(
        `Loan status changed successfully: ${updatedLoan.id} from ${previousStatus} to ${updatedLoan.status}`,
      );
      return updatedLoan;
    } catch (error) {
      this.logger.error(
        `Failed to change loan status: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private validateStatusTransition(
    currentStatus: LoanStatus,
    newStatus: LoanStatus,
  ): void {
    const validTransitions: Record<LoanStatus, LoanStatus[]> = {
      DRAFT: ['PENDING', 'REJECTED'],
      PENDING: ['APPROVED', 'REJECTED'],
      APPROVED: ['LISTED'],
      LISTED: ['FUNDING'],
      FUNDING: ['ACTIVE'],
      ACTIVE: ['COMPLETED', 'DEFAULTED'],
      COMPLETED: [],
      DEFAULTED: [],
      REJECTED: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new RpcException({
        message: `Invalid status transition from ${currentStatus} to ${newStatus}`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
