import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { Loan } from '@p2p-lending/loan-service/generated/prisma';

import { LoanDeletedEvent } from '../../domain/events/loan-deleted.event';
import { LoanRepository } from '../../domain/repositories/loan.repository.interface';
import { DeleteLoanCommand } from './delete-loan.command';

@Injectable()
@CommandHandler(DeleteLoanCommand)
export class DeleteLoanHandler implements ICommandHandler<DeleteLoanCommand> {
  private readonly logger = new Logger(DeleteLoanHandler.name);

  constructor(
    @Inject('LoanRepository')
    private readonly loanRepository: LoanRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteLoanCommand): Promise<{ message: string }> {
    this.logger.log(`Deleting loan: ${command.loanId}`);

    try {
      // Find the loan
      const loan = await this.loanRepository.findById(command.loanId);
      if (!loan) {
        throw new RpcException({
          message: 'Loan not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      // Delete from repository
      await this.loanRepository.delete(command.loanId);

      // Publish domain event
      const event = new LoanDeletedEvent({
        loanId: loan.id,
        borrowerId: loan.borrowerId,
        deletedAt: new Date(),
      });

      this.eventBus.publish(event);

      this.logger.log(`Loan deleted successfully: ${command.loanId}`);
      return { message: 'Loan deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete loan: ${error.message}`, error.stack);
      throw error;
    }
  }
}
