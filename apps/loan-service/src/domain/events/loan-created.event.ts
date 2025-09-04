import { LoanPurpose, LoanStatus } from '@loan-service/prisma';

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
