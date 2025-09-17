import * as bcrypt from 'bcrypt';

import { authPrisma } from '../prisma-clients';

/**
 * Auth Service Seeder
 *
 * Seeds authentication data including user auth records
 */

export interface UserAuthSeedData {
  id: string;
  email: string;
  passwordHash: string;
  userId: string;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  isActive: boolean;
  failedLoginAttempts: number;
  lastSuccessfulLoginAt?: Date;
}

export const defaultUserAuths: UserAuthSeedData[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440101',
    email: 'admin@p2plending.com',
    passwordHash: '', // Will be set with hashed password
    userId: '550e8400-e29b-41d4-a716-446655440001',
    emailVerified: true,
    emailVerifiedAt: new Date(),
    isActive: true,
    failedLoginAttempts: 0,
    lastSuccessfulLoginAt: new Date(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440102',
    email: 'john.borrower@example.com',
    passwordHash: '', // Will be set with hashed password
    userId: '550e8400-e29b-41d4-a716-446655440002',
    emailVerified: true,
    emailVerifiedAt: new Date(),
    isActive: true,
    failedLoginAttempts: 0,
    lastSuccessfulLoginAt: new Date(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440103',
    email: 'jane.lender@example.com',
    passwordHash: '', // Will be set with hashed password
    userId: '550e8400-e29b-41d4-a716-446655440003',
    emailVerified: true,
    emailVerifiedAt: new Date(),
    isActive: true,
    failedLoginAttempts: 0,
    lastSuccessfulLoginAt: new Date(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440104',
    email: 'mike.moderator@example.com',
    passwordHash: '', // Will be set with hashed password
    userId: '550e8400-e29b-41d4-a716-446655440004',
    emailVerified: true,
    emailVerifiedAt: new Date(),
    isActive: true,
    failedLoginAttempts: 0,
    lastSuccessfulLoginAt: new Date(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440105',
    email: 'sarah.borrower@example.com',
    passwordHash: '', // Will be set with hashed password
    userId: '550e8400-e29b-41d4-a716-446655440005',
    emailVerified: false,
    isActive: true,
    failedLoginAttempts: 0,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440106',
    email: 'david.lender@example.com',
    passwordHash: '', // Will be set with hashed password
    userId: '550e8400-e29b-41d4-a716-446655440006',
    emailVerified: true,
    emailVerifiedAt: new Date(),
    isActive: true,
    failedLoginAttempts: 0,
    lastSuccessfulLoginAt: new Date(),
  },
];

export const defaultPasswords = {
  'admin@p2plending.com': 'Admin123!',
  'john.borrower@example.com': 'Borrower123!',
  'jane.lender@example.com': 'Lender123!',
  'mike.moderator@example.com': 'Moderator123!',
  'sarah.borrower@example.com': 'Borrower456!',
  'david.lender@example.com': 'Lender456!',
};

export async function seedUserAuths(): Promise<void> {
  console.log('🌱 Seeding user authentication data...');

  try {
    // Clear existing data
    await authPrisma.authAuditLog.deleteMany();
    await authPrisma.rateLimit.deleteMany();
    await authPrisma.userAuth.deleteMany();

    // Hash passwords and create user auth records
    console.log('Creating user authentication records...');
    for (const authData of defaultUserAuths) {
      const plainPassword =
        defaultPasswords[authData.email as keyof typeof defaultPasswords];
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      await authPrisma.userAuth.create({
        data: {
          ...authData,
          passwordHash: hashedPassword,
        },
      });
    }

    // Create some sample audit logs
    console.log('Creating sample audit logs...');
    const auditLogs = [
      {
        userAuthId: '550e8400-e29b-41d4-a716-446655440101',
        eventType: 'register',
        success: true,
        message: 'User registered successfully',
        ipAddress: '192.168.1.100',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      {
        userAuthId: '550e8400-e29b-41d4-a716-446655440101',
        eventType: 'login',
        success: true,
        message: 'User logged in successfully',
        ipAddress: '192.168.1.100',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      {
        userAuthId: '550e8400-e29b-41d4-a716-446655440102',
        eventType: 'register',
        success: true,
        message: 'User registered successfully',
        ipAddress: '192.168.1.101',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      {
        userAuthId: '550e8400-e29b-41d4-a716-446655440103',
        eventType: 'login',
        success: true,
        message: 'User logged in successfully',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      },
    ];

    for (const logData of auditLogs) {
      await authPrisma.authAuditLog.create({
        data: logData,
      });
    }

    console.log('✅ User authentication data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding user authentication data:', error);
    throw error;
  }
}

export async function clearUserAuths(): Promise<void> {
  console.log('🧹 Clearing user authentication data...');

  try {
    await authPrisma.authAuditLog.deleteMany();
    await authPrisma.rateLimit.deleteMany();
    await authPrisma.userAuth.deleteMany();

    console.log('✅ User authentication data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing user authentication data:', error);
    throw error;
  }
}
