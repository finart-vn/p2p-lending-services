// src/config/rmq.config.ts
import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class RmqConfig implements RmqOptions {
  transport: Transport.RMQ = Transport.RMQ;
  options: RmqOptions['options'] = {};

  constructor(options: RmqOptions['options']) {
    this.options = {
      ...options,
      urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
    };
  }

  getClientProxy(): ClientProxy {
    return ClientProxyFactory.create({
      options: this.options,
    });
  }
}
