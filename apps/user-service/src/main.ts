import { NestFactory } from '@nestjs/core';
import { AppModule } from './user.module';
import { MicroserviceOptions, RmqOptions } from '@nestjs/microservices';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';
import { RBMQ_QUEUES } from '@p2p-lending/constants';
async function bootstrap() {
  const rmqConfig: RmqOptions = getRmqOptions(RBMQ_QUEUES.AUTH);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    rmqConfig as MicroserviceOptions,
  );
  await app.listen();
}
bootstrap();
