# Test Structure

This directory contains all tests for the P2P Lending Services project, organized by service and test type.

## Directory Structure

```
test/
├── api-gateway/          # API Gateway service tests
│   ├── unit/            # Unit tests for controllers, services, etc.
│   └── integration/     # Integration tests
├── auth-service/        # Authentication service tests
│   ├── unit/           # Unit tests for controllers, services, etc.
│   └── integration/    # Integration tests
├── user-service/       # User service tests
│   ├── unit/          # Unit tests for controllers, services, etc.
│   └── integration/   # Integration tests
├── common/            # Shared test utilities and common tests
├── e2e/              # End-to-end tests across services
├── setup.ts          # Global test setup and helpers
└── README.md         # This file
```

## Test Types

### Unit Tests
- Located in `{service}/unit/` directories
- Test individual components in isolation
- Use mocks for dependencies
- Fast execution

### Integration Tests
- Located in `{service}/integration/` directories
- Test multiple components working together
- May use test databases or external services
- Slower execution but more realistic

### End-to-End Tests
- Located in `e2e/` directory
- Test complete user workflows across services
- Use real services and databases
- Slowest execution but most comprehensive

## Running Tests

### All Tests
```bash
npm run test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage
```bash
npm run test:cov
```

### Specific Service Tests
```bash
# API Gateway tests only
npm run test -- test/api-gateway

# Auth Service tests only
npm run test -- test/auth-service

# User Service tests only
npm run test -- test/user-service
```

### Specific Test Types
```bash
# Unit tests only
npm run test -- test/*/unit

# Integration tests only
npm run test -- test/*/integration

# E2E tests only
npm run test -- test/e2e
```

## Test Helpers

Global test helpers are available in all test files via the `testHelpers` global:

```typescript
// Create mock services
const mockUserService = testHelpers.createMockService(['findById', 'create', 'update']);

// Create mock data
const mockUser = testHelpers.createMockUser({ email: 'custom@email.com' });
const mockAuth = testHelpers.createMockAuth({ userId: 'custom-id' });
const mockTokens = testHelpers.createMockTokens();
```

## Writing Tests

### Naming Conventions
- Test files should end with `.spec.ts`
- Test descriptions should be clear and specific
- Use `describe` blocks to group related tests
- Use `it` blocks for individual test cases

### Example Unit Test Structure
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUnderTest } from '@service/path/to/service';

describe('ServiceUnderTest', () => {
  let service: ServiceUnderTest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceUnderTest,
        {
          provide: 'DEPENDENCY',
          useValue: mockDependency,
        },
      ],
    }).compile();

    service = module.get<ServiceUnderTest>(ServiceUnderTest);
  });

  describe('methodName', () => {
    it('should do something specific', async () => {
      // Arrange
      const input = 'test-input';
      
      // Act
      const result = await service.methodName(input);
      
      // Assert
      expect(result).toBeDefined();
    });
  });
});
```

## Path Aliases

The following path aliases are configured for imports in tests:

- `@p2p-lending/*` → `libs/*`
- `@api-gateway/*` → `apps/api-gateway/src/*`
- `@auth-service/*` → `apps/auth-service/src/*`
- `@user-service/*` → `apps/user-service/src/*`

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Mocking**: Mock external dependencies to ensure fast, reliable tests
3. **Descriptive Names**: Use clear, descriptive test and describe block names
4. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and assertion phases
5. **Single Responsibility**: Each test should verify one specific behavior
6. **Clean Up**: Use `beforeEach`/`afterEach` to set up and clean up test state

## Configuration

Tests are configured in `package.json` with Jest. Key configuration:

- **Test Pattern**: `test/**/*.spec.ts`
- **Setup File**: `test/setup.ts`
- **Timeout**: 10 seconds
- **Environment**: Node.js
- **Coverage**: Collects from `apps/` and `libs/` directories

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure path aliases are correctly configured
2. **Timeout Errors**: Increase timeout for slow operations
3. **Mock Issues**: Verify mocks are properly reset between tests
4. **Database Tests**: Use test databases or in-memory alternatives

### Debug Tests
```bash
npm run test:debug
```

This will start Jest in debug mode, allowing you to attach a debugger.