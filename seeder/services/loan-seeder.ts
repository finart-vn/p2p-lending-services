import { loanPrisma } from '../prisma-clients';
import {
  LoanPurpose,
  LoanStatus,
} from '../../apps/loan-service/generated/prisma';

/**
 * Loan Service Seeder
 *
 * Seeds loan data for the P2P lending platform
 */

export interface LoanSeedData {
  id: string;
  borrowerId: string;
  requestedAmount: number;
  interestRate: number;
  termMonths: number;
  purpose: LoanPurpose;
  description: string;
  status: LoanStatus;
  listingDate?: Date;
  fundingDeadline?: Date;
  disbursedAt?: Date;
}

export const defaultLoans: LoanSeedData[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440201',
    borrowerId: '550e8400-e29b-41d4-a716-446655440002', // John Borrower
    requestedAmount: 15000.0,
    interestRate: 8.5,
    termMonths: 36,
    purpose: LoanPurpose.PERSONAL,
    description:
      'Personal loan for home renovation and furniture purchase. Planning to upgrade living space with modern amenities.',
    status: LoanStatus.LISTED,
    listingDate: new Date('2024-01-15'),
    fundingDeadline: new Date('2024-02-15'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440202',
    borrowerId: '550e8400-e29b-41d4-a716-446655440002', // John Borrower
    requestedAmount: 25000.0,
    interestRate: 7.2,
    termMonths: 24,
    purpose: LoanPurpose.BUSINESS,
    description:
      'Business expansion loan for opening a second location. Established business with 3 years of profitable operations.',
    status: LoanStatus.APPROVED,
    listingDate: new Date('2024-01-10'),
    fundingDeadline: new Date('2024-02-10'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440203',
    borrowerId: '550e8400-e29b-41d4-a716-446655440005', // Sarah Borrower
    requestedAmount: 12000.0,
    interestRate: 9.0,
    termMonths: 48,
    purpose: LoanPurpose.EDUCATION,
    description:
      'Education loan for pursuing MBA program. Includes tuition fees and living expenses for 2-year program.',
    status: LoanStatus.FUNDING,
    listingDate: new Date('2024-01-20'),
    fundingDeadline: new Date('2024-02-20'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440204',
    borrowerId: '550e8400-e29b-41d4-a716-446655440005', // Sarah Borrower
    requestedAmount: 8000.0,
    interestRate: 6.8,
    termMonths: 18,
    purpose: LoanPurpose.DEBT_CONSOLIDATION,
    description:
      'Debt consolidation loan to pay off high-interest credit cards. Will reduce monthly payments and interest rates.',
    status: LoanStatus.ACTIVE,
    listingDate: new Date('2023-12-01'),
    fundingDeadline: new Date('2023-12-31'),
    disbursedAt: new Date('2024-01-01'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440205',
    borrowerId: '550e8400-e29b-41d4-a716-446655440002', // John Borrower
    requestedAmount: 35000.0,
    interestRate: 5.5,
    termMonths: 60,
    purpose: LoanPurpose.HOME_IMPROVEMENT,
    description:
      'Home improvement loan for major renovations including kitchen and bathroom upgrades. Property value will increase significantly.',
    status: LoanStatus.PENDING,
    listingDate: new Date('2024-01-25'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440206',
    borrowerId: '550e8400-e29b-41d4-a716-446655440005', // Sarah Borrower
    requestedAmount: 5000.0,
    interestRate: 10.5,
    termMonths: 12,
    purpose: LoanPurpose.PERSONAL,
    description:
      'Emergency personal loan for unexpected medical expenses. Quick funding needed for urgent situation.',
    status: LoanStatus.DRAFT,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440207',
    borrowerId: '550e8400-e29b-41d4-a716-446655440002', // John Borrower
    requestedAmount: 20000.0,
    interestRate: 6.0,
    termMonths: 36,
    purpose: LoanPurpose.BUSINESS,
    description:
      'Business equipment loan for purchasing new machinery. Will increase production capacity by 40%.',
    status: LoanStatus.COMPLETED,
    listingDate: new Date('2023-10-01'),
    fundingDeadline: new Date('2023-10-31'),
    disbursedAt: new Date('2023-11-01'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440208',
    borrowerId: '550e8400-e29b-41d4-a716-446655440005', // Sarah Borrower
    requestedAmount: 30000.0,
    interestRate: 7.8,
    termMonths: 24,
    purpose: LoanPurpose.EDUCATION,
    description:
      'Professional certification program loan. Includes course fees, materials, and exam costs for industry certification.',
    status: LoanStatus.REJECTED,
    listingDate: new Date('2023-11-15'),
  },
];

export async function seedLoans(): Promise<void> {
  console.log('🌱 Seeding loans...');

  try {
    // Clear existing data
    await loanPrisma.loan.deleteMany();

    // Create loans
    console.log('Creating loans...');
    for (const loanData of defaultLoans) {
      // Calculate monthly payment using simple interest formula
      const monthlyRate = loanData.interestRate / 100 / 12;
      const monthlyPayment =
        (loanData.requestedAmount *
          monthlyRate *
          Math.pow(1 + monthlyRate, loanData.termMonths)) /
        (Math.pow(1 + monthlyRate, loanData.termMonths) - 1);

      await loanPrisma.loan.create({
        data: {
          ...loanData,
          monthlyPayment: Math.round(monthlyPayment * 100) / 100, // Round to 2 decimal places
          fundedAmount:
            loanData.status === LoanStatus.ACTIVE ||
            loanData.status === LoanStatus.COMPLETED
              ? loanData.requestedAmount
              : 0,
        },
      });
    }

    console.log('✅ Loans seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding loans:', error);
    throw error;
  }
}

export async function clearLoans(): Promise<void> {
  console.log('🧹 Clearing loan data...');

  try {
    await loanPrisma.loan.deleteMany();

    console.log('✅ Loan data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing loan data:', error);
    throw error;
  }
}
