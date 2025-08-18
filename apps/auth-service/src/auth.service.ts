import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RmqService } from '@p2p-lending/common/enums';
import {
  LoginRequest,
  RegisterRequest,
} from '@p2p-lending/common/interfaces/message-payloads';
import * as bcrypt from 'bcrypt';

import { UserAuth } from '../generated/prisma';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @Inject(RmqService.USER) private readonly userClient: ClientProxy,
    private readonly prismaService: PrismaService,
  ) {}

  async register(user: RegisterRequest): Promise<UserAuth> {
    try {
      // 1. check if user already exists
      const userExists = await this.prismaService.userAuth.findUnique({
        where: {
          email: user.email,
        },
      });
      if (userExists) {
        throw new RpcException({
          message: 'User already exists',
          statusCode: HttpStatus.CONFLICT,
        });
      }

      // 2. generate password salt and hash
      const passwordHash = bcrypt.hashSync(user.password, 10);

      // 3. create user auth
      const userAuthCreated = await this.prismaService.userAuth.create({
        data: {
          userId: user.userId,
          email: user.email,
          passwordHash,
        },
      });

      return userAuthCreated;
    } catch (error) {
      this.logger.log('Error creating auth token for user:: ', error);
      throw error;
    }
  }

  async login(user: LoginRequest) {
    try {
      // 1. check if user exists
      const userAuthExists = await this.prismaService.userAuth.findUnique({
        where: {
          email: user.email,
        },
      });

      if (!userAuthExists) {
        throw new RpcException({
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      // 2. validate password
      const isMatch = bcrypt.compareSync(
        user.password,
        userAuthExists.passwordHash,
      );
      if (!isMatch) {
        throw new RpcException({
          message: 'Invalid email or password!',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      return userAuthExists;
    } catch (error) {
      this.logger.log('Error logging in user:: ', error);
      throw error;
    }
  }
}
