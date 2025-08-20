import { LoanPurpose } from '@p2p-lending/loan-service/generated/prisma';

interface CreateLoanRequest {
  borrowerId: string;
  requestedAmount: number;
  fundedAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  purpose: LoanPurpose;
  description: string | null;
  fundingDeadline: Date | null;
}
export { CreateLoanRequest };
