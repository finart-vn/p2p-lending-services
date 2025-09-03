import { UpdateLoanRequest } from '@p2p-lending/contracts/loan/loan-requests';

export interface LoanUpdatedEventData {
  loanId: string;
  borrowerId: string;
  changes: UpdateLoanRequest;
  updatedAt: Date;
}

export class LoanUpdatedEvent {
  constructor(
    public readonly data: LoanUpdatedEventData,
    public readonly occurredOn: Date = new Date(),
  ) {}
}
