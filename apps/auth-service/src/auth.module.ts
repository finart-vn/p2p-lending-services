import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import { RmqQueue, RmqService } from '@p2p-lending/common/enums';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'DefaultSecret',
      signOptions: {
        expiresIn: '2h',
      },
    }),
    ClientsModule.register([
      {
        name: RmqService.AUTH,
        ...getRmqOptions(RmqQueue.AUTH),
      },
      {
        name: RmqService.USER,
        ...getRmqOptions(RmqQueue.USER),
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
