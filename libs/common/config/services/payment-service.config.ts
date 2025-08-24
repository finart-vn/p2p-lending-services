import { RmqExchange, RmqQueue } from '@p2p-lending/common/enums';

import { BaseServiceConfig } from '../base.config';
import { ConfigFactory } from '../config.factory';
import { RmqConfig } from '../rmq.config';

export class PaymentServiceConfig extends BaseServiceConfig {}

export const paymentRmqConfig = new RmqConfig({
  exchange: RmqExchange.LOAN,
  exchangeType: 'topic',
  queue: RmqQueue.PAYMENT,
  queueOptions: {
    durable: true,
  },
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
