import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private prisma: PrismaService) {}
  async getHello(): Promise<string> {
    try {
      const user = await this.prisma.user.findMany();

      this.logger.error(user[0].email);
      if (!user) return 'No user found';

      return 'Hello World!';
    } catch (error) {
      console.log(error);
      return 'Error';
    }
  }
}
