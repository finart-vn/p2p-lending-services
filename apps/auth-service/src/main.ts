import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, RmqOptions } from '@nestjs/microservices';
import { RmqQueue } from '@p2p-lending/common/enums';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';

import { AuthModule } from './auth.module';
async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.create(AuthModule, {
    logger: new ConsoleLogger({
      prefix: 'auth-service',
    }),
  });
  const rmqConfig: RmqOptions = getRmqOptions(RmqQueue.AUTH);
  app.connectMicroservice<MicroserviceOptions>(rmqConfig);
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT') || 3007);
  console.log(
    `Auth service is running on port ${configService.get('PORT') || 3007}`,
  );
}
bootstrap();
