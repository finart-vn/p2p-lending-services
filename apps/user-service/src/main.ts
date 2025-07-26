import { NestFactory } from '@nestjs/core';
import { AppModule } from './user.module';
import { MicroserviceOptions, RmqOptions } from '@nestjs/microservices';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';
import { RmqQueue } from '@p2p-lending/common/enums';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'user-service',
    }),
  });
  const rmqConfig: RmqOptions = getRmqOptions(RmqQueue.AUTH);
  app.connectMicroservice<MicroserviceOptions>(rmqConfig);
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT') || 3006);
  console.log(
    `User service is running on port ${configService.get('PORT') || 3006}`,
  );
}
bootstrap();
