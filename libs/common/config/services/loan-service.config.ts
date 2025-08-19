import { IsNumber, IsOptional } from 'class-validator';

import { BaseServiceConfig } from '../base.config';
import { ConfigFactory } from '../config.factory';
import { RmqConfig } from '../rmq.config';

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
export const loanRmqConfig = new RmqConfig({
  exchange: 'loan_exchange',
  exchangeType: 'topic',
  queueOptions: {
    durable: true,
  },
  noAck: true,
  persistent: true,
});
export const createLoanServiceConfig = (): LoanServiceConfig => {
  const config = ConfigFactory.createConfig(LoanServiceConfig, {
    serviceName: 'loan-service',
    defaultPort: parseInt(process.env.PORT_LOAN_SERVICE || '3008', 10),
    enableDatabase: true,
    enableRabbitMQ: true,
    enableRedis: false, // Optional for loan service
  });

  config.rabbitmq = loanRmqConfig;

  return config;
};
