import { InvestmentStatus } from '@investment-service/prisma';

interface InvestmentResponse {
  id: string;
  lenderId: string;
  loanId: string;
  amount: number;
  percentage: number;
  expectedReturn: number;
  totalReceived: number;
  status: InvestmentStatus;
  investedAt: Date;
  completedAt: Date | null;
}

interface InvestmentPortfolioResponse {
  totalInvestments: number;
  totalAmount: number;
  totalExpectedReturn: number;
  totalReceived: number;
  activeInvestments: number;
  completedInvestments: number;
  defaultedInvestments: number;
  investments: InvestmentResponse[];
}

interface InvestmentCalculationResponse {
  investmentId: string;
  principalAmount: number;
  interestEarned: number;
  totalReturn: number;
  annualizedReturn: number;
  daysInvested: number;
}

export {
  InvestmentCalculationResponse,
  InvestmentPortfolioResponse,
  InvestmentResponse,
};
