import { IsNumber, IsOptional } from 'class-validator';

import { BaseServiceConfig } from '../base.config';
import { ConfigFactory } from '../config.factory';

export class LoanServiceConfig extends BaseServiceConfig {
  @IsNumber()
  @IsOptional()
  maxLoanAmount?: number = 100000;

  @IsNumber()
  @IsOptional()
  minLoanAmount?: number = 1000;

  @IsNumber()
  @IsOptional()
  maxLoanTermMonths?: number = 36;

  @IsNumber()
  @IsOptional()
  minLoanTermMonths?: number = 6;
}

export const createLoanServiceConfig = (): LoanServiceConfig => {
  const config = ConfigFactory.createConfig(LoanServiceConfig, {
    serviceName: 'loan-service',
    defaultPort: 3008,
    enableDatabase: true,
    enableRabbitMQ: true,
    enableRedis: false, // Optional for loan service
  });
  return config;
};
