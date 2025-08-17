import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

import { BaseServiceConfig, Environment, LogLevel } from './base.config';

export interface ConfigFactoryOptions {
  serviceName: string;
  defaultPort: number;
  enableDatabase?: boolean;
  enableJwt?: boolean;
  enableRedis?: boolean;
  enableRabbitMQ?: boolean;
}

export class ConfigFactory {
  /**
   * Creates and validates configuration for a microservice
   */
  static createConfig<T extends BaseServiceConfig>(
    ConfigClass: new () => T,
    options: ConfigFactoryOptions,
  ): T {
    const config = new ConfigClass();

    // Base service configuration
    config.serviceName = options.serviceName;
    config.port = options.defaultPort;
    config.environment = this.parseEnum(
      Environment,
      process.env.NODE_ENV,
      Environment.Development,
    );
    config.logLevel = this.parseEnum(
      LogLevel,
      process.env.LOG_LEVEL,
      Environment.Development ? LogLevel.Debug : LogLevel.Info,
    );
    config.version = process.env.APP_VERSION || '1.0.0';
    config.enableCors = this.parseBoolean(process.env.ENABLE_CORS, true);
    config.enableSwagger = this.parseBoolean(
      process.env.ENABLE_SWAGGER,
      config.environment !== Environment.Production,
    );

    // Database configuration
    if (options.enableDatabase && process.env.DATABASE_URL) {
      config.database = {
        url: process.env.DATABASE_URL,
        enableLogging: this.parseBoolean(process.env.DB_ENABLE_LOGGING, false),
        connectionTimeout: this.parseNumber(
          process.env.DB_CONNECTION_TIMEOUT,
          10000,
        ),
        maxConnections: this.parseNumber(process.env.DB_MAX_CONNECTIONS, 10),
      };
    }

    // JWT configuration
    if (options.enableJwt && process.env.JWT_SECRET) {
      config.jwt = {
        secret: process.env.JWT_SECRET,
        accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        issuer: process.env.JWT_ISSUER || config.serviceName,
        audience: process.env.JWT_AUDIENCE || 'p2p-lending-users',
      };
    }

    // Redis configuration
    if (options.enableRedis) {
      config.redis = {
        host: process.env.REDIS_HOST || 'localhost',
        port: this.parseNumber(process.env.REDIS_PORT, 6379),
        password: process.env.REDIS_PASSWORD,
        username: process.env.REDIS_USERNAME,
        db: this.parseNumber(process.env.REDIS_DB, 0),
        retryDelay: this.parseNumber(process.env.REDIS_RETRY_DELAY, 100),
        retryAttempts: this.parseNumber(process.env.REDIS_RETRY_ATTEMPTS, 3),
        connectTimeout: this.parseNumber(
          process.env.REDIS_CONNECT_TIMEOUT,
          10000,
        ),
        commandTimeout: this.parseNumber(
          process.env.REDIS_COMMAND_TIMEOUT,
          5000,
        ),
        enableOfflineQueue: this.parseBoolean(
          process.env.REDIS_OFFLINE_QUEUE,
          true,
        ),
      };
    }

    // RabbitMQ configuration
    if (options.enableRabbitMQ) {
      config.rabbitmq = {
        url: process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672',
        heartbeat: this.parseNumber(process.env.RABBITMQ_HEARTBEAT, 60),
        connectionTimeout: this.parseNumber(
          process.env.RABBITMQ_CONNECTION_TIMEOUT,
          10000,
        ),
        durable: this.parseBoolean(process.env.RABBITMQ_DURABLE, true),
        prefetchCount: this.parseNumber(
          process.env.RABBITMQ_PREFETCH_COUNT,
          10,
        ),
      };
    }

    // Transform and validate
    const transformedConfig = plainToClass(ConfigClass, config);
    const errors = validateSync(transformedConfig, {
      forbidNonWhitelisted: true,
      whitelist: true,
    });

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}).join(', '))
        .join('; ');
      throw new Error(`Configuration validation failed: ${errorMessages}`);
    }

    return transformedConfig;
  }

  static parseNumber(value: string | undefined, defaultValue: number): number {
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  static parseBoolean(
    value: string | undefined,
    defaultValue: boolean,
  ): boolean {
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true';
  }

  static parseEnum<T extends Record<string, string>>(
    enumObj: T,
    value: string | undefined,
    defaultValue: T[keyof T],
  ): T[keyof T] {
    if (!value) return defaultValue;
    const enumValues = Object.values(enumObj);
    return enumValues.includes(value as T[keyof T])
      ? (value as T[keyof T])
      : defaultValue;
  }
}
