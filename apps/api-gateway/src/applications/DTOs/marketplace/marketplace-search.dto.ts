import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  LoanPurpose,
  LoanStatus,
} from '@p2p-lending/loan-service/generated/prisma';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

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

export class MarketplaceSearchDto {
  @ApiPropertyOptional({
    description: 'Search query text',
    example: 'business expansion loan',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Minimum loan amount',
    example: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @ApiPropertyOptional({
    description: 'Maximum loan amount',
    example: 50000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxAmount?: number;

  @ApiPropertyOptional({
    description: 'Minimum interest rate',
    example: 5.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minInterestRate?: number;

  @ApiPropertyOptional({
    description: 'Maximum interest rate',
    example: 15.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  maxInterestRate?: number;

  @ApiPropertyOptional({
    description: 'Minimum term in months',
    example: 6,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  minTermMonths?: number;

  @ApiPropertyOptional({
    description: 'Maximum term in months',
    example: 60,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxTermMonths?: number;

  @ApiPropertyOptional({
    description: 'Borrower experience levels',
    enum: ExperienceLevel,
    isArray: true,
    example: [ExperienceLevel.INTERMEDIATE, ExperienceLevel.EXPERT],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ExperienceLevel, { each: true })
  //   @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  experienceLevels?: ExperienceLevel[];

  @ApiPropertyOptional({
    description: 'Loan types/purposes',
    enum: LoanType,
    isArray: true,
    example: [LoanType.BUSINESS, LoanType.PERSONAL],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(LoanType, { each: true })
  loanTypes?: LoanType[];

  @ApiPropertyOptional({
    description: 'Countries',
    enum: Country,
    isArray: true,
    example: [Country.LATVIA, Country.ESTONIA],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Country, { each: true })
  countries?: Country[];

  @ApiPropertyOptional({
    description: 'Credit ratings',
    enum: CreditRating,
    isArray: true,
    example: [CreditRating.A, CreditRating.B_PLUS],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(CreditRating, { each: true })
  ratings?: CreditRating[];

  @ApiPropertyOptional({
    description: 'Loan statuses to filter by',
    enum: LoanStatus,
    isArray: true,
    example: [LoanStatus.LISTED, LoanStatus.FUNDING],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(LoanStatus, { each: true })
  statuses?: LoanStatus[];

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'interestRate',
    enum: ['createdAt', 'interestRate', 'requestedAmount', 'fundingProgress'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class MarketplaceFiltersResponseDto {
  @ApiProperty({
    description: 'Available experience levels with counts',
    example: [
      { value: 'ENTRY', label: 'Entry Level', count: 171 },
      { value: 'INTERMEDIATE', label: 'Intermediate', count: 2770 },
      { value: 'EXPERT', label: 'Expert', count: 1982 },
    ],
  })
  experienceLevels: FilterOption[];

  @ApiProperty({
    description: 'Available loan types with counts',
    example: [
      { value: 'BUSINESS', label: 'Business loans', count: 45 },
      { value: 'PERSONAL', label: 'Personal loans', count: 32 },
    ],
  })
  loanTypes: FilterOption[];

  @ApiProperty({
    description: 'Available countries with counts',
    example: [
      { value: 'LATVIA', label: 'Latvia', count: 35 },
      { value: 'ESTONIA', label: 'Estonia', count: 28 },
    ],
  })
  countries: FilterOption[];

  @ApiProperty({
    description: 'Available credit ratings with counts',
    example: [
      { value: 'A+', label: 'A+', count: 25 },
      { value: 'A', label: 'A', count: 30 },
    ],
  })
  ratings: FilterOption[];

  @ApiProperty({
    description: 'Amount range statistics',
    example: { min: 500, max: 100000, average: 15000 },
  })
  amountRange: RangeStats;

  @ApiProperty({
    description: 'Interest rate range statistics',
    example: { min: 3.5, max: 18.0, average: 8.7 },
  })
  interestRateRange: RangeStats;

  @ApiProperty({
    description: 'Term range statistics in months',
    example: { min: 6, max: 60, average: 24 },
  })
  termRange: RangeStats;
}

interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface RangeStats {
  min: number;
  max: number;
  average: number;
}

export class MarketplaceSearchResponseDto {
  @ApiProperty({ description: 'Total number of loans matching criteria' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Array of loan listings' })
  loans: MarketplaceLoanDto[];

  @ApiProperty({ description: 'Available filters and their counts' })
  filters: MarketplaceFiltersResponseDto;
}

export class MarketplaceLoanDto {
  @ApiProperty({ description: 'Loan ID' })
  id: string;

  @ApiProperty({ description: 'Loan number for display' })
  loanNumber: number;

  @ApiProperty({ description: 'Requested loan amount' })
  requestedAmount: number;

  @ApiProperty({ description: 'Currently funded amount' })
  fundedAmount: number;

  @ApiProperty({ description: 'Funding progress percentage' })
  fundingProgress: number;

  @ApiProperty({ description: 'Annual interest rate' })
  interestRate: number;

  @ApiProperty({ description: 'Loan term in months' })
  termMonths: number;

  @ApiProperty({ description: 'Monthly payment amount' })
  monthlyPayment: number;

  @ApiProperty({ description: 'Loan purpose' })
  purpose: LoanPurpose;

  @ApiProperty({ description: 'Loan description' })
  description: string;

  @ApiProperty({ description: 'Current loan status' })
  status: LoanStatus;

  @ApiProperty({ description: 'Date when loan was listed' })
  listingDate: Date;

  @ApiProperty({ description: 'Funding deadline' })
  fundingDeadline: Date;

  @ApiProperty({ description: 'Borrower experience level' })
  experienceLevel: ExperienceLevel;

  @ApiProperty({ description: 'Borrower credit rating' })
  creditRating: CreditRating;

  @ApiProperty({ description: 'Borrower country' })
  country: Country;

  @ApiProperty({ description: 'Days remaining for funding' })
  daysRemaining: number;

  @ApiProperty({ description: 'Number of investors' })
  investorCount: number;

  @ApiProperty({ description: 'Expected annual return' })
  expectedReturn: number;
}
