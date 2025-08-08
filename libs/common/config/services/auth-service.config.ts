import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

import { BaseServiceConfig } from '../base.config';
import { ConfigFactory } from '../config.factory';

export class AuthServiceConfig extends BaseServiceConfig {
  @IsNumber()
  @IsOptional()
  jwtSecretRotationDays?: number = 30;

  @IsBoolean()
  @IsOptional()
  enableRefreshTokens?: boolean = true;

  @IsNumber()
  @IsOptional()
  maxLoginAttempts?: number = 5;

  @IsNumber()
  @IsOptional()
  lockoutDurationMinutes?: number = 15;

  @IsBoolean()
  @IsOptional()
  enablePasswordReset?: boolean = true;

  @IsNumber()
  @IsOptional()
  passwordResetExpirationHours?: number = 24;

  @IsString()
  @IsOptional()
  encryptionAlgorithm?: string = 'aes-256-gcm';

  @IsBoolean()
  @IsOptional()
  enableTwoFactor?: boolean = false;

  @IsNumber()
  @IsOptional()
  sessionTimeoutMinutes?: number = 30;
}

export const createAuthServiceConfig = (): AuthServiceConfig => {
  const config = ConfigFactory.createConfig(AuthServiceConfig, {
    serviceName: 'auth-service',
    defaultPort: 3007,
    enableDatabase: true,
    enableJwt: true,
    enableRedis: true,
    enableRabbitMQ: true,
  });

  // Auth-specific environment variables
  config.jwtSecretRotationDays = ConfigFactory.parseNumber(
    process.env.JWT_SECRET_ROTATION_DAYS,
    30,
  );
  config.enableRefreshTokens = ConfigFactory.parseBoolean(
    process.env.ENABLE_REFRESH_TOKENS,
    true,
  );
  config.maxLoginAttempts = ConfigFactory.parseNumber(
    process.env.MAX_LOGIN_ATTEMPTS,
    5,
  );
  config.lockoutDurationMinutes = ConfigFactory.parseNumber(
    process.env.LOCKOUT_DURATION_MINUTES,
    15,
  );
  config.enablePasswordReset = ConfigFactory.parseBoolean(
    process.env.ENABLE_PASSWORD_RESET,
    true,
  );
  config.passwordResetExpirationHours = ConfigFactory.parseNumber(
    process.env.PASSWORD_RESET_EXPIRATION_HOURS,
    24,
  );
  config.encryptionAlgorithm =
    process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm';
  config.enableTwoFactor = ConfigFactory.parseBoolean(
    process.env.ENABLE_TWO_FACTOR,
    false,
  );
  config.sessionTimeoutMinutes = ConfigFactory.parseNumber(
    process.env.SESSION_TIMEOUT_MINUTES,
    30,
  );

  return config;
};
