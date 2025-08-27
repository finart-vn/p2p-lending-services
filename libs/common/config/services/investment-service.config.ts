import { IsNumber, IsOptional } from 'class-validator';

import { RmqQueue } from '../../enums/rbmq.enum';
import { BaseServiceConfig } from '../base.config';
import { ConfigFactory } from '../config.factory';
import { RmqConfig } from '../rmq.config';

export class InvestmentServiceConfig extends BaseServiceConfig {
  @IsNumber()
  @IsOptional()
  maxInvestmentAmount?: number = 100000;

  @IsNumber()
  @IsOptional()
  minInvestmentAmount?: number = 100;

  @IsNumber()
  @IsOptional()
  maxInvestmentPercentage?: number = 100;

  @IsNumber()
  @IsOptional()
  minInvestmentPercentage?: number = 1;
}

export const investmentRmqConfig = new RmqConfig({
  queue: RmqQueue.INVESTMENT,
  queueOptions: {
    durable: true,
  },
  persistent: true,
});

export const createInvestmentServiceConfig = (): InvestmentServiceConfig => {
  const config = ConfigFactory.createConfig(InvestmentServiceConfig, {
    serviceName: 'investment-service',
    defaultPort: parseInt(process.env.PORT_INVESTMENT_SERVICE || '3009', 10),
    enableDatabase: true,
    enableRabbitMQ: true,
    enableRedis: false,
  });

  config.rabbitmq = investmentRmqConfig;

  return config;
};
