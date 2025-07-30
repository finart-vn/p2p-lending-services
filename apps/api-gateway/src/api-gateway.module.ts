import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitMQBroker } from '@p2p-lending/common/brokers/rmq.broker';
import { RabbitMQConfig } from '@p2p-lending/common/config/rmq.config';
import { RmqQueue } from '@p2p-lending/common/enums';

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
  providers: [
    UserClient,
    {
      provide: RabbitMQBroker,
      useFactory: () => {
        return new RabbitMQBroker(new RabbitMQConfig(RmqQueue.AUTH));
      },
    },
  ],
})
export class ApiGatewayModule {}
