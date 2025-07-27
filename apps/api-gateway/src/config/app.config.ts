export interface AppConfig {
  port: number;
  globalPrefix: string;
  corsEnabled: boolean;
  corsOrigins: string[];
  rateLimitEnabled: boolean;
  rateLimitWindowMs: number;
  rateLimitMax: number;
  swaggerEnabled: boolean;
  swaggerPath: string;
  logLevel: string;
  environment: string;
}

export const appConfig: AppConfig = {
  // TODO: Configure application settings
  port: parseInt(process.env.PORT || '3000'),
  globalPrefix: process.env.GLOBAL_PREFIX || 'api/v1',

  // CORS configuration
  corsEnabled: process.env.CORS_ENABLED === 'true' || true,
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3000',
  ],

  // Rate limiting
  rateLimitEnabled: process.env.RATE_LIMIT_ENABLED === 'true' || true,
  rateLimitWindowMs:
    parseInt(process.env.RATE_LIMIT_WINDOW_MS || '15') * 60 * 1000, // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100'), // 100 requests per window

  // Swagger documentation
  swaggerEnabled: process.env.SWAGGER_ENABLED === 'true' || true,
  swaggerPath: process.env.SWAGGER_PATH || 'api-docs',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',
  environment: process.env.NODE_ENV || 'development',
};

export const getAppConfig = (): AppConfig => appConfig;
