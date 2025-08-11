import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  CreateUserRequest,
  UserResponse,
} from '@p2p-lending/common/interfaces/message-payloads';

import { PrismaService } from './prisma/prisma.service';
import { RolesService } from './roles/roles.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private prisma: PrismaService,
    private rolesService: RolesService,
  ) {}
  async createUser(user: CreateUserRequest): Promise<UserResponse> {
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
        data: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          address: user.address,
          city: user.city,
          country: user.country,
        },
      });

      //3. Assign user role
      const assignedRole = await this.rolesService.assignRole(
        newUser.id,
        user.role,
      );

      this.logger.debug(assignedRole);

      this.logger.log(`User created: ${newUser.email}`);
      return newUser;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
