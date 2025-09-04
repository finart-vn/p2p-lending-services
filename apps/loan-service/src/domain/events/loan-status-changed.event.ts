import { LoanStatus } from '@loan-service/prisma';

export interface LoanStatusChangedEventData {
  loanId: string;
  borrowerId: string;
  previousStatus: LoanStatus;
  newStatus: LoanStatus;
  changedAt: Date;
}

export class LoanStatusChangedEvent {
  constructor(
    public readonly data: LoanStatusChangedEventData,
    public readonly occurredOn: Date = new Date(),
  ) {}
}
