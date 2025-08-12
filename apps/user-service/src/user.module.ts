import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {
  CONFIG_TOKENS,
  ConfigModule,
  createUserServiceConfig,
} from '@p2p-lending/common/config';
import { RmqQueue, RmqService } from '@p2p-lending/common/enums';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';

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
    ClientsModule.register([
      {
        name: RmqService.USER,
        ...getRmqOptions(RmqQueue.USER),
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, RolesService],
})
export class AppModule {}
