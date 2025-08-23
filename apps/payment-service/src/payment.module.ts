import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RmqService } from '@p2p-lending/common';
import {
  CONFIG_TOKENS,
  ConfigModule,
  createPaymentServiceConfig,
  PaymentServiceConfig,
} from '@p2p-lending/common/config';

import { PaymentServiceController } from './payment.controller';
import { PaymentServiceService } from './payment.service';

@Module({
  imports: [
    ConfigModule.forService(
      createPaymentServiceConfig,
      CONFIG_TOKENS.PAYMENT_SERVICE,
    ),
    ClientsModule.registerAsync([
      {
        name: RmqService.PAYMENT,
        useFactory: (config: PaymentServiceConfig) => {
          if (!config.rabbitmq) {
            throw new Error(
              'RabbitMQ configuration is required for PAYMENT service',
            );
          }
          return config.rabbitmq;
        },
        inject: [CONFIG_TOKENS.PAYMENT_SERVICE],
      },
    ]),
  ],
  controllers: [PaymentServiceController],
  providers: [PaymentServiceService],
})
export class PaymentServiceModule {}
