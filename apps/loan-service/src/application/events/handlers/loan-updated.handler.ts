import { LoanUpdatedEvent } from '@loan-service/domain/events/loan-updated.event';
import { Injectable, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@Injectable()
@EventsHandler(LoanUpdatedEvent)
export class LoanUpdatedHandler implements IEventHandler<LoanUpdatedEvent> {
  private readonly logger = new Logger(LoanUpdatedHandler.name);

  async handle(event: LoanUpdatedEvent): Promise<void> {
    this.logger.log(`Loan updated event handled: ${event.data.loanId}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.logger.log(
      `Sent notification Updated to borrower: ${event.data.loanId}`,
    );
    // Here you can add side effects like:
    // - Update read models
    // - Send notifications about changes
    // - Log audit trail
    // - Trigger validation processes

    // Example: Update search index
    // await this.searchService.updateLoanIndex(event.data.loanId);

    // Example: Send notification if significant changes
    // if (event.data.changes.interestRate || event.data.changes.termMonths) {
    //   await this.notificationService.sendLoanTermsChangedNotification(event.data.borrowerId, event.data.loanId);
    // }
  }
}
