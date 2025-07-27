// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     // TODO: Implement JWT token validation logic
//     const request = context.switchToHttp().getRequest();
//     const token = this.extractTokenFromHeader(request);

//     if (!token) {
//       throw new UnauthorizedException('Token not found');
//     }

//     // TODO: Validate token with auth service
//     // TODO: Attach user info to request

//     return true;
//   }

//   private extractTokenFromHeader(request: any): string | undefined {
//     // TODO: Implement token extraction logic
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
//   }
// }
