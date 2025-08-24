import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { CONFIG_TOKENS, UserServiceConfig } from '@p2p-lending/common/config';

import { AppModule } from './user.module';

async function bootstrap() {
  const logger = new ConsoleLogger({
    prefix: 'UserService',
  });
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  const config = app.get<UserServiceConfig>(CONFIG_TOKENS.USER_SERVICE);

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

  if (config.enableEmailVerification) {
    logger.log('📧 Email verification enabled');
  }

  if (config.enableProfilePictures) {
    logger.log(
      `📷 Profile pictures enabled - Upload dir: ${config.uploadDirectory}`,
    );
  }

  if (config.database) {
    logger.log('🗄️  Database connection configured');
  }
}
void bootstrap();
