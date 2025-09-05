import { LoanPurpose, LoanStatus } from '@loan-service/prisma';

export interface LoanSummary {
  id: string;
  loanNumber: number;
  borrowerId: string;
  requestedAmount: number;
  fundedAmount: number;
  interestRate: number;
  termMonths: number;
  status: LoanStatus;
  purpose: LoanPurpose;
  createdAt: Date;
  fundingProgress: number;
}

export interface LoanDetails extends LoanSummary {
  monthlyPayment: number;
  description?: string | null;
  listingDate?: Date | null;
  fundingDeadline?: Date | null;
  disbursedAt?: Date | null;
  updatedAt: Date;
  daysRemaining: number;
  totalInterest: number;
}

export interface LoanFilters {
  minAmount?: number;
  maxAmount?: number;
  minInterestRate?: number;
  maxInterestRate?: number;
  minTermMonths?: number;
  maxTermMonths?: number;
  purposes?: LoanPurpose[];
  statuses?: LoanStatus[];
}

export interface LoanSearchParams extends LoanFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?:
    | 'createdAt'
    | 'requestedAmount'
    | 'interestRate'
    | 'termMonths'
    | 'fundingProgress';
  sortOrder?: 'asc' | 'desc';
}

export interface LoanSearchResult {
  loans: LoanSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: {
    experienceLevels: FilterOption[];
    loanTypes: FilterOption[];
    countries: FilterOption[];
    ratings: FilterOption[];
  };
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

export interface LoanRiskInfo {
  riskLevel: RiskLevel;
  riskScore: number;
  probabilityOfDefault: number;
  requiredReserves: number;
}
