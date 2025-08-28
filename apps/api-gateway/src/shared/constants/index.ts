// API Response Messages
export const API_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  BAD_REQUEST: 'Invalid request data',
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Headers
export const HEADERS = {
  AUTHORIZATION: 'authorization',
  CONTENT_TYPE: 'content-type',
  USER_AGENT: 'user-agent',
  X_REQUEST_ID: 'x-request-id',
  X_CORRELATION_ID: 'x-correlation-id',
} as const;

// Microservice Patterns
export const MESSAGE_PATTERNS = {
  // Auth Service
  AUTH: {
    VALIDATE_TOKEN: 'auth.validate_token',
    REFRESH_TOKEN: 'auth.refresh_token',
    REVOKE_TOKEN: 'auth.revoke_token',
  },

  // User Service
  USER: {
    CREATE: 'user.create',
    GET_BY_ID: 'user.get_by_id',
    GET_BY_EMAIL: 'user.get_by_email',
    UPDATE: 'user.update',
    DELETE: 'user.delete',
    LIST: 'user.list',
  },

  // TODO: Add patterns for other services
  // LOAN: { ... },
  // PAYMENT: { ... },
  // NOTIFICATION: { ... },
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  BORROWER: 'borrower',
  LENDER: 'lender',
  MODERATOR: 'moderator',
} as const;

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  USER_PERMISSIONS: (userId: string) => `user:permissions:${userId}`,
  TOKEN_BLACKLIST: (tokenId: string) => `token:blacklist:${tokenId}`,
} as const;

// Cache TTL (in seconds)
export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  GLOBAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // requests per window
  },
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // login attempts per window
  },
  API: {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // requests per minute
  },
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
  },
  EMAIL: {
    MAX_LENGTH: 254,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
} as const;
