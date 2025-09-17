import * as dotenv from 'dotenv';

import { PrismaClient as AuthPrismaClient } from '../apps/auth-service/generated/prisma';
import { PrismaClient as InvestmentPrismaClient } from '../apps/investment-service/generated/prisma';
import { PrismaClient as LoanPrismaClient } from '../apps/loan-service/generated/prisma';
import { PrismaClient as UserPrismaClient } from '../apps/user-service/generated/prisma';

// Load environment variables from .env file
dotenv.config();

// Debug: Log environment variables (remove in production)
console.log('🔍 Environment Variables Debug:');
console.log(
  'USER_SERVICE_DATABASE_URL:',
  process.env.USER_SERVICE_DATABASE_URL ? '✅ Set' : '❌ Not set',
);
console.log(
  'AUTH_SERVICE_DATABASE_URL:',
  process.env.AUTH_SERVICE_DATABASE_URL ? '✅ Set' : '❌ Not set',
);
console.log(
  'LOAN_SERVICE_DATABASE_URL:',
  process.env.LOAN_SERVICE_DATABASE_URL ? '✅ Set' : '❌ Not set',
);
console.log(
  'INVESTMENT_SERVICE_DATABASE_URL:',
  process.env.INVESTMENT_SERVICE_DATABASE_URL ? '✅ Set' : '❌ Not set',
);

/**
 * Prisma Client Connections for All Services
 *
 * This file provides centralized access to all Prisma clients
 * for the P2P lending platform services.
 */

// User Service Prisma Client
console.log(process.env.USER_SERVICE_DATABASE_URL);

export const userPrisma = new UserPrismaClient({
  datasources: {
    db: {
      url: process.env.USER_SERVICE_DATABASE_URL,
    },
  },
});

// Auth Service Prisma Client
export const authPrisma = new AuthPrismaClient({
  datasources: {
    db: {
      url:
        process.env.AUTH_SERVICE_DATABASE_URL ||
        'postgresql://postgres:password@localhost:5432/p2p_auth_db?schema=public',
    },
  },
});

// Loan Service Prisma Client
export const loanPrisma = new LoanPrismaClient({
  datasources: {
    db: {
      url:
        process.env.LOAN_SERVICE_DATABASE_URL ||
        'postgresql://postgres:password@localhost:5432/p2p_loan_db?schema=public',
    },
  },
});

// Investment Service Prisma Client
export const investmentPrisma = new InvestmentPrismaClient({
  datasources: {
    db: {
      url:
        process.env.INVESTMENT_SERVICE_DATABASE_URL ||
        'postgresql://postgres:password@localhost:5432/p2p_investment_db?schema=public',
    },
  },
});

/**
 * Disconnect all Prisma clients
 */
export async function disconnectAllClients(): Promise<void> {
  await Promise.all([
    userPrisma.$disconnect(),
    authPrisma.$disconnect(),
    loanPrisma.$disconnect(),
    investmentPrisma.$disconnect(),
  ]);
}

/**
 * Health check for all database connections
 */
export async function healthCheckAllDatabases(): Promise<{
  user: boolean;
  auth: boolean;
  loan: boolean;
  investment: boolean;
}> {
  const results = await Promise.allSettled([
    userPrisma.$queryRaw`SELECT 1`,
    authPrisma.$queryRaw`SELECT 1`,
    loanPrisma.$queryRaw`SELECT 1`,
    investmentPrisma.$queryRaw`SELECT 1`,
  ]);

  return {
    user: results[0].status === 'fulfilled',
    auth: results[1].status === 'fulfilled',
    loan: results[2].status === 'fulfilled',
    investment: results[3].status === 'fulfilled',
  };
}
