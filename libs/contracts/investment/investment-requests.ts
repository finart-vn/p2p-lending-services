import { InvestmentStatus } from '@p2p-lending/investment-service/generated/prisma';

interface CreateInvestmentRequest {
  lenderId: string;
  loanId: string;
  amount: number;
  percentage: number;
  expectedReturn: number;
  totalReceived: number;
  status?: InvestmentStatus;
}

interface UpdateInvestmentRequest {
  id: string;
  amount?: number;
  percentage?: number;
  expectedReturn?: number;
  totalReceived?: number;
  status?: InvestmentStatus;
  completedAt?: Date | null;
}

interface CancelInvestmentRequest {
  id: string;
  reason?: string;
}

export {
  CancelInvestmentRequest,
  CreateInvestmentRequest,
  UpdateInvestmentRequest,
};
