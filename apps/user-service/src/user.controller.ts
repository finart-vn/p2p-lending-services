import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { User } from '../generated/prisma';
import { AppService } from './user.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<User | null> {
    return await this.appService.getHello();
  }

  @MessagePattern('create-user')
  createUser(data: any) {
    console.log('create-user', data);
  }
}
