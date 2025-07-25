import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { KeyTokenService } from './key-token/key-token.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private prisma: PrismaService,
    private keyTokenService: KeyTokenService,
  ) {}
  async getHello(): Promise<string> {
    try {
      const user = await this.prisma.user.findMany();
      await this.keyTokenService.createKeyToken({
        userId: user[0].id,
        publicKey: '123',
        refreshToken: '1232',
      });
      this.logger.error(user[0].email);
      if (!user) return 'No user found';

      return 'Hello World!';
    } catch (error) {
      console.log(error);
      return 'Error';
    }
  }
}
