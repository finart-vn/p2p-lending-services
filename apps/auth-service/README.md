# Auth Service - Prisma Setup

This service handles authentication and user management for the P2P Lending Platform.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- Environment variables configured

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
# Copy the example file and update with your values
cp .env.example .env
```

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: Token expiration time

### Database Setup

1. Generate Prisma client:

```bash
npx prisma generate
```

2. Create and run migrations:

```bash
npx prisma migrate dev --name init
```

3. Seed the database with default roles:

```bash
npx prisma db seed
```

### Development

1. Start the service:

```bash
npm run start:dev
```

The service will be available at `http://localhost:3005`

## 📊 Database Schema

### Core Models

- **User**: User accounts with authentication data
- **Role**: System roles (ADMIN, BORROWER, LENDER)
- **UserRole**: Many-to-many relationship between users and roles
- **Kyc**: Know Your Customer verification data
- **Document**: Uploaded verification documents

### Key Features

- Role-based access control
- KYC verification system
- Document management
- User status management
- Audit trails

## 🔧 Usage Examples

### Creating a User

```typescript
const user = await authService.createUser({
  email: 'user@example.com',
  passwordHash: 'hashed_password',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
});
```

### Finding a User

```typescript
const user = await authService.findUserByEmail('user@example.com');
```

### Assigning Roles

```typescript
await authService.assignRoleToUser(userId, roleId, adminId);
```

## 🛠️ Available Scripts

- `npm run start:dev` - Start development server
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma db seed` - Seed the database
- `npx prisma generate` - Generate Prisma client

## 🔐 Security

- Passwords are hashed before storage
- JWT tokens for authentication
- Role-based permissions
- Encrypted document storage
- Audit logging for sensitive operations

## 📝 Default Roles

### ADMIN

- Full platform access
- User management
- KYC approval/rejection
- Loan approval/rejection
- Platform configuration

### BORROWER

- Create loan requests
- Update profile
- Submit KYC documents
- Make payments
- View own loans

### LENDER

- View all loans
- Create investments
- View own portfolio
- Submit KYC documents
- View returns and analytics
