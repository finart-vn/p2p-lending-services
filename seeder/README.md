# P2P Lending Platform Seeder

This directory contains comprehensive seeding functionality for the P2P lending platform, supporting all microservices: User, Auth, Loan, and Investment services.

## Overview

The seeder provides realistic test data for development and testing purposes, including:

- **Users**: 6 users with different roles (Admin, Borrowers, Lenders, Moderator)
- **Authentication**: User auth records with hashed passwords
- **Loans**: 8 loans with various purposes, statuses, and amounts
- **Investments**: 12 investments across different loans and lenders

## Structure

```
seeder/
├── index.ts                 # Main seeder orchestrator
├── prisma-clients.ts       # Prisma client connections
├── seeders/
│   ├── user-seeder.ts      # User service seeding
│   ├── auth-seeder.ts      # Auth service seeding
│   ├── loan-seeder.ts      # Loan service seeding
│   └── investment-seeder.ts # Investment service seeding
└── README.md               # This file
```

## Prerequisites

1. All databases must be running and accessible
2. Environment variables must be set for database connections:
   - `USER_SERVICE_DATABASE_URL`
   - `AUTH_SERVICE_DATABASE_URL`
   - `LOAN_SERVICE_DATABASE_URL`
   - `INVESTMENT_SERVICE_DATABASE_URL`

## Usage

### Basic Seeding

```bash
# Seed all services
npm run seed

# Or directly with ts-node
ts-node seeder/index.ts
```

### Advanced Options

```bash
# Clear existing data and seed
ts-node seeder/index.ts --clear

# Seed specific services only
ts-node seeder/index.ts --users-only
ts-node seeder/index.ts --auth-only
ts-node seeder/index.ts --loans-only
ts-node seeder/index.ts --investments-only

# Clear and seed specific service
ts-node seeder/index.ts --loans-only --clear
```

### Available Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "seed": "ts-node seeder/index.ts",
    "seed:clear": "ts-node seeder/index.ts --clear",
    "seed:users": "ts-node seeder/index.ts --users-only",
    "seed:auth": "ts-node seeder/index.ts --auth-only",
    "seed:loans": "ts-node seeder/index.ts --loans-only",
    "seed:investments": "ts-node seeder/index.ts --investments-only"
  }
}
```

## Default Test Data

### Users & Authentication

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| admin@p2plending.com | Admin123! | Admin | System administrator |
| john.borrower@example.com | Borrower123! | Borrower | Primary borrower |
| jane.lender@example.com | Lender123! | Lender | Primary lender |
| mike.moderator@example.com | Moderator123! | Moderator | Platform moderator |
| sarah.borrower@example.com | Borrower456! | Borrower | Secondary borrower |
| david.lender@example.com | Lender456! | Lender | Secondary lender |

### Loan Examples

- **Personal Loan**: $15,000 for home renovation (8.5% APR, 36 months)
- **Business Loan**: $25,000 for expansion (7.2% APR, 24 months)
- **Education Loan**: $12,000 for MBA program (9.0% APR, 48 months)
- **Debt Consolidation**: $8,000 to pay off credit cards (6.8% APR, 18 months)
- **Home Improvement**: $35,000 for major renovations (5.5% APR, 60 months)

### Investment Examples

- Active investments in various loan stages
- Completed investments with full returns
- Pending investments awaiting loan approval
- Diversified portfolio across different loan types

## Data Relationships

The seeder creates realistic relationships between entities:

1. **Users** are created with appropriate roles
2. **Authentication** records are linked to users with hashed passwords
3. **Loans** are assigned to borrower users
4. **Investments** are made by lender users in specific loans
5. **Financial calculations** are performed for monthly payments and expected returns

## Development Workflow

1. **Initial Setup**: Run `npm run seed` to populate all services
2. **Service Testing**: Use `--service-only` flags for targeted seeding
3. **Data Reset**: Use `--clear` flag to reset and reseed
4. **Custom Data**: Modify seed data in individual seeder files

## Troubleshooting

### Database Connection Issues

```bash
# Check database health
ts-node -e "
import { healthCheckAllDatabases } from './seeder/prisma-clients';
healthCheckAllDatabases().then(console.log);
"
```

### Common Issues

1. **Environment Variables**: Ensure all database URLs are set
2. **Database Access**: Verify databases are running and accessible
3. **Prisma Clients**: Run `npm run prisma:generate` for all services
4. **Dependencies**: Ensure `bcrypt` and other dependencies are installed

### Error Recovery

If seeding fails partway through:

1. Check the error message for specific service issues
2. Use `--clear` flag to reset data
3. Run individual service seeders to isolate problems
4. Verify database schemas are up to date

## Customization

To add custom seed data:

1. Edit the appropriate seeder file in `seeders/`
2. Modify the data arrays (e.g., `defaultUsers`, `defaultLoans`)
3. Update relationships and calculations as needed
4. Test with `--service-only` flag before full seeding

## Security Notes

- Default passwords are for development only
- Change passwords in production environments
- Consider using environment-specific seed data
- Audit logs are included for security testing
