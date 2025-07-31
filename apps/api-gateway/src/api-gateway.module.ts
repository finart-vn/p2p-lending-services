import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RmqQueue } from '@p2p-lending/common/enums';
import { RmqService } from '@p2p-lending/common/enums';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';

import { UserClient } from './clients/user.client';
import { AuthController } from './routes/auth/auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      { name: RmqService.AUTH, ...getRmqOptions(RmqQueue.AUTH) },
      { name: RmqService.USER, ...getRmqOptions(RmqQueue.USER) },
    ]),
  ],
  controllers: [AuthController],
  providers: [UserClient],
})
export class ApiGatewayModule {}
