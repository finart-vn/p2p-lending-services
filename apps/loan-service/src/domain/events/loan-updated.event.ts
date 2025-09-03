import {
  LoanPurpose,
  LoanStatus,
} from '@p2p-lending/loan-service/generated/prisma';

export interface LoanUpdatedEventData {
  loanId: string;
  borrowerId: string;
  changes: {
    description?: string;
    purpose?: LoanPurpose;
    termMonths?: number;
    interestRate?: number;
    monthlyPayment?: number;
  };
  updatedAt: Date;
}

export class LoanUpdatedEvent {
  constructor(
    public readonly data: LoanUpdatedEventData,
    public readonly occurredOn: Date = new Date(),
  ) {}
}
