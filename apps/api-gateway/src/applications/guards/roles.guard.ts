import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '@user-service/prisma';

import { UserClient } from '../../clients/user.client';
import { RequestWithUser } from '../../shared/interfaces/auth.interface';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  constructor(
    private reflector: Reflector,
    private userClient: UserClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    this.logger.log(`Checking roles for user:: ${user?.sub}`);

    if (!user) {
      throw new ForbiddenException('User not found');
    }
    const userExisted = await this.userClient.getUserById(user?.sub);

    this.logger.debug(`User existed: ${JSON.stringify(userExisted)}`);

    if (!userExisted) {
      throw new ForbiddenException('User not found');
    }

    if (!userExisted.role) {
      throw new ForbiddenException('User has no role');
    }
    return requiredRoles.includes(userExisted.role);
  }
}
