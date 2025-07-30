// src/config/rmq.config.ts
import { Injectable } from '@nestjs/common';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { RmqQueue } from '@p2p-lending/common/enums';

import { BrokerConfig, BrokerType } from '../interfaces/broker.interface';

@Injectable()
export class RabbitMQConfig implements BrokerConfig {
  type: BrokerType;
  options: RmqOptions;
  constructor(queue: RmqQueue) {
    this.type = BrokerType.RABBITMQ;
    this.options = {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
        queue,
        queueOptions: {
          durable: false,
        },
      },
    };
  }
}
