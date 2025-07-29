import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { RmqQueue, RmqService } from '@p2p-lending/common/enums';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';

import { KeyTokenModule } from './key-token/key-token.module';
import { PrismaService } from './prisma/prisma.service';
import { AppController } from './user.controller';
import { AppService } from './user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: RmqService.USER,
        ...getRmqOptions(RmqQueue.USER),
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    KeyTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
