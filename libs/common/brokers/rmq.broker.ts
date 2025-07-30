import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  BrokerConfig,
  IMessageBroker,
  MessageRequest,
  MessageResponse,
} from '../interfaces/broker.interface';
@Injectable()
export class RabbitMQBroker implements IMessageBroker {
  private readonly logger = new Logger(RabbitMQBroker.name);
  private client: ClientProxy;

  constructor(private readonly config: BrokerConfig) {
    this.client = ClientProxyFactory.create(config);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
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
      return true;
    } catch (error) {
      this.logger.error(`Failed to connect to RabbitMQ: ${error}`);
      return false;
    }
  }
}
