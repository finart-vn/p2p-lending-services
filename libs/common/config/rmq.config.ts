// src/config/rmq.config.ts
import { Injectable } from '@nestjs/common';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { RmqQueue, RmqService } from '@p2p-lending/common/enums';

@Injectable()
export class RmqConfig {
  name: string | symbol;
  options: RmqOptions;
  constructor(name: RmqService, queue: RmqQueue, url: string) {
    this.name = name as string;
    this.options = {
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue,
        queueOptions: {
          durable: false,
        },
      },
    };
  }
}
