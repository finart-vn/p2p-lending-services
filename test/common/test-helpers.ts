/**
 * Common test helpers and utilities
 */

export class TestDataBuilder {
  static user(overrides: Partial<any> = {}) {
    return {
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      phone: '+1234567890',
      address: '123 Test St',
      city: 'Test City',
      country: 'Test Country',
      isActive: true,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static userAuth(overrides: Partial<any> = {}) {
    return {
      id: 'auth-123',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      userId: 'user-123',
      emailVerified: false,
      isActive: true,
      failedLoginAttempts: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static tokens(overrides: Partial<any> = {}) {
    return {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      ...overrides,
    };
  }

  static loginRequest(overrides: Partial<any> = {}) {
    return {
      email: 'test@example.com',
      password: 'password123',
      ...overrides,
    };
  }

  static registerRequest(overrides: Partial<any> = {}) {
    return {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      phone: '+1234567890',
      address: '123 Test St',
      city: 'Test City',
      country: 'Test Country',
      ...overrides,
    };
  }
}

export class MockFactory {
  static createMockPrismaService() {
    return {
      userAuth: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      authAuditLog: {
        create: jest.fn(),
      },
      tokenKey: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(),
    };
  }

  static createMockJwtService() {
    return {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
      decode: jest.fn(),
    };
  }

  static createMockConfigService() {
    return {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          JWT_SECRET: 'test-secret',
          JWT_REFRESH_SECRET: 'test-refresh-secret',
          DATABASE_URL: 'test-db-url',
        };
        return config[key] || `test-${key.toLowerCase()}`;
      }),
    };
  }

  static createMockRedisService() {
    return {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
      exists: jest.fn(),
      expire: jest.fn(),
    };
  }
}

export const testConfig = {
  jwt: {
    secret: 'test-secret',
    expiresIn: '15m',
    refreshSecret: 'test-refresh-secret',
    refreshExpiresIn: '7d',
  },
  database: {
    url: 'test-database-url',
  },
  redis: {
    host: 'localhost',
    port: 6379,
    db: 1, // Use different DB for tests
  },
};
