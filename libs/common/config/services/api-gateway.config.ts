import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { BaseServiceConfig, Environment } from '../base.config';
import { ConfigFactory } from '../config.factory';

export class CorsConfig {
  @IsBoolean()
  @IsOptional()
  enabled?: boolean = true;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  origins?: string[] = ['http://localhost:3000'];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  methods?: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allowedHeaders?: string[] = ['Content-Type', 'Authorization'];

  @IsBoolean()
  @IsOptional()
  credentials?: boolean = true;
}

export class RateLimitConfig {
  @IsBoolean()
  @IsOptional()
  enabled?: boolean = true;

  @IsNumber()
  @IsOptional()
  windowMs?: number = 15 * 60 * 1000; // 15 minutes

  @IsNumber()
  @IsOptional()
  max?: number = 100; // 100 requests per window

  @IsString()
  @IsOptional()
  message?: string = 'Too many requests';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skipIps?: string[] = [];
}

export class SwaggerConfig {
  @IsBoolean()
  @IsOptional()
  enabled?: boolean = true;

  @IsString()
  @IsOptional()
  path?: string = 'api-docs';

  @IsString()
  @IsOptional()
  title?: string = 'P2P Lending API Gateway';

  @IsString()
  @IsOptional()
  description?: string = 'API Gateway for P2P Lending Platform';

  @IsString()
  @IsOptional()
  version?: string = '1.0.0';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[] = ['api-gateway'];
}

export class ApiGatewayConfig extends BaseServiceConfig {
  @IsString()
  @IsOptional()
  globalPrefix?: string = 'api/v1';

  @Type(() => CorsConfig)
  @ValidateNested()
  @IsOptional()
  cors?: CorsConfig;

  @Type(() => RateLimitConfig)
  @ValidateNested()
  @IsOptional()
  rateLimit?: RateLimitConfig;

  @Type(() => SwaggerConfig)
  @ValidateNested()
  @IsOptional()
  swagger?: SwaggerConfig;

  @IsNumber()
  @IsOptional()
  requestTimeoutMs?: number = 30000;

  @IsNumber()
  @IsOptional()
  maxRequestSize?: number = 10;

  @IsBoolean()
  @IsOptional()
  enableCompression?: boolean = true;

  @IsBoolean()
  @IsOptional()
  enableHelmet?: boolean = true;

  @IsString()
  @IsOptional()
  trustedProxies?: string = 'loopback';
}

export const createApiGatewayConfig = (): ApiGatewayConfig => {
  const config = ConfigFactory.createConfig(ApiGatewayConfig, {
    serviceName: 'api-gateway',
    defaultPort: 3005,
    enableJwt: true,
    enableRabbitMQ: true,
  });

  // API Gateway specific configuration
  config.globalPrefix = process.env.GLOBAL_PREFIX || 'api/v1';
  config.requestTimeoutMs = ConfigFactory.parseNumber(
    process.env.REQUEST_TIMEOUT_MS,
    30000,
  );
  config.maxRequestSize = ConfigFactory.parseNumber(
    process.env.MAX_REQUEST_SIZE,
    10,
  );
  config.enableCompression = ConfigFactory.parseBoolean(
    process.env.ENABLE_COMPRESSION,
    true,
  );
  config.enableHelmet = ConfigFactory.parseBoolean(
    process.env.ENABLE_HELMET,
    true,
  );
  config.trustedProxies = process.env.TRUSTED_PROXIES || 'loopback';

  // CORS configuration
  config.cors = {
    enabled: ConfigFactory.parseBoolean(process.env.CORS_ENABLED, true),
    origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: process.env.CORS_METHODS?.split(',') || [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
    ],
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(',') || [
      'Content-Type',
      'Authorization',
    ],
    credentials: ConfigFactory.parseBoolean(process.env.CORS_CREDENTIALS, true),
  };

  // Rate limiting configuration
  config.rateLimit = {
    enabled: ConfigFactory.parseBoolean(process.env.RATE_LIMIT_ENABLED, true),
    windowMs:
      ConfigFactory.parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 15) *
      60 *
      1000,
    max: ConfigFactory.parseNumber(process.env.RATE_LIMIT_MAX, 100),
    message: process.env.RATE_LIMIT_MESSAGE || 'Too many requests',
    skipIps: process.env.RATE_LIMIT_SKIP_IPS?.split(',') || [],
  };

  // Swagger configuration
  config.swagger = {
    enabled: ConfigFactory.parseBoolean(
      process.env.SWAGGER_ENABLED,
      config.environment !== Environment.Production,
    ),
    path: process.env.SWAGGER_PATH || 'api-docs',
    title: process.env.SWAGGER_TITLE || 'P2P Lending API Gateway',
    description:
      process.env.SWAGGER_DESCRIPTION || 'API Gateway for P2P Lending Platform',
    version: process.env.SWAGGER_VERSION || config.version,
    tags: process.env.SWAGGER_TAGS?.split(',') || ['api-gateway'],
  };

  return config;
};
