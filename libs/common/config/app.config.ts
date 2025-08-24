import { registerAs } from '@nestjs/config';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AppConfig {
  @IsString()
  @IsNotEmpty()
  NODE_ENV: string;

  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumber()
  @IsOptional()
  PORT?: number;

  @IsString()
  @IsNotEmpty()
  APP_NAME: string;

  @IsString()
  @IsOptional()
  APP_VERSION?: string;

  @IsString()
  @IsOptional()
  APP_DESCRIPTION?: string;

  @Transform(({ value }) => value === 'true')
  @IsOptional()
  DEBUG?: boolean;

  @IsString()
  @IsOptional()
  LOG_LEVEL?: string;
}

export default registerAs(
  'app',
  (): AppConfig => ({
    NODE_ENV: process.env.NODE_ENV || 'development',
    APP_NAME: process.env.APP_NAME || 'P2P Lending Service',
    APP_VERSION: process.env.APP_VERSION || '1.0.0',
    APP_DESCRIPTION: process.env.APP_DESCRIPTION || 'P2P Lending Platform API',
    DEBUG: process.env.DEBUG === 'true',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  }),
);
