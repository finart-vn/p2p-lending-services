import { Transport } from '@nestjs/microservices';

export interface MicroserviceConfig {
  transport: Transport;
  options: any;
}

export const microservicesConfig = {
  // TODO: Configure auth service connection
  authService: {
    transport: Transport.TCP,
    options: {
      host: process.env.AUTH_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.AUTH_SERVICE_PORT || '3001'),
    },
  } as MicroserviceConfig,

  // TODO: Configure user service connection
  userService: {
    transport: Transport.TCP,
    options: {
      host: process.env.USER_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.USER_SERVICE_PORT || '3002'),
    },
  } as MicroserviceConfig,

  // TODO: Configure RabbitMQ for event-driven communication
  rabbitmq: {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: process.env.RABBITMQ_QUEUE || 'p2p_lending_queue',
      queueOptions: {
        durable: false,
      },
    },
  } as MicroserviceConfig,

  // TODO: Configure other microservices as needed
  // loanService: { ... },
  // paymentService: { ... },
  // notificationService: { ... },
};

export const getMicroserviceConfig = (
  serviceName: keyof typeof microservicesConfig,
): MicroserviceConfig => {
  return microservicesConfig[serviceName];
};
