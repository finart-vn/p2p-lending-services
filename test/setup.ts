/**
 * Global test setup file
 * This file runs before all tests and sets up common configurations
 */

// Global test timeout
jest.setTimeout(10000);

// Mock console methods in tests to reduce noise (optional)
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Optionally mock console methods to reduce test output noise
  // Uncomment if you want cleaner test output
  // console.error = jest.fn();
  // console.warn = jest.fn();
});

afterAll(() => {
  // Restore original console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test helpers
global.testHelpers = {
  // Helper to create mock functions with common patterns
  createMockService: (methods: string[]) => {
    const mock = {};
    methods.forEach((method) => {
      mock[method] = jest.fn();
    });
    return mock;
  },

  // Helper to create mock user data
  createMockUser: (overrides: Record<string, any> = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  // Helper to create mock auth data
  createMockAuth: (overrides: Record<string, any> = {}) => ({
    id: 'test-auth-id',
    email: 'test@example.com',
    userId: 'test-user-id',
    emailVerified: true,
    isActive: true,
    failedLoginAttempts: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  // Helper to create mock tokens
  createMockTokens: () => ({
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  }),
};

// Export module to fix TypeScript global augmentation issue
export {};

// Type definitions for global helpers
declare global {
  var testHelpers: {
    createMockService: (methods: string[]) => any;
    createMockUser: (overrides?: any) => any;
    createMockAuth: (overrides?: any) => any;
    createMockTokens: () => { accessToken: string; refreshToken: string };
  };
}
