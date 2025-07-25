import { NestFactory } from '@nestjs/core';
import { AppModule } from './user.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { getRmqOptions } from 'config/src/rmq.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(getRmqOptions('auth_queue'));
  await app.listen(process.env.PORT ?? 3006);
}
bootstrap();
