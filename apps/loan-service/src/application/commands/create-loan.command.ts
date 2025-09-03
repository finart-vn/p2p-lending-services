import { LoanPurpose } from '@p2p-lending/loan-service/generated/prisma';

export class CreateLoanCommand {
  constructor(
    public readonly borrowerId: string,
    public readonly requestedAmount: number,
    public readonly interestRate: number,
    public readonly termMonths: number,
    public readonly monthlyPayment: number,
    public readonly purpose: LoanPurpose,
    public readonly description?: string,
  ) {}
}
