import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RmqService } from '@p2p-lending/common';
import {
  CONFIG_TOKENS,
  ConfigModule,
  createUserServiceConfig,
  UserServiceConfig,
} from '@p2p-lending/common/config';

import { PrismaService } from './prisma/prisma.service';
import { RolesService } from './roles/roles.service';
import { AppController } from './user.controller';
import { AppService } from './user.service';

@Module({
  imports: [
    ConfigModule.forService(
      createUserServiceConfig,
      CONFIG_TOKENS.USER_SERVICE,
    ),
    ClientsModule.registerAsync([
      {
        name: RmqService.USER,
        useFactory: (config: UserServiceConfig) => {
          if (!config.rabbitmq) {
            throw new Error(
              'RabbitMQ configuration is required for USER service',
            );
          }
          return config.rabbitmq;
        },
        inject: [CONFIG_TOKENS.USER_SERVICE],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, RolesService],
})
export class AppModule {}
