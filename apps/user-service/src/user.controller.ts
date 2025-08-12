import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common/constants/message-patterns';
import { CreateUserRequest } from '@p2p-lending/common/interfaces/message-payloads';

import { AppService } from './user.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: MESSAGE_PATTERNS.USER.CREATE })
  createUser(@Payload() user: CreateUserRequest) {
    this.logger.log('context', JSON.stringify(user));
    return this.appService.createUser(user);
  }

  @MessagePattern({ cmd: MESSAGE_PATTERNS.USER.GET_BY_EMAIL })
  getUserByEmail(@Payload() email: string) {
    this.logger.log('context', JSON.stringify(email));
    return this.appService.getUserByEmail(email);
  }
}
