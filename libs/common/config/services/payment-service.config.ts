import { RmqExchange } from '../../enums/rbmq.enum';
import { BaseServiceConfig } from '../base.config';
import { ConfigFactory } from '../config.factory';
import { RmqConfig } from '../rmq.config';

export class PaymentServiceConfig extends BaseServiceConfig {}

export const paymentRmqConfig = new RmqConfig({
  exchange: RmqExchange.LOAN,
  exchangeType: 'topic',
  queueOptions: {
    durable: true,
  },
  persistent: true,
});

export const createPaymentServiceConfig = (): PaymentServiceConfig => {
  const config = ConfigFactory.createConfig(PaymentServiceConfig, {
    serviceName: 'payment-service',
    defaultPort: parseInt(process.env.PORT_PAYMENT_SERVICE || '3009', 10),
    enableDatabase: true,
    enableRabbitMQ: true,
    enableRedis: false, // Optional for payment service
  });

  config.rabbitmq = paymentRmqConfig;

  return config;
};
