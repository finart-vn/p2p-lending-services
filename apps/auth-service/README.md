# Auth Service

Authentication microservice for the P2P Lending platform. This service handles JWT token validation, refresh, and user authentication via RabbitMQ message patterns.

## RabbitMQ Message Patterns

The auth service listens for the following message patterns from the API Gateway:

### 🔐 Token Validation
**Pattern:** `auth.validate_token`
**Request:**
```typescript
{
  token: string
}
```
**Response:**
```typescript
{
  valid: boolean;
  userId?: string;
  roles?: string[];
  error?: string;
}
```

### 🔄 Token Refresh
**Pattern:** `auth.refresh_token`
**Request:**
```typescript
{
  refreshToken: string
}
```
**Response:**
```typescript
{
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}
```

### ❌ Token Revocation
**Pattern:** `auth.revoke_token`
**Request:**
```typescript
{
  token: string
}
```
**Response:**
```typescript
{
  success: boolean
}
```

### 👤 User Information
**Pattern:** `auth.get_user_info`
**Request:**
```typescript
{
  userId: string
}
```
**Response:**
```typescript
{
  id: string;
  email: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
} | null
```

### ❤️ Health Check
**Pattern:** `auth.health_check`
**Response:**
```typescript
{
  status: string;
  timestamp: string;
}
```

## Features

- ✅ **JWT Token Validation** - Validates access tokens and extracts user information
- ✅ **Token Refresh** - Generates new token pairs using refresh tokens
- ✅ **Token Revocation** - Marks tokens as invalid (TODO: implement blacklisting)
- ✅ **User Info Retrieval** - Gets user details from the user service
- ✅ **RabbitMQ Integration** - Event-driven communication with API Gateway
- ✅ **Error Handling** - Comprehensive error handling and logging

## Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_PUBLIC_KEY=your-public-key-here  # For RSA keys
JWT_PRIVATE_KEY=your-private-key-here # For RSA keys

# RabbitMQ Configuration (handled by shared config)
RABBITMQ_URL=amqp://localhost:5672
```

## Usage

The service runs as a RabbitMQ microservice and automatically listens for messages on the configured queue. The API Gateway will send authentication requests via RabbitMQ.

## TODO Items

1. **Implement token blacklisting** - Add Redis/Database support for revoked tokens
2. **RSA Key Support** - Switch from HMAC to RSA signatures for enhanced security  
3. **Refresh Token Storage** - Store and validate refresh tokens in database
4. **Rate Limiting** - Add rate limiting for token validation requests
5. **Metrics & Monitoring** - Add Prometheus metrics for token operations
6. **Token Cleanup** - Implement cleanup job for expired tokens

## Architecture

```
API Gateway  →  RabbitMQ  →  Auth Service
                    ↓
               User Service (for user info)
```

The auth service:
1. Receives authentication requests via RabbitMQ
2. Validates JWT tokens using configured secrets
3. Communicates with user service for user information
4. Returns authentication results to the API Gateway

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Run tests
npm run test
```
