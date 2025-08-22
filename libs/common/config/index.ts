// Base configuration
export * from './base.config';
export * from './config.factory';
export * from './config.module';

// Service-specific configurations
export * from './services/api-gateway.config';
export * from './services/auth-service.config';
export * from './services/payment-service.config';
export * from './services/user-service.config';

// Legacy configurations (for backward compatibility)
export { default as appConfig } from './app.config';
export {
  getRedisConfig,
  getRedisOptions,
  default as redisConfig,
} from './redis.config';

// Configuration tokens
export const CONFIG_TOKENS = {
  AUTH_SERVICE: 'AUTH_SERVICE_CONFIG',
  API_GATEWAY: 'API_GATEWAY_CONFIG',
  USER_SERVICE: 'USER_SERVICE_CONFIG',
  LOAN_SERVICE: 'LOAN_SERVICE_CONFIG',
  PAYMENT_SERVICE: 'PAYMENT_SERVICE_CONFIG',
} as const;
