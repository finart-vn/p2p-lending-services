import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { AppService } from './user.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @MessagePattern({
    cmd: 'create_user',
  })
  createUser(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log('create_user', data);
    const message = context.getMessage();
    this.logger.log('message', JSON.stringify(message));
    return {
      message: 'User created successfully',
    };
  }
}
