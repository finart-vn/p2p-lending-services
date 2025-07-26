// src/config/rmq.config.ts
import { RmqOptions, Transport } from '@nestjs/microservices';

export const getRmqOptions = (queue: string): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
    queue,
    queueOptions: {
      durable: false,
    },
  },
});
