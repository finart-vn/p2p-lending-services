import { NestFactory } from '@nestjs/core';

import { LoanServiceModule } from './loan-service.module';

async function bootstrap() {
  const app = await NestFactory.create(LoanServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
