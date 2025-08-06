import { registerAs } from '@nestjs/config';
import { RedisOptions, Transport } from '@nestjs/microservices';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RedisConfig {
  @IsString()
  @IsNotEmpty()
  host: string;

  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumber()
  port: number;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumber()
  @IsOptional()
  db?: number;

  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumber()
  @IsOptional()
  retryDelay?: number;

  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumber()
  @IsOptional()
  retryAttempts?: number;

  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumber()
  @IsOptional()
  connectTimeout?: number;

  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumber()
  @IsOptional()
  commandTimeout?: number;
}

export const getRedisConfig = (): RedisConfig => {
  const parseIntSafe = (
    value: string | undefined,
    defaultValue: number,
  ): number => {
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseIntSafe(process.env.REDIS_PORT, 6379),
    password: process.env.REDIS_PASSWORD || 'admin123',
    username: process.env.REDIS_USERNAME,
    db: parseIntSafe(process.env.REDIS_DB, 0),
    retryDelay: parseIntSafe(process.env.REDIS_RETRY_DELAY, 100),
    retryAttempts: parseIntSafe(process.env.REDIS_MAX_RETRIES, 3),
    connectTimeout: parseIntSafe(process.env.REDIS_CONNECT_TIMEOUT, 10000),
    commandTimeout: parseIntSafe(process.env.REDIS_COMMAND_TIMEOUT, 5000),
  };
};

export const getRedisOptions = (): RedisOptions => {
  const config = getRedisConfig();

  return {
    transport: Transport.REDIS,
    options: {
      host: config.host,
      port: config.port,
      password: config.password,
      username: config.username,
      db: config.db,
      retryDelay: config.retryDelay,
      retryAttempts: config.retryAttempts,
      connectTimeout: config.connectTimeout,
      commandTimeout: config.commandTimeout,
      lazyConnect: true,
      keepAlive: 30000,
      //   family: 4, // IPv4
    },
  };
};

export default registerAs('redis', getRedisConfig);
