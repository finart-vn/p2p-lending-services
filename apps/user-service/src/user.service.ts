import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { KeyTokenService } from './key-token/key-token.service';
import { User } from '../generated/prisma';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private prisma: PrismaService,
    private keyTokenService: KeyTokenService,
  ) {}
  async getHello(): Promise<User | null> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: 'test1@test.com',
          passwordHash: '123456',
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
          dateOfBirth: new Date(),
          address: '123 Main St',
          city: 'New York',
        },
      });
      this.logger.log('User created');
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
