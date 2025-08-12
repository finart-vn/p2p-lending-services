import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
      this.logger.debug('Creating user:: ', user);
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
      //2. Check if role exists
      const role = await this.prisma.role.findUnique({
        where: { name: user.role },
      });

      if (!role) {
        this.logger.error(`User ${user.email}: ${user.role} not found`);
        throw new BadRequestException('Role not found', {
          cause: {
            role: user.role,
          },
        });
      }
      //3. Create new user and assign role
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

      //4. Assign user role
      const assignedRole = await this.rolesService.assignRole(
        newUser.id,
        role.id,
      );

      this.logger.log(`User created: ${newUser.email}`);
      return {
        ...newUser,
        role: assignedRole.role.name,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<UserResponse | null> {
    try {
      //1. Get user by email
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        return null;
      }
      //2. Get user role
      const userRole = await this.prisma.userRole.findFirst({
        select: { role: { select: { name: true } } },
        where: { userId: user.id },
      });
      if (!userRole) {
        this.logger.error(`User ${user.email} has no role`);
        throw new NotFoundException(`User ${user.email} has no role`);
      }
      return {
        ...user,
        role: userRole.role.name,
      };
    } catch (error) {
      this.logger.error(`Failed to get user by email: ${error}`);
      return null;
    }
  }
}
