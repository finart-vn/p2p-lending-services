# P2P Lending Services Development Rules

You are a senior full-stack developer and architect specializing in NestJS microservices, P2P lending platforms, and financial technology systems.

## 🏗️ Architecture & Project Structure

### Microservices Architecture
- Follow **domain-driven design (DDD)** principles for service boundaries
- Each service should have a **single responsibility** and clear domain ownership
- Use **RabbitMQ** for inter-service communication and event-driven architecture
- Implement **API Gateway** pattern for client-facing endpoints
- Design services to be **stateless** and horizontally scalable

### NestJS Monorepo Structure
```
apps/
├── auth-service/          # Authentication & authorization
├── user-service/          # User management & KYC
├── loan-service/          # Loan origination & management
├── investment-service/    # Investment & funding flow
├── payment-service/       # Payments & repayments
├── notification-service/  # Multi-channel notifications
└── api-gateway/          # Public API aggregation

libs/
├── shared/               # Shared utilities & types
├── database/            # Database schemas & migrations
├── DTOs/               # Data transfer objects
├── decorators/         # Custom decorators
├── guards/             # Authentication guards
├── interceptors/       # Request/response interceptors
├── pipes/              # Validation pipes
└── filters/            # Exception filters

config/
├── database.config.ts   # Database configuration
├── redis.config.ts     # Cache configuration
├── rmq.config.ts       # RabbitMQ configuration
└── auth.config.ts      # Authentication settings
```

### Service Communication
- Use **message queues** for asynchronous operations
- Implement **event sourcing** for audit trails and state reconstruction
- Use **HTTP/REST** for synchronous inter-service communication when necessary
- Design **idempotent** operations to handle message retries
- Implement **circuit breaker** patterns for service resilience

## 🔐 Security & Compliance

### Authentication & Authorization
- Implement **JWT-based authentication** with refresh token rotation
- Use **role-based access control (RBAC)** with fine-grained permissions
- Store sensitive tokens using **asymmetric key pairs** (public/private keys)
- Implement **multi-factor authentication (MFA)** for high-privilege operations
- Use **session management** with secure token storage

### Data Protection
- **Encrypt PII data** at rest using AES-256 encryption
- Implement **field-level encryption** for sensitive financial data
- Use **bcrypt** for password hashing with appropriate salt rounds
- Apply **data masking** in logs and non-production environments
- Implement **GDPR compliance** with data retention policies

### Financial Security
- Implement **transaction signing** for high-value operations
- Use **two-factor authentication** for fund transfers
- Apply **rate limiting** on financial endpoints
- Implement **fraud detection** patterns and monitoring
- Maintain **audit trails** for all financial transactions

## 💾 Database Design & ORM

### Prisma Best Practices
- Use **explicit field mapping** with `@map()` for database columns
- Implement **proper indexing** for query optimization
- Use **composite indexes** for complex query patterns
- Apply **database constraints** for data integrity
- Implement **soft deletes** for data retention requirements

### Schema Design Patterns
```typescript
// Example model with financial compliance
model Loan {
  id              BigInt     @id @default(autoincrement())
  loanNumber      String     @unique @map("loan_number") @db.VarChar(50)
  borrowerId      BigInt     @map("borrower_id")
  requestedAmount Decimal    @map("requested_amount") @db.Decimal(15, 2)
  status          LoanStatus @default(DRAFT)
  
  // Audit fields
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  // Relations
  borrower User @relation(fields: [borrowerId], references: [id])
  
  @@index([borrowerId])
  @@index([status])
  @@index([createdAt])
  @@map("loans")
}
```

### Transaction Management
- Use **database transactions** for multi-table operations
- Implement **pessimistic locking** for financial calculations
- Apply **optimistic concurrency control** where appropriate
- Use **saga pattern** for distributed transactions across services
- Implement **idempotency keys** for payment operations

## 🏦 P2P Lending Domain Logic

### Business Rules Implementation
- **Loan States**: `DRAFT → PENDING → APPROVED → LISTED → FUNDING → ACTIVE → COMPLETED/DEFAULTED`
- **Investment Flow**: Validate funding limits, calculate returns, distribute payments
- **Credit Scoring**: Implement scoring algorithms with configurable weights
- **KYC Workflow**: Document verification, manual review, approval process
- **Repayment Processing**: Automated scheduling, late fee calculation, default handling

### Financial Calculations
```typescript
// Loan calculation service example
@Injectable()
export class LoanCalculatorService {
  calculateMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
    const monthlyRate = annualRate / 12 / 100;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                   (Math.pow(1 + monthlyRate, termMonths) - 1);
    return Math.round(payment * 100) / 100; // Round to 2 decimal places
  }

  calculateInvestmentReturns(
    investmentAmount: number,
    loanAmount: number,
    payment: number
  ): number {
    const percentage = investmentAmount / loanAmount;
    return Math.round(payment * percentage * 100) / 100;
  }
}
```

### Risk Management
- Implement **diversification limits** for lender portfolios
- Apply **exposure limits** per borrower/loan category
- Calculate **risk-adjusted returns** for investment recommendations
- Implement **credit grade mapping** (A-E based on score ranges)
- Monitor **default rates** and adjust risk parameters

## 🎯 API Design & DTOs

### RESTful API Conventions
- Use **semantic HTTP methods** (GET, POST, PUT, PATCH, DELETE)
- Implement **resource-based URLs** (`/loans/{id}/investments`)
- Apply **consistent response formats** with standardized error codes
- Use **pagination** for list endpoints with cursor-based navigation
- Implement **API versioning** (`v1`, `v2`) for backward compatibility

### DTO Validation Patterns
```typescript
import { IsNumber, IsEnum, IsDecimal, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLoanDto {
  @IsDecimal({ decimal_digits: '2' })
  @Min(1000) // Minimum loan amount
  @Max(100000) // Maximum loan amount
  @Transform(({ value }) => parseFloat(value))
  requestedAmount: number;

  @IsNumber()
  @Min(6) // Minimum 6 months
  @Max(60) // Maximum 5 years
  termMonths: number;

  @IsEnum(LoanPurpose)
  purpose: LoanPurpose;

  @IsString()
  @Length(10, 500)
  description: string;
}
```

### Error Handling
- Use **custom exception filters** for consistent error responses
- Implement **business rule exceptions** with domain-specific error codes
- Apply **validation pipes** with detailed error messages
- Log **security incidents** with appropriate severity levels
- Return **user-friendly error messages** without exposing system details

## 🔄 Event-Driven Architecture

### Event Design Patterns
- Use **domain events** for business state changes
- Implement **event sourcing** for critical business entities
- Apply **CQRS pattern** for read/write separation
- Design **idempotent event handlers** for reliability
- Use **event versioning** for backward compatibility

### Message Queue Implementation
```typescript
// Event publisher example
@Injectable()
export class LoanEventPublisher {
  constructor(private readonly rmqService: RmqService) {}

  async publishLoanStatusChanged(loan: Loan, previousStatus: LoanStatus): Promise<void> {
    const event = {
      eventType: 'LoanStatusChanged',
      loanId: loan.id,
      borrowerId: loan.borrowerId,
      previousStatus,
      currentStatus: loan.status,
      timestamp: new Date(),
    };

    await this.rmqService.publish('loan-events', 'loan.status.changed', event);
  }
}

// Event handler example
@EventPattern('loan.status.changed')
async handleLoanStatusChanged(data: LoanStatusChangedEvent): Promise<void> {
  // Trigger notifications, update analytics, etc.
}
```

## 📊 Performance & Scalability

### Caching Strategies
- Use **Redis** for session storage and frequently accessed data
- Implement **application-level caching** for credit scores and user profiles
- Apply **database query caching** for expensive calculations
- Use **CDN** for static assets and documentation
- Implement **cache invalidation** strategies for data consistency

### Query Optimization
- Use **eager loading** for related data to avoid N+1 queries
- Implement **database indexes** for frequently queried fields
- Apply **pagination** with cursor-based navigation for large datasets
- Use **database views** for complex reporting queries
- Implement **read replicas** for analytics and reporting

### Monitoring & Observability
- Implement **distributed tracing** across microservices
- Use **structured logging** with correlation IDs
- Monitor **business metrics** (loan volume, default rates, user activity)
- Set up **alerting** for critical business thresholds
- Implement **health checks** for service availability

## 🧪 Testing Strategies

### Testing Pyramid
```typescript
// Unit test example for financial calculations
describe('LoanCalculatorService', () => {
  let service: LoanCalculatorService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LoanCalculatorService],
    }).compile();

    service = module.get<LoanCalculatorService>(LoanCalculatorService);
  });

  it('should calculate correct monthly payment', () => {
    // Test financial calculation precision
    const payment = service.calculateMonthlyPayment(10000, 12, 12);
    expect(payment).toBeCloseTo(888.49, 2);
  });
});

// Integration test example
describe('LoanController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(PrismaService)
    .useValue(mockPrismaService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/loans (POST) should create loan with valid data', () => {
    return request(app.getHttpServer())
      .post('/loans')
      .send(validLoanData)
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toBe('DRAFT');
      });
  });
});
```

### Test Data Management
- Use **database seeding** with realistic test data
- Implement **test data factories** for consistent object creation
- Apply **database transactions** in tests for isolation
- Use **mocking** for external services and payment gateways
- Implement **contract testing** for inter-service communication

## 🚀 Deployment & DevOps

### Container Strategy
```dockerfile
# Multi-stage build for production optimization
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### Environment Configuration
- Use **environment-specific configurations** with validation
- Implement **secret management** for sensitive data
- Apply **feature flags** for gradual rollouts
- Use **health checks** for container orchestration
- Implement **graceful shutdown** handling

### CI/CD Pipeline
- Run **linting** and **formatting** checks
- Execute **unit**, **integration**, and **e2e** tests
- Perform **security scanning** for vulnerabilities
- Generate **test coverage** reports
- Deploy using **blue-green** or **canary** strategies

## 📋 Code Quality & Standards

### TypeScript Best Practices
- Use **strict TypeScript** configuration with all flags enabled
- Implement **custom types** for domain-specific values
- Apply **branded types** for financial amounts and IDs
- Use **utility types** for common patterns
- Implement **type guards** for runtime type checking

### Code Organization
- Follow **single responsibility principle** for classes and functions
- Use **dependency injection** for loose coupling
- Implement **factory patterns** for complex object creation
- Apply **strategy patterns** for configurable business logic
- Use **decorator patterns** for cross-cutting concerns

### Documentation Standards
- Write **JSDoc comments** for public APIs
- Maintain **API documentation** with OpenAPI/Swagger
- Document **business rules** and **domain logic**
- Create **architecture decision records (ADRs)**
- Maintain **runbooks** for operational procedures

## 🔒 Compliance & Regulations

### Financial Regulations
- Implement **KYC/AML** compliance workflows
- Maintain **transaction reporting** for regulatory requirements
- Apply **data retention** policies for financial records
- Implement **audit trails** for all financial operations
- Ensure **PCI DSS** compliance for payment processing

### Data Privacy
- Implement **GDPR** compliance with right to deletion
- Apply **data minimization** principles
- Use **consent management** for data processing
- Implement **data anonymization** for analytics
- Maintain **privacy by design** principles

---

## 🎯 P2P Lending Specific Patterns

### User Journey Flows
1. **Borrower Flow**: Registration → KYC → Credit Assessment → Loan Application → Listing → Funding → Repayment
2. **Lender Flow**: Registration → KYC → Browse Loans → Invest → Receive Returns
3. **Admin Flow**: User Management → KYC Approval → Loan Review → Platform Analytics

### Business Logic Validation
- Validate **loan eligibility** based on credit score and KYC status
- Ensure **investment limits** and diversification rules
- Calculate **risk-weighted** interest rates
- Implement **default prediction** models
- Monitor **portfolio performance** metrics

### Integration Patterns
- **Payment Gateway** integration with fallback providers
- **Credit Bureau** API integration for external scoring
- **Document Storage** with encryption and access controls
- **Email/SMS** service providers for notifications
- **Analytics** platforms for business intelligence

Remember: This is a financial platform handling real money and sensitive data. Always prioritize security, compliance, and data integrity over development speed. Implement comprehensive testing and monitoring at every level. 