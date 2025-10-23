# P2P Lending Platform - Developer Quick Reference

## 🚀 Quick Start

### Prerequisites
```bash
# Required software
Node.js 18+
PostgreSQL 14+
MongoDB 5+
Redis 6+
RabbitMQ 3.8+
Docker (optional)
```

### Setup Commands
```bash
# Clone and install
git clone <repository-url>
cd p2p-lending-services
npm install

# Database setup
npm run db:setup
npm run db:migrate
npm run db:seed

# Start all services
npm run start:dev

# Or start individual services
npm run start:dev:api-gateway
npm run start:dev:auth-service
npm run start:dev:user-service
npm run start:dev:loan-service
npm run start:dev:investment-service
npm run start:dev:payment-service
npm run start:dev:notification-service
```

## 📋 Service Endpoints

| Service | Port | Health Check | Swagger Docs |
|---------|------|--------------|--------------|
| API Gateway | 3000 | http://localhost:3000/health | http://localhost:3000/api/docs |
| Auth Service | 3001 | http://localhost:3001/health | http://localhost:3001/api/docs |
| User Service | 3002 | http://localhost:3002/health | http://localhost:3002/api/docs |
| Loan Service | 3003 | http://localhost:3003/health | http://localhost:3003/api/docs |
| Investment Service | 3004 | http://localhost:3004/health | http://localhost:3004/api/docs |
| Payment Service | 3005 | http://localhost:3005/health | http://localhost:3005/api/docs |
| Notification Service | 3006 | http://localhost:3006/health | http://localhost:3006/api/docs |

## 🔧 Development Commands

### Database Operations
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Reset database
npm run db:reset

# Seed database
npm run db:seed

# Open Prisma Studio
npm run prisma:studio
```

### Testing
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run specific service tests
npm run test:auth-service
npm run test:user-service
npm run test:loan-service

# Run e2e tests
npm run test:e2e
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Build all services
npm run build
```

## 📊 Message Patterns Quick Reference

### Auth Service
```typescript
// Patterns
'auth.register'           // User registration
'auth.login'              // User login
'auth.validate_token'     // Token validation
'auth.refresh_token'      // Token refresh
'auth.logout'             // User logout
```

### User Service
```typescript
// Patterns
'user.create'             // Create user profile
'user.get_by_id'          // Get user by ID
'user.update'             // Update user profile
'user.submit_kyc'         // Submit KYC documents
'user.verify_kyc'         // Verify KYC status
'user.get_credit_profile' // Get credit information
```

### Loan Service
```typescript
// Patterns
'loan.create'             // Create loan application
'loan.get_by_id'          // Get loan by ID
'loan.approve'            // Approve loan
'loan.reject'             // Reject loan
'loan.get_marketplace'    // Get marketplace loans
'loan.add_investment'     // Add investment to loan
'loan.update_repayment'   // Update repayment status
```

### Investment Service
```typescript
// Patterns
'investment.create'       // Create investment
'investment.get_by_id'    // Get investment by ID
'investment.get_portfolio' // Get investor portfolio
'investment.cancel'       // Cancel investment
'investment.distribute_returns' // Distribute returns
```

### Payment Service
```typescript
// Patterns
'payment.process'         // Process payment
'payment.hold_funds'      // Hold investor funds
'payment.disburse_loan'   // Disburse loan funds
'payment.process_repayment' // Process loan repayment
'payment.get_history'     // Get payment history
```

### Notification Service
```typescript
// Patterns
'notification.send_email' // Send email notification
'notification.send_sms'   // Send SMS notification
'notification.loan_approved' // Loan approval notification
'notification.payment_due' // Payment due notification
'notification.investment_opportunity' // Investment opportunity
```

## 🗄️ Database Schemas

### Key Tables

#### Users & Auth
```sql
-- Auth Service
auth_users (id, user_id, email, password_hash, is_verified, created_at)
token_keys (id, user_id, token_key, is_revoked, expires_at)

-- User Service  
users (id, email, first_name, last_name, phone, role, kyc_status, created_at)
kyc_documents (id, user_id, document_type, file_path, status, verified_at)
```

#### Loans
```sql
-- Loan Service
loans (id, borrower_id, loan_number, requested_amount, funded_amount, 
       interest_rate, term_months, monthly_payment, purpose, status, 
       credit_score, risk_grade, created_at, updated_at)
```

#### Investments
```sql
-- Investment Service
investments (id, loan_id, investor_id, amount, expected_return, 
             actual_return, status, created_at, updated_at)
portfolios (id, investor_id, total_invested, total_returns, 
            active_investments, created_at, updated_at)
```

#### Payments
```sql
-- Payment Service
payments (id, user_id, amount, payment_method, status, 
          transaction_id, processed_at, created_at)
repayments (id, loan_id, borrower_id, amount, principal_amount, 
            interest_amount, remaining_balance, status, created_at)
```

## 🔐 Authentication Flow

### JWT Token Structure
```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: 'BORROWER' | 'LENDER' | 'ADMIN';
  iat: number;
  exp: number;
}
```

### Authentication Headers
```typescript
// Request headers
Authorization: Bearer <access_token>
Cookie: refreshToken=<refresh_token>; HttpOnly; Secure; SameSite=Strict
```

### Role-Based Access
```typescript
// User roles and permissions
BORROWER: [
  'loan:create', 'loan:read:own', 'loan:update:own',
  'payment:create', 'payment:read:own'
]

LENDER: [
  'investment:create', 'investment:read:own', 'investment:cancel:own',
  'loan:read:marketplace', 'portfolio:read:own'
]

ADMIN: [
  'user:read:all', 'user:update:all', 'user:delete:all',
  'loan:approve', 'loan:reject', 'loan:read:all',
  'kyc:verify', 'kyc:reject', 'system:admin'
]
```

## 📝 Common DTOs

### User Registration
```typescript
interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'BORROWER' | 'LENDER';
}
```

### Loan Application
```typescript
interface CreateLoanDto {
  requestedAmount: number;
  termMonths: number;
  purpose: 'PERSONAL' | 'BUSINESS' | 'EDUCATION' | 'HOME_IMPROVEMENT' | 'DEBT_CONSOLIDATION';
  description?: string;
}
```

### Investment
```typescript
interface CreateInvestmentDto {
  loanId: string;
  amount: number;
  expectedReturn: number;
}
```

## 🚨 Error Handling

### Common HTTP Status Codes
```typescript
200 OK              // Success
201 Created         // Resource created
400 Bad Request     // Validation error
401 Unauthorized    // Invalid token
403 Forbidden       // Insufficient permissions
404 Not Found       // Resource not found
409 Conflict        // Resource already exists
422 Unprocessable   // Business logic error
500 Internal Error  // Server error
```

### RPC Exception Format
```typescript
throw new RpcException({
  message: 'User not found',
  statusCode: HttpStatus.NOT_FOUND,
  error: 'USER_NOT_FOUND'
});
```

## 🔍 Debugging Tips

### Service Health Checks
```bash
# Check all services
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
curl http://localhost:3005/health
curl http://localhost:3006/health
```

### RabbitMQ Management
```bash
# Access RabbitMQ management UI
http://localhost:15672
# Default credentials: guest/guest
```

### Database Connections
```bash
# PostgreSQL
psql -h localhost -p 5432 -U postgres -d p2p_lending

# MongoDB
mongosh mongodb://localhost:27017/p2p_lending

# Redis
redis-cli -h localhost -p 6379
```

### Log Monitoring
```bash
# View service logs
npm run logs:auth-service
npm run logs:user-service
npm run logs:loan-service

# View all logs
npm run logs:all
```

## 📚 Useful Resources

### Documentation
- [Complete Architecture](./bussiness-logic/p2p-lending-platform-architecture.md)
- [Development Overview](./development-overview.md)
- [System Architecture Diagrams](./system-architecture-diagram.md)
- [API Documentation](http://localhost:3000/api/docs)

### External Services
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Development Tools
- [Postman Collection](./postman/)
- [Database Schema](./ERD-diagram/)
- [Environment Variables](./.env.example)

---

*This quick reference guide provides essential information for developers working on the P2P Lending Platform.*
