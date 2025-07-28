import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { UserClient } from './clients/user.client';
import { getMicroserviceConfig } from './config/microservices.config';
import { AuthController } from './routes/auth/auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      getMicroserviceConfig('authService'),
      getMicroserviceConfig('userService'),
    ]),
  ],
  controllers: [AuthController],
  providers: [UserClient],
})
export class ApiGatewayModule {}
