# API Gateway

The API Gateway serves as the entry point for all client requests in the P2P Lending microservices architecture.

## Structure

### 📁 Common Files Setup

The following common files have been created to provide a structured foundation for implementation:

#### 🔧 Interceptors
- **`interceptors/response.interceptor.ts`** - Standardized API response formatting
- **`interceptors/logging.interceptor.ts`** - Request/response logging

#### 🛡️ Guards  
- **`guards/auth.guard.ts`** - JWT token validation and authentication
- **`guards/roles.guard.ts`** - Role-based authorization

#### 🏷️ Decorators
- **`decorators/roles.decorator.ts`** - Role-based access control decorator

#### 🚨 Filters
- **`filters/http-exception.filter.ts`** - Global exception handling

#### 🔄 Middlewares
- **`middlewares/request-logging.middleware.ts`** - Detailed request logging
- **`middlewares/validation.middleware.ts`** - Request validation

#### 📡 Clients
- **`clients/auth.client.ts`** - Auth service communication
- **`clients/user.client.ts`** - User service communication

#### ⚙️ Configuration
- **`config/app.config.ts`** - Application settings
- **`config/jwt.config.ts`** - JWT configuration
- **`config/microservices.config.ts`** - Microservice connection settings

#### 📋 DTOs
- **`dtos/common.dto.ts`** - Common data transfer objects

#### 📋 Constants
- **`constants/index.ts`** - Application constants and enums

#### 🛠️ Utilities
- **`utils/index.ts`** - Utility functions and helpers

#### 📝 Types
- **`types/express.d.ts`** - TypeScript definitions for Express extensions

## Next Steps

All files are structured with TODO comments indicating where implementation details should be added. The basic framework is in place without touching the implementation bodies as requested.

### Implementation Priorities:

1. **Configure microservice connections** in `config/microservices.config.ts`
2. **Implement JWT validation** in `guards/auth.guard.ts`
3. **Set up response formatting** in `interceptors/response.interceptor.ts`
4. **Configure exception handling** in `filters/http-exception.filter.ts`
5. **Implement microservice clients** in `clients/` directory

### Environment Variables

Make sure to set up the following environment variables:

```env
# Application
PORT=3000
NODE_ENV=development
GLOBAL_PREFIX=api/v1

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_REFRESH_EXPIRES_IN=7d

# Microservices
AUTH_SERVICE_HOST=localhost
AUTH_SERVICE_PORT=3001
USER_SERVICE_HOST=localhost
USER_SERVICE_PORT=3002

# CORS
CORS_ENABLED=true
CORS_ORIGINS=http://localhost:3000

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Swagger
SWAGGER_ENABLED=true
SWAGGER_PATH=api-docs

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE=p2p_lending_queue
```

## Usage

Import common functionality:

```typescript
import {
  ResponseInterceptor,
  AuthGuard,
  RolesGuard,
  HttpExceptionFilter,
  ApiResponseDto,
  API_MESSAGES
} from './index';
``` 