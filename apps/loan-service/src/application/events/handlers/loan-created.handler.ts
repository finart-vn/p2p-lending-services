import { Injectable, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LoanCreatedEvent } from '../../../domain/events/loan-created.event';

@Injectable()
@EventsHandler(LoanCreatedEvent)
export class LoanCreatedHandler implements IEventHandler<LoanCreatedEvent> {
  private readonly logger = new Logger(LoanCreatedHandler.name);

  async handle(event: LoanCreatedEvent): Promise<void> {
    this.logger.log(`Loan created event handled: ${event.data.loanId}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.logger.log(`Sent notification to borrower: ${event.data.loanId}`);
    // Here you can add side effects like:
    // - Send notifications
    // - Update read models
    // - Trigger other processes
    // - Log to external systems

    // Example: Send notification to borrower
    // await this.notificationService.sendLoanCreatedNotification(event.data.borrowerId, event.data.loanId);

    // Example: Update analytics
    // await this.analyticsService.trackLoanCreated(event.data);
  }
}
