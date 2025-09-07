import { LoanUpdatedEvent } from '@loan-service/domain/events/loan-updated.event';
import { LoanRepository } from '@loan-service/domain/repositories/loan.repository.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from '@user-service/prisma';

import {
  UpdateLoanCommand,
  UpdateLoanCommandData,
} from '../update-loan.command';

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

      const updatedFields = this.prepareUpdatedFields(command.updates);
      Object.assign(existingLoan, updatedFields);
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
  /**
   * Prepare dynamic fields for update
   */
  private prepareUpdatedFields(
    updates: UpdateLoanCommandData,
  ): Record<string, unknown> {
    const numericFields: (keyof UpdateLoanCommandData)[] = [
      'interestRate',
      'monthlyPayment',
    ];
    const excludedFields: (keyof UpdateLoanCommandData)[] = ['id'];
    const updatedFields: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(updates)) {
      // Skip undefined, null values and excluded fields
      if (
        value === undefined ||
        value === null ||
        excludedFields.includes(key as keyof UpdateLoanCommandData)
      ) {
        continue;
      }

      try {
        // Convert numeric fields to Prisma.Decimal for proper database storage
        if (
          numericFields.includes(key as keyof UpdateLoanCommandData) &&
          typeof value === 'number'
        ) {
          updatedFields[key] = new Prisma.Decimal(value);
        } else {
          updatedFields[key] = value;
        }
      } catch (error) {
        this.logger.error(
          `Failed to convert field ${key} with value ${value}`,
          error,
        );
        throw new RpcException({
          message: `Invalid value for field ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    }

    return updatedFields;
  }
}
