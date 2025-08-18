import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, RmqOptions } from '@nestjs/microservices';
import { RmqQueue } from '@p2p-lending/common';
import { CONFIG_TOKENS } from '@p2p-lending/common/config';
import { LoanServiceConfig } from '@p2p-lending/common/config/services/loan-service.config';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';

import { LoanServiceModule } from './loan.module';

async function bootstrap() {
  const app = await NestFactory.create(LoanServiceModule, {
    logger: new ConsoleLogger('LoanService'),
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
    const rmqConfig: RmqOptions = getRmqOptions(RmqQueue.LOAN);
    app.connectMicroservice<MicroserviceOptions>(rmqConfig);
  }

  // Start all microservices
  await app.startAllMicroservices();

  await app.listen(config.port);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start Auth Service:', error);
  process.exit(1);
});
