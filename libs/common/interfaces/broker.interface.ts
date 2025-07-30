import { RmqOptions } from '@nestjs/microservices';

export interface MessageRequest<T = any> {
  pattern: string;
  data: T;
  options?: MessageOptions;
}
export interface MessageResponse<T = any> {
  data: T;
  error?: string;
  correlationId?: string;
}
export interface MessageOptions {
  timeout?: number;
  correlationId?: string;
  replyTo?: string;
  headers?: Record<string, any>;
  retries?: number;
}

export interface IMessageBroker {
  // Request-Response Pattern
  send<TRequest, TResponse>(
    request: MessageRequest<TRequest>,
    queue?: string,
  ): Promise<MessageResponse<TResponse>>;

  //   // Publish-Subscribe Pattern
  //   emit<T>(pattern: string, data: T, options?: MessageOptions): Promise<void>;

  //   // Event Streaming (for Kafka-like brokers)
  //   publish<T>(topic: string, data: T, options?: MessageOptions): Promise<void>;

  // Connection Management
  connect(): Promise<void>;
  //   disconnect(): Promise<void>;
  //   isConnected(): boolean;

  // Health Check
  healthCheck(): Promise<boolean>;
}

export enum BrokerType {
  RABBITMQ = 'rabbitmq',
}

export interface BrokerConfig {
  type: BrokerType;
  options: RmqOptions;
}
