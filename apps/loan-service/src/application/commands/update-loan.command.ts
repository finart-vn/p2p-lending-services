import { LoanPurpose } from '@p2p-lending/loan-service/generated/prisma';

export interface UpdateLoanCommandData {
  description?: string;
  purpose?: LoanPurpose;
  termMonths?: number;
  interestRate?: number;
  monthlyPayment?: number;
}

export class UpdateLoanCommand {
  constructor(
    public readonly loanId: string,
    public readonly updates: UpdateLoanCommandData,
  ) {}
}
