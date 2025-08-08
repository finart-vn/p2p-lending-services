import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, RmqOptions } from '@nestjs/microservices';
import { AuthServiceConfig, CONFIG_TOKENS } from '@p2p-lending/common/config';
import { getRedisOptions } from '@p2p-lending/common/config/redis.config';
import { RmqQueue } from '@p2p-lending/common/enums';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';

import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule, {
    logger: new ConsoleLogger('AuthService'),
  });

  const config = app.get<AuthServiceConfig>(CONFIG_TOKENS.AUTH_SERVICE);

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
    const rmqConfig: RmqOptions = getRmqOptions(RmqQueue.AUTH);
    app.connectMicroservice<MicroserviceOptions>(rmqConfig);
  }

  // Connect to Redis
  if (config.redis) {
    const redisConfig = getRedisOptions();
    const redisMicroservice =
      app.connectMicroservice<MicroserviceOptions>(redisConfig);

    redisMicroservice.on('connect', () => {
      console.log('🟢 Redis microservice connected successfully');
    });

    redisMicroservice.on('error', (error) => {
      console.error('❌ Redis microservice connection error:', error);
    });
  }

  // Start all microservices
  await app.startAllMicroservices();

  await app.listen(config.port);

  console.log(`🚀 ${config.serviceName} is running on port ${config.port}`);
  console.log(`🌍 Environment: ${config.environment}`);
  console.log(`📊 Log Level: ${config.logLevel}`);

  if (config.jwt) {
    console.log('🔐 JWT authentication enabled');
  }

  if (config.redis) {
    console.log(
      `🗄️  Redis connected: ${config.redis.host}:${config.redis.port}`,
    );
  }
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start Auth Service:', error);
  process.exit(1);
});
