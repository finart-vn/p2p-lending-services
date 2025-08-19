import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { CONFIG_TOKENS } from '@p2p-lending/common/config';
import { LoanServiceConfig } from '@p2p-lending/common/config/services/loan-service.config';

import { LoanServiceModule } from './loan.module';

async function bootstrap() {
  const logger = new ConsoleLogger({
    prefix: 'LoanService',
  });
  const app = await NestFactory.create(LoanServiceModule, {
    logger,
  });

  const config = app.get<LoanServiceConfig>(CONFIG_TOKENS.LOAN_SERVICE);

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
  console.error('❌ Failed to start Loan Service:', error);
  process.exit(1);
});
