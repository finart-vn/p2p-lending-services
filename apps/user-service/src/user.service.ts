import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RegisterDto } from '@p2p-lending/common/dto/user/register.dto';

import { User } from '../generated/prisma';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private prisma: PrismaService) {}
  async createUser(user: RegisterDto): Promise<User | null> {
    try {
      // 1. Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
      if (existingUser)
        throw new BadRequestException('User already exists', {
          cause: {
            email: user.email,
          },
        });

      // 2. Create new user
      const newUser = await this.prisma.user.create({
        data: user,
      });
      this.logger.log(`User created: ${newUser.email}`);
      return newUser;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
