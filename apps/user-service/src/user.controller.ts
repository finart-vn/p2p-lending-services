import { Controller, Get } from '@nestjs/common';
import { AppService } from './user.service';
import { User } from '../generated/prisma';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<User | null> {
    return await this.appService.getHello();
  }
}
