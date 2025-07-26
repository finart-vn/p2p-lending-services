import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { RBMQ_QUEUES } from '@p2p-lending/common/enums';
import { MicroserviceOptions } from '@nestjs/microservices';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    getRmqOptions(RBMQ_QUEUES.AUTH),
  );
  await app.listen();
}
bootstrap();
