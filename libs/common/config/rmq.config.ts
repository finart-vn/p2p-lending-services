// src/config/rmq.config.ts
import { Injectable } from '@nestjs/common';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { RmqService } from '@p2p-lending/common/enums';
import { RmqQueue } from '@p2p-lending/common/enums';

@Injectable()
export class RmqConfig {
  name: string | symbol;
  options: RmqOptions;
  constructor(queue: RmqQueue) {
    this.name = RmqService.USER as string;
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
