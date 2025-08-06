import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, RmqOptions } from '@nestjs/microservices';
import { getRedisOptions } from '@p2p-lending/common/config/redis.config';
import { RmqQueue } from '@p2p-lending/common/enums';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';

import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule, {
    logger: new ConsoleLogger('AuthService'),
  });

  const configService = app.get(ConfigService);

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
  const rmqConfig: RmqOptions = getRmqOptions(RmqQueue.AUTH);
  app.connectMicroservice<MicroserviceOptions>(rmqConfig);

  // Connect to Redis
  const redisConfig = getRedisOptions();
  const redisMicroservice =
    app.connectMicroservice<MicroserviceOptions>(redisConfig);

  redisMicroservice.on('connect', () => {
    console.log('🟢 Redis microservice connected successfully');
  });

  redisMicroservice.on('error', (error) => {
    console.error('❌ Redis microservice connection error:', error);
  });

  // Start all microservices
  await app.startAllMicroservices();

  // Get port from configuration
  const port = configService.get<number>('app.PORT') || 3007;
  const appName = configService.get<string>('app.APP_NAME') || 'Auth Service';
  const nodeEnv = configService.get<string>('app.NODE_ENV') || 'development';

  await app.listen(port);

  console.log(`🚀 ${appName} is running on port ${port}`);
  console.log(`🌍 Environment: ${nodeEnv}`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start Auth Service:', error);
  process.exit(1);
});
