import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { RmqConfig } from '../config/rmq.config';
import {
  IMessageBroker,
  MessageRequest,
  MessageResponse,
} from '../interfaces/message-payloads/broker.interface';
@Injectable()
export class RabbitMQBroker implements IMessageBroker {
  private readonly logger = new Logger(RabbitMQBroker.name);
  private client: ClientProxy;

  constructor(private readonly config: RmqConfig) {
    this.client = this.config.getClientProxy();
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.logger.log(
        `Connected to RabbitMQ ${JSON.stringify(this.config.options)}`,
      );
    } catch (error) {
      this.logger.error(`Failed to connect to RabbitMQ: ${error}`);
      throw error;
    }
  }

  async send<TRequest, TResponse>(
    request: MessageRequest<TRequest>,
  ): Promise<MessageResponse<TResponse>> {
    try {
      const response = await firstValueFrom(
        this.client.send<TResponse>(request.pattern, request.data),
      );
      return {
        data: response,
      };
    } catch (error) {
      this.logger.error(`Failed to send message to RabbitMQ: ${error}`);
      throw error;
    }
  }
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.connect();
      this.logger.log(
        `Connected to RabbitMQ ${JSON.stringify(this.config.transport)}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to connect ${JSON.stringify(this.config)} to RabbitMQ: ${error}`,
      );
      return false;
    }
  }
}
