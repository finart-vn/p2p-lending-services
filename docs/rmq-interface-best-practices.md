# RMQ Interface Best Practices for P2P Lending Services

## Overview

This document outlines the best practices for handling common Request/Response interfaces for RabbitMQ (RMQ) communication between microservices in our P2P lending platform.

## Directory Structure

```
libs/common/
├── constants/
│   └── message-patterns.ts        # Centralized message patterns
├── dto/                          # Data Transfer Objects with validation
│   ├── auth/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── user/
│   │   └── create-user.dto.ts
│   └── key-token/
├── interfaces/
│   └── message-payloads/         # RMQ Request/Response interfaces
│       ├── index.ts              # Common types and exports
│       ├── auth-message-payloads.interface.ts
│       ├── user-message-payloads.interface.ts
│       └── [service]-message-payloads.interface.ts
└── enums/
    └── rbmq.enum.ts             # Service and queue enums
```

## Key Principles

### 1. Separation of Concerns

- **DTOs**: Used for API validation and Swagger documentation
- **Interfaces**: Used for RMQ message typing and internal service communication
- **Message Patterns**: Centralized pattern definitions

### 2. Naming Conventions

#### Request Interfaces
```typescript
// Pattern: [Entity][Action]Request
export interface CreateUserRequest { ... }
export interface UpdateUserRequest { ... }
export interface GetUserByIdRequest { ... }
```

#### Response Interfaces
```typescript
// Pattern: [Entity]Response or [Entity][Action]Response
export interface UserResponse { ... }
export interface UserListResponse { ... }
export interface UserValidationResponse { ... }
```

#### Message Patterns
```typescript
// Pattern: [service].[action]
USER: {
  CREATE: 'user.create',
  GET_BY_ID: 'user.get_by_id',
  UPDATE: 'user.update',
}
```

### 3. Type Safety

#### Generic Message Wrappers
```typescript
export interface MessageRequest<T = any> {
  pattern: string;
  data: T;
  correlationId?: string;
  timestamp?: Date;
  userId?: string;
  traceId?: string;
}

export interface MessageResponse<T = any> {
  success: boolean;
  data?: T;
  error?: StandardError;
  timestamp: Date;
  correlationId?: string;
  traceId?: string;
}
```

#### Usage in Services
```typescript
// In client
await this.send<CreateUserRequest, UserResponse>(
  { cmd: MESSAGE_PATTERNS.USER.CREATE },
  requestData,
);

// In controller
@MessagePattern({ cmd: MESSAGE_PATTERNS.USER.CREATE })
createUser(@Payload() request: CreateUserRequest): Promise<UserResponse> {
  return this.userService.createUser(request);
}
```

## Implementation Examples

### 1. Client Implementation

```typescript
// apps/api-gateway/src/clients/user.client.ts
import {
  CreateUserRequest,
  UserResponse,
  mapRegisterDtoToCreateUserRequest,
} from '@p2p-lending/common/interfaces/message-payloads';

@Injectable()
export class UserClient extends BaseClient {
  async createUser(userData: RegisterDto): Promise<UserResponse> {
    const createUserRequest = mapRegisterDtoToCreateUserRequest(userData);
    
    return await this.send<CreateUserRequest, UserResponse>(
      { cmd: MESSAGE_PATTERNS.USER.CREATE },
      createUserRequest,
    );
  }
}
```

### 2. Controller Implementation

```typescript
// apps/user-service/src/user.controller.ts
import { CreateUserRequest, UserResponse } from '@p2p-lending/common/interfaces/message-payloads';

@Controller()
export class UserController {
  @MessagePattern({ cmd: MESSAGE_PATTERNS.USER.CREATE })
  async createUser(@Payload() request: CreateUserRequest): Promise<UserResponse> {
    return this.userService.createUser(request);
  }
}
```

### 3. Service Implementation

```typescript
// apps/user-service/src/user.service.ts
import { CreateUserRequest, UserResponse } from '@p2p-lending/common/interfaces/message-payloads';

@Injectable()
export class UserService {
  async createUser(request: CreateUserRequest): Promise<UserResponse> {
    // Implementation logic
    const user = await this.prisma.user.create({
      data: request,
    });
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      // ... other fields
    };
  }
}
```

## Error Handling

### Standard Error Interface
```typescript
export interface StandardError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
  timestamp: Date;
  path?: string;
}
```

### Error Response Wrapper
```typescript
export interface MessageResponse<T = any> {
  success: boolean;
  data?: T;
  error?: StandardError;
  timestamp: Date;
  correlationId?: string;
  traceId?: string;
}
```

## Common Patterns

### 1. CRUD Operations
```typescript
// Standard CRUD request/response patterns
export interface CreateEntityRequest { ... }
export interface UpdateEntityRequest { id: string; ... }
export interface GetEntityByIdRequest { id: string; }
export interface DeleteEntityRequest { id: string; }
export interface ListEntityRequest extends PaginationRequest { ... }

export interface EntityResponse { ... }
export interface EntityListResponse extends PaginationResponse<EntityResponse> { ... }
```

### 2. Authentication Operations
```typescript
export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { user: UserInfo; tokens: AuthTokens; }

export interface ValidateTokenRequest { token: string; }
export interface TokenValidationResponse { isValid: boolean; userId?: string; }
```

### 3. Pagination
```typescript
export interface PaginationRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

## Utility Functions

### DTO to Interface Mapping
```typescript
// Helper functions for converting between DTOs and interfaces
export const mapRegisterDtoToCreateUserRequest = (
  registerDto: RegisterDto,
): CreateUserRequest => ({
  email: registerDto.email,
  firstName: registerDto.firstName,
  lastName: registerDto.lastName,
  dateOfBirth: registerDto.dateOfBirth,
  phone: registerDto.phone,
  address: registerDto.address,
  city: registerDto.city,
  country: registerDto.country,
});
```

## Health Check Pattern

```typescript
export interface HealthCheckRequest {
  includeDetails?: boolean;
  timeout?: number;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  service: string;
  timestamp: Date;
  uptime: number;
  version?: string;
  dependencies?: Record<string, DependencyHealth>;
}
```

## Benefits of This Approach

1. **Type Safety**: Strong typing across service boundaries
2. **Consistency**: Standardized patterns for all services
3. **Maintainability**: Centralized interface definitions
4. **Documentation**: Self-documenting APIs with TypeScript
5. **Error Prevention**: Compile-time error checking
6. **Tooling Support**: Better IDE autocomplete and refactoring
7. **Testing**: Easier to mock and test with well-defined interfaces

## Migration Strategy

1. **Phase 1**: Create common interfaces for existing services
2. **Phase 2**: Update clients to use common interfaces
3. **Phase 3**: Update controllers to use common interfaces
4. **Phase 4**: Add validation and error handling
5. **Phase 5**: Implement health checks and monitoring

## Future Considerations

1. **Versioning**: Add version support to message patterns
2. **Schema Validation**: Runtime validation of message payloads
3. **Observability**: Add tracing and correlation IDs
4. **Circuit Breakers**: Add resilience patterns
5. **Message Encryption**: Add security for sensitive data

---

This comprehensive guide provides a solid foundation for implementing robust RMQ communication patterns across your P2P lending microservices architecture.