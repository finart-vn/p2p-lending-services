# Investment Service

The Investment Service is a microservice responsible for managing investment operations in the P2P lending platform. It handles investment creation, updates, portfolio management, and return calculations.

## Features

- **Investment Management**: Create, update, and cancel investments
- **Portfolio Tracking**: Monitor user investment portfolios
- **Return Calculations**: Calculate investment returns and annualized yields
- **Status Management**: Track investment statuses (Pending, Active, Completed, Defaulted, Cancelled)
- **RabbitMQ Integration**: Asynchronous communication with other services

## Architecture

- **Framework**: NestJS with microservices architecture
- **Database**: PostgreSQL with Prisma ORM
- **Message Queue**: RabbitMQ for inter-service communication
- **Port**: 3009 (configurable via environment variables)

## Database Schema

### Investment Model
```prisma
model Investment {
  id             String           @id @default(uuid())
  lenderId       String           @map("lender_id")
  loanId         String           @map("loan_id")
  amount         Decimal          @map("amount") @db.Decimal(15, 2)
  percentage     Decimal          @map("percentage") @db.Decimal(5, 2)
  expectedReturn Decimal          @map("expected_return") @db.Decimal(15, 2)
  totalReceived  Decimal          @map("total_received") @db.Decimal(15, 2)
  status         InvestmentStatus @default(PENDING)
  investedAt     DateTime         @default(now()) @map("invested_at")
  completedAt    DateTime?        @map("completed_at")

  @@index([loanId])
  @@index([lenderId])
  @@index([status])
  @@index([investedAt])
  @@index([completedAt])
  @@map("investments")
}
```

### Investment Status Enum
```prisma
enum InvestmentStatus {
  PENDING
  ACTIVE
  COMPLETED
  DEFAULTED
  CANCELLED
}
```

## API Endpoints

The service exposes the following message patterns via RabbitMQ:

- `investment.create` - Create a new investment
- `investment.get_by_id` - Get investment by ID
- `investment.get_by_user` - Get investments by user (lender)
- `investment.get_by_loan` - Get investments by loan
- `investment.update` - Update investment details
- `investment.cancel` - Cancel an investment
- `investment.get_portfolio` - Get user investment portfolio
- `investment.calculate_returns` - Calculate investment returns
- `investment.get_all` - Get all investments
- `investment.delete` - Delete an investment

## Environment Variables

```bash
# Service Configuration
PORT_INVESTMENT_SERVICE=3009

# Database
INVESTMENT_SERVICE_DATABASE_URL=postgresql://user:password@localhost:5432/pl_investment_db

# RabbitMQ
RABBITMQ_URL=amqp://admin:admin@localhost:5672
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   # Update the .env file with your database and RabbitMQ credentials
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run prisma:investment:generate
   
   # Run database migrations
   npm run prisma:investment:migrate
   
   # Or push schema changes directly
   npm run prisma:investment:push
   ```

4. **Start the Service**
   ```bash
   # Development mode
   npm run start:dev:investment-service
   
   # Production build
   npm run build
   npm run start:prod
   ```

## Development

### Prisma Commands
- `npm run prisma:investment:generate` - Generate Prisma client
- `npm run prisma:investment:migrate` - Run database migrations
- `npm run prisma:investment:studio` - Open Prisma Studio
- `npm run prisma:investment:push` - Push schema changes to database

### Testing
```bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Dependencies

- **@nestjs/common** - NestJS core functionality
- **@nestjs/microservices** - Microservices support
- **@nestjs/config** - Configuration management
- **@prisma/client** - Database ORM
- **amqplib** - RabbitMQ client
- **class-validator** - Input validation
- **class-transformer** - Object transformation

## Related Services

- **Loan Service** - Manages loan information
- **User Service** - Handles user profiles and authentication
- **Payment Service** - Processes financial transactions
- **API Gateway** - Routes requests to appropriate services

## Contributing

1. Follow the established code style and patterns
2. Add tests for new functionality
3. Update documentation as needed
4. Ensure all tests pass before submitting changes

## License

This project is part of the P2P Lending Platform and follows the same licensing terms.
