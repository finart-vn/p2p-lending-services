import { Module } from '@nestjs/common';

import { AuthController } from './routes/auth/auth.controller';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [],
})
export class ApiGatewayModule {}
