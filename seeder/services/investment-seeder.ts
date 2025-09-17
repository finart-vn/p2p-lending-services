import { InvestmentStatus } from '../../apps/investment-service/generated/prisma';
import { investmentPrisma } from '../prisma-clients';

/**
 * Investment Service Seeder
 *
 * Seeds investment data for the P2P lending platform
 */

export interface InvestmentSeedData {
  id: string;
  lenderId: string;
  loanId: string;
  amount: number;
  percentage: number;
  expectedReturn: number;
  totalReceived: number;
  status: InvestmentStatus;
  investedAt: Date;
  completedAt?: Date;
}

export const defaultInvestments: InvestmentSeedData[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440301',
    lenderId: '550e8400-e29b-41d4-a716-446655440003', // Jane Lender
    loanId: '550e8400-e29b-41d4-a716-446655440201', // John's Personal Loan
    amount: 5000.0,
    percentage: 33.33,
    expectedReturn: 5500.0,
    totalReceived: 0.0,
    status: InvestmentStatus.ACTIVE,
    investedAt: new Date('2024-01-16'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440302',
    lenderId: '550e8400-e29b-41d4-a716-446655440006', // David Lender
    loanId: '550e8400-e29b-41d4-a716-446655440201', // John's Personal Loan
    amount: 7500.0,
    percentage: 50.0,
    expectedReturn: 8250.0,
    totalReceived: 0.0,
    status: InvestmentStatus.ACTIVE,
    investedAt: new Date('2024-01-17'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440303',
    lenderId: '550e8400-e29b-41d4-a716-446655440003', // Jane Lender
    loanId: '550e8400-e29b-41d4-a716-446655440202', // John's Business Loan
    amount: 10000.0,
    percentage: 40.0,
    expectedReturn: 11000.0,
    totalReceived: 0.0,
    status: InvestmentStatus.ACTIVE,
    investedAt: new Date('2024-01-12'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440304',
    lenderId: '550e8400-e29b-41d4-a716-446655440006', // David Lender
    loanId: '550e8400-e29b-41d4-a716-446655440202', // John's Business Loan
    amount: 15000.0,
    percentage: 60.0,
    expectedReturn: 16500.0,
    totalReceived: 0.0,
    status: InvestmentStatus.ACTIVE,
    investedAt: new Date('2024-01-13'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440305',
    lenderId: '550e8400-e29b-41d4-a716-446655440003', // Jane Lender
    loanId: '550e8400-e29b-41d4-a716-446655440203', // Sarah's Education Loan
    amount: 6000.0,
    percentage: 50.0,
    expectedReturn: 7200.0,
    totalReceived: 0.0,
    status: InvestmentStatus.ACTIVE,
    investedAt: new Date('2024-01-21'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440306',
    lenderId: '550e8400-e29b-41d4-a716-446655440006', // David Lender
    loanId: '550e8400-e29b-41d4-a716-446655440203', // Sarah's Education Loan
    amount: 6000.0,
    percentage: 50.0,
    expectedReturn: 7200.0,
    totalReceived: 0.0,
    status: InvestmentStatus.ACTIVE,
    investedAt: new Date('2024-01-22'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440307',
    lenderId: '550e8400-e29b-41d4-a716-446655440003', // Jane Lender
    loanId: '550e8400-e29b-41d4-a716-446655440204', // Sarah's Debt Consolidation Loan
    amount: 4000.0,
    percentage: 50.0,
    expectedReturn: 4400.0,
    totalReceived: 1200.0, // Partial payment received
    status: InvestmentStatus.ACTIVE,
    investedAt: new Date('2023-12-15'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440308',
    lenderId: '550e8400-e29b-41d4-a716-446655440006', // David Lender
    loanId: '550e8400-e29b-41d4-a716-446655440204', // Sarah's Debt Consolidation Loan
    amount: 4000.0,
    percentage: 50.0,
    expectedReturn: 4400.0,
    totalReceived: 1200.0, // Partial payment received
    status: InvestmentStatus.ACTIVE,
    investedAt: new Date('2023-12-16'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440309',
    lenderId: '550e8400-e29b-41d4-a716-446655440003', // Jane Lender
    loanId: '550e8400-e29b-41d4-a716-446655440207', // John's Completed Business Loan
    amount: 10000.0,
    percentage: 50.0,
    expectedReturn: 11000.0,
    totalReceived: 11000.0, // Fully paid
    status: InvestmentStatus.COMPLETED,
    investedAt: new Date('2023-10-15'),
    completedAt: new Date('2024-01-15'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440310',
    lenderId: '550e8400-e29b-41d4-a716-446655440006', // David Lender
    loanId: '550e8400-e29b-41d4-a716-446655440207', // John's Completed Business Loan
    amount: 10000.0,
    percentage: 50.0,
    expectedReturn: 11000.0,
    totalReceived: 11000.0, // Fully paid
    status: InvestmentStatus.COMPLETED,
    investedAt: new Date('2023-10-16'),
    completedAt: new Date('2024-01-15'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440311',
    lenderId: '550e8400-e29b-41d4-a716-446655440003', // Jane Lender
    loanId: '550e8400-e29b-41d4-a716-446655440205', // John's Pending Home Improvement Loan
    amount: 17500.0,
    percentage: 50.0,
    expectedReturn: 19250.0,
    totalReceived: 0.0,
    status: InvestmentStatus.PENDING,
    investedAt: new Date('2024-01-26'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440312',
    lenderId: '550e8400-e29b-41d4-a716-446655440006', // David Lender
    loanId: '550e8400-e29b-41d4-a716-446655440205', // John's Pending Home Improvement Loan
    amount: 17500.0,
    percentage: 50.0,
    expectedReturn: 19250.0,
    totalReceived: 0.0,
    status: InvestmentStatus.PENDING,
    investedAt: new Date('2024-01-27'),
  },
];

export async function seedInvestments(): Promise<void> {
  console.log('🌱 Seeding investments...');

  try {
    // Clear existing data
    await investmentPrisma.investment.deleteMany();

    // Create investments
    console.log('Creating investments...');
    for (const investmentData of defaultInvestments) {
      await investmentPrisma.investment.create({
        data: investmentData,
      });
    }

    console.log('✅ Investments seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding investments:', error);
    throw error;
  }
}

export async function clearInvestments(): Promise<void> {
  console.log('🧹 Clearing investment data...');

  try {
    await investmentPrisma.investment.deleteMany();

    console.log('✅ Investment data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing investment data:', error);
    throw error;
  }
}
