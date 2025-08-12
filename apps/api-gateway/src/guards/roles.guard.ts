import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '@p2p-lending/user-service/generated/prisma';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { RequestWithUser } from '../interfaces/auth.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    this.logger.debug('requiredRoles:: ', requiredRoles);
    if (!requiredRoles) {
      return true;
    }

    // TODO: Get user from request
    // TODO: Check if user has required roles
    // const request = context.switchToHttp().getRequest();
    // const user = request.user;
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    this.logger.debug('user:: ', user);
    // if (!user) {
    //   throw new ForbiddenException('User not found');
    // }

    // TODO: Implement role checking logic
    return true;
  }
}
