import {
  LoanPurpose,
  LoanStatus,
} from '@p2p-lending/loan-service/generated/prisma';

export enum ExperienceLevel {
  ENTRY = 'ENTRY',
  INTERMEDIATE = 'INTERMEDIATE',
  EXPERT = 'EXPERT',
}

export enum LoanType {
  BUSINESS = 'BUSINESS',
  PERSONAL = 'PERSONAL',
  CAR = 'CAR',
  REAL_ESTATE = 'REAL_ESTATE',
  CONSUMER = 'CONSUMER',
}

export enum Country {
  LATVIA = 'LATVIA',
  ESTONIA = 'ESTONIA',
  LITHUANIA = 'LITHUANIA',
  POLAND = 'POLAND',
  CZECH_REPUBLIC = 'CZECH_REPUBLIC',
}

export enum CreditRating {
  A_PLUS = 'A+',
  A = 'A',
  A_MINUS = 'A-',
  B_PLUS = 'B+',
  B = 'B',
  B_MINUS = 'B-',
}

export interface MarketplaceSearchRequest {
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  minInterestRate?: number;
  maxInterestRate?: number;
  minTermMonths?: number;
  maxTermMonths?: number;
  experienceLevels?: ExperienceLevel[];
  loanTypes?: LoanType[];
  countries?: Country[];
  ratings?: CreditRating[];
  statuses?: LoanStatus[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface MarketplaceSearchResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loans: MarketplaceLoan[];
  filters: MarketplaceFilters;
}

export interface MarketplaceLoan {
  id: string;
  loanNumber: number;
  requestedAmount: number;
  fundedAmount: number;
  fundingProgress: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  purpose: LoanPurpose;
  description: string | null;
  status: LoanStatus;
  listingDate: Date | null;
  fundingDeadline: Date | null;
  experienceLevel: ExperienceLevel;
  creditRating: CreditRating;
  country: Country;
  daysRemaining: number;
  investorCount: number;
  expectedReturn: number;
}

export interface MarketplaceFilters {
  experienceLevels: FilterOption[];
  loanTypes: FilterOption[];
  countries: FilterOption[];
  ratings: FilterOption[];
  amountRange: RangeStats;
  interestRateRange: RangeStats;
  termRange: RangeStats;
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface RangeStats {
  min: number;
  max: number;
  average: number;
}
