import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common/constants/message-patterns';
import { RegisterDto } from '@p2p-lending/common/dto/user/register.dto';

import { AppService } from './user.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: MESSAGE_PATTERNS.USER.CREATE })
  createUser(@Payload() user: RegisterDto, @Ctx() context: RmqContext) {
    this.logger.log('context', JSON.stringify(context));
    // return this.appService.createUser(user);
  }
}
