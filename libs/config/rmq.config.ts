// src/config/rmq.config.ts
import { RmqOptions, Transport } from '@nestjs/microservices';
import { RmqQueue } from '@p2p-lending/common/enums';

export const getRmqOptions = (
  queue: RmqQueue,
  url: string = 'amqp://admin:admin@localhost:5672',
): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: [url],
    queue,
    queueOptions: {
      durable: false,
    },
  },
});
