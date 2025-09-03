import {
  LoanPurpose,
  LoanStatus,
} from '@p2p-lending/loan-service/generated/prisma';

export interface LoanCreatedEventData {
  loanId: string;
  borrowerId: string;
  loanNumber: number;
  requestedAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  purpose: LoanPurpose;
  description?: string;
  status: LoanStatus;
  createdAt: Date;
}

export class LoanCreatedEvent {
  constructor(
    public readonly data: LoanCreatedEventData,
    public readonly occurredOn: Date = new Date(),
  ) {}
}
