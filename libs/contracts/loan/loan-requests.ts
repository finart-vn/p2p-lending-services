import { LoanPurpose, LoanStatus } from '@loan-service/prisma';

interface CreateLoanRequest {
  borrowerId: string;
  requestedAmount: number;
  fundedAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  purpose: LoanPurpose;
  description: string | null;
  listingDate: Date | null;
  fundingDeadline: Date | null;
}

interface UpdateLoanRequest {
  id: string;
  requestedAmount: number;
  fundedAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  purpose: LoanPurpose;
  description: string | null;
  status: LoanStatus;
}

export { CreateLoanRequest, UpdateLoanRequest };
