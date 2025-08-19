import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, RmqOptions } from '@nestjs/microservices';
import { CONFIG_TOKENS, UserServiceConfig } from '@p2p-lending/common/config';
import { RmqQueue } from '@p2p-lending/common/enums';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';

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
    const rmqConfig: RmqOptions = getRmqOptions(RmqQueue.USER);
    app.connectMicroservice<MicroserviceOptions>(rmqConfig);
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
