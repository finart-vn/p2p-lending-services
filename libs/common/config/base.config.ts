import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { RmqConfig } from './rmq.config';

export enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
  Test = 'test',
}

export enum LogLevel {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Verbose = 'verbose',
}

export class DatabaseConfig {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsBoolean()
  @IsOptional()
  enableLogging?: boolean = false;

  @IsNumber()
  @IsOptional()
  connectionTimeout?: number = 10000;

  @IsNumber()
  @IsOptional()
  maxConnections?: number = 10;
}

export class JwtConfig {
  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsString()
  @IsOptional()
  accessTokenExpiresIn?: string = '15m';

  @IsString()
  @IsOptional()
  refreshTokenExpiresIn?: string = '7d';

  @IsString()
  @IsOptional()
  issuer?: string = 'p2p-lending';

  @IsString()
  @IsOptional()
  audience?: string = 'p2p-lending-users';
}

export class RedisConfig {
  @IsString()
  @IsNotEmpty()
  host: string;

  @IsNumber()
  port: number;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsNumber()
  @IsOptional()
  db?: number = 0;

  @IsNumber()
  @IsOptional()
  retryDelay?: number = 100;

  @IsNumber()
  @IsOptional()
  retryAttempts?: number = 3;

  @IsNumber()
  @IsOptional()
  connectTimeout?: number = 10000;

  @IsNumber()
  @IsOptional()
  commandTimeout?: number = 5000;

  @IsBoolean()
  @IsOptional()
  enableOfflineQueue?: boolean = true;
}

export class BaseServiceConfig {
  @IsString()
  @IsNotEmpty()
  serviceName: string;

  @IsNumber()
  port: number;

  @IsEnum(Environment)
  environment: Environment;

  @IsEnum(LogLevel)
  @IsOptional()
  logLevel?: LogLevel = LogLevel.Info;

  @IsString()
  @IsOptional()
  version?: string = '1.0.0';

  @IsBoolean()
  @IsOptional()
  enableCors?: boolean = true;

  @IsBoolean()
  @IsOptional()
  enableSwagger?: boolean = true;

  @Type(() => DatabaseConfig)
  @ValidateNested()
  @IsOptional()
  database?: DatabaseConfig;

  @Type(() => JwtConfig)
  @ValidateNested()
  @IsOptional()
  jwt?: JwtConfig;

  @Type(() => RedisConfig)
  @ValidateNested()
  @IsOptional()
  redis?: RedisConfig;

  @IsOptional()
  rabbitmq?: RmqConfig;
}
