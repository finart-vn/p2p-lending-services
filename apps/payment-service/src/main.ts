import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { CONFIG_TOKENS } from '@p2p-lending/common/config';
import { PaymentServiceConfig } from '@p2p-lending/common/config/services/payment-service.config';

import { PaymentServiceModule } from './payment-service.module';

async function bootstrap() {
  const logger = new ConsoleLogger({
    prefix: 'PaymentService',
  });
  const app = await NestFactory.create(PaymentServiceModule, {
    logger,
  });

  const config = app.get<PaymentServiceConfig>(CONFIG_TOKENS.PAYMENT_SERVICE);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Connect to RabbitMQ
  if (config.rabbitmq) {
    logger.debug(config.rabbitmq);
    app.connectMicroservice<MicroserviceOptions>(config.rabbitmq);
    logger.log(
      `🔗 Connected to RabbitMQ, exchange: ${JSON.stringify(
        config.rabbitmq.options?.exchange || 'DEFAULT',
      )} - queue: ${config.rabbitmq.options?.queue} - queue_options: ${JSON.stringify(
        config.rabbitmq.options?.queueOptions,
      )}`,
    );
  }

  // Start all microservices
  await app.startAllMicroservices();

  await app.listen(config.port);

  logger.log(`🚀 ${config.serviceName} is running on port ${config.port}`);
  logger.log(`🌍 Environment: ${config.environment}`);
  logger.log(`📊 Log Level: ${config.logLevel}`);

  if (config.database) {
    logger.log(`🗄️  Database connection configured`);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start Payment Service:', error);
  process.exit(1);
});
