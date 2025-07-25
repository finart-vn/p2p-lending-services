import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { getRmqOptions } from 'config/src/rmq.config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.connectMicroservice<MicroserviceOptions>(getRmqOptions('auth_queue'));
  await app.listen(process.env.port ?? 3005);
}
bootstrap();
