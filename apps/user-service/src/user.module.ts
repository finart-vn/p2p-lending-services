import { Module } from '@nestjs/common';
import { AppController } from './user.controller';
import { AppService } from './user.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { KeyTokenModule } from './key-token/key-token.module';
import { ClientsModule } from '@nestjs/microservices';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';
import { RmqQueue, RmqService } from '@p2p-lending/common/enums';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: RmqService.AUTH,
        ...getRmqOptions(RmqQueue.AUTH),
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
