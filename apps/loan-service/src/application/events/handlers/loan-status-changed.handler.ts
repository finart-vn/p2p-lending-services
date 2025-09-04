import { LoanStatusChangedEvent } from '@loan-service/domain/events/loan-status-changed.event';
import { Injectable, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@Injectable()
@EventsHandler(LoanStatusChangedEvent)
export class LoanStatusChangedHandler
  implements IEventHandler<LoanStatusChangedEvent>
{
  private readonly logger = new Logger(LoanStatusChangedHandler.name);

  async handle(event: LoanStatusChangedEvent): Promise<void> {
    this.logger.log(
      `Loan status changed event handled: ${event.data.loanId} from ${event.data.previousStatus} to ${event.data.newStatus}`,
    );

    // Here you can add side effects based on status changes:

    switch (event.data.newStatus) {
      case 'APPROVED':
        // Notify borrower of approval
        // await this.notificationService.sendLoanApprovedNotification(event.data.borrowerId, event.data.loanId);
        break;

      case 'LISTED':
        // Add to marketplace
        // await this.marketplaceService.addLoanToListing(event.data.loanId);
        // Notify potential investors
        // await this.notificationService.sendNewLoanListingNotification(event.data.loanId);
        break;

      case 'FUNDING':
        // Start funding process
        // await this.fundingService.startFundingProcess(event.data.loanId);
        break;

      case 'ACTIVE':
        // Disburse funds
        // await this.paymentService.disburseLoan(event.data.loanId);
        // Start payment schedule
        // await this.paymentService.schedulePayments(event.data.loanId);
        break;

      case 'COMPLETED':
        // Finalize loan
        // await this.loanService.finalizeLoan(event.data.loanId);
        break;

      case 'DEFAULTED':
        // Handle default
        // await this.collectionsService.handleDefault(event.data.loanId);
        break;

      case 'REJECTED':
        // Notify borrower of rejection
        // await this.notificationService.sendLoanRejectedNotification(event.data.borrowerId, event.data.loanId);
        break;
    }

    // Update read models
    // await this.readModelService.updateLoanStatus(event.data.loanId, event.data.newStatus);
  }
}
