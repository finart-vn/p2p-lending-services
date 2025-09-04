import { LoanDeletedEvent } from '@loan-service/domain/events/loan-deleted.event';
import { Injectable, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@Injectable()
@EventsHandler(LoanDeletedEvent)
export class LoanDeletedHandler implements IEventHandler<LoanDeletedEvent> {
  private readonly logger = new Logger(LoanDeletedHandler.name);

  async handle(event: LoanDeletedEvent): Promise<void> {
    this.logger.log(`Loan deleted event handled: ${event.data.loanId}`);

    // Here you can add side effects like:
    // - Remove from search index
    // - Clean up related data
    // - Send notifications
    // - Log audit trail

    // Example: Remove from search index
    // await this.searchService.removeLoanFromIndex(event.data.loanId);

    // Example: Clean up related investments
    // await this.investmentService.cancelRelatedInvestments(event.data.loanId);

    // Example: Send notification
    // await this.notificationService.sendLoanDeletedNotification(event.data.borrowerId, event.data.loanId);
  }
}
