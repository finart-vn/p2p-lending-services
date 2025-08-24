import { RmqQueue } from '@p2p-lending/common/enums';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

import { BaseServiceConfig } from '../base.config';
import { ConfigFactory } from '../config.factory';
import { RmqConfig } from '../rmq.config';

export class UserServiceConfig extends BaseServiceConfig {
  @IsNumber()
  @IsOptional()
  maxProfileImageSize?: number = 5 * 1024 * 1024; // 5MB

  @IsString()
  @IsOptional()
  defaultAvatarUrl?: string = '/assets/default-avatar.png';

  @IsBoolean()
  @IsOptional()
  enableEmailVerification?: boolean = true;

  @IsNumber()
  @IsOptional()
  emailVerificationExpirationHours?: number = 24;

  @IsBoolean()
  @IsOptional()
  enableProfilePictures?: boolean = true;

  @IsString()
  @IsOptional()
  uploadDirectory?: string = './uploads/profiles';

  @IsNumber()
  @IsOptional()
  maxUsernameLength?: number = 50;

  @IsNumber()
  @IsOptional()
  minPasswordLength?: number = 8;

  @IsBoolean()
  @IsOptional()
  requirePasswordComplexity?: boolean = true;

  @IsNumber()
  @IsOptional()
  profileCacheExpirationMinutes?: number = 30;

  @IsBoolean()
  @IsOptional()
  enableUserPreferences?: boolean = true;

  @IsNumber()
  @IsOptional()
  maxBioLength?: number = 500;
}

export const userRmqConfig = new RmqConfig({
  queue: RmqQueue.USER,
  queueOptions: {
    durable: true,
  },
});

export const createUserServiceConfig = (): UserServiceConfig => {
  const config = ConfigFactory.createConfig(UserServiceConfig, {
    serviceName: 'user-service',
    defaultPort: parseInt(process.env.PORT_USER_SERVICE || '3006', 10),
    enableDatabase: true,
    enableRabbitMQ: true,
    enableRedis: false, // Optional for user service
  });
  //
  config.rabbitmq = userRmqConfig;

  // User service specific configuration
  config.maxProfileImageSize = ConfigFactory.parseNumber(
    process.env.MAX_PROFILE_IMAGE_SIZE,
    5 * 1024 * 1024,
  );
  config.defaultAvatarUrl =
    process.env.DEFAULT_AVATAR_URL || '/assets/default-avatar.png';
  config.enableEmailVerification = ConfigFactory.parseBoolean(
    process.env.ENABLE_EMAIL_VERIFICATION,
    true,
  );
  config.emailVerificationExpirationHours = ConfigFactory.parseNumber(
    process.env.EMAIL_VERIFICATION_EXPIRATION_HOURS,
    24,
  );
  config.enableProfilePictures = ConfigFactory.parseBoolean(
    process.env.ENABLE_PROFILE_PICTURES,
    true,
  );
  config.uploadDirectory = process.env.UPLOAD_DIRECTORY || './uploads/profiles';
  config.maxUsernameLength = ConfigFactory.parseNumber(
    process.env.MAX_USERNAME_LENGTH,
    50,
  );
  config.minPasswordLength = ConfigFactory.parseNumber(
    process.env.MIN_PASSWORD_LENGTH,
    8,
  );
  config.requirePasswordComplexity = ConfigFactory.parseBoolean(
    process.env.REQUIRE_PASSWORD_COMPLEXITY,
    true,
  );
  config.profileCacheExpirationMinutes = ConfigFactory.parseNumber(
    process.env.PROFILE_CACHE_EXPIRATION_MINUTES,
    30,
  );
  config.enableUserPreferences = ConfigFactory.parseBoolean(
    process.env.ENABLE_USER_PREFERENCES,
    true,
  );
  config.maxBioLength = ConfigFactory.parseNumber(
    process.env.MAX_BIO_LENGTH,
    500,
  );

  return config;
};
