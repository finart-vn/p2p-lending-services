import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthClient } from '../../clients/auth.client';
import { RequestWithUser } from '../../shared/interfaces/auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(private authClient: AuthClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      //1. Extract token from header
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const token = this.extractTokenFromHeader(request);
      this.logger.debug(`Token extracted from header: ${token}`);
      if (!token) {
        throw new UnauthorizedException('Token not found');
      }
      //2. Validate token with auth service
      const result = await this.authClient.validateToken(token);
      if (!result || !result.valid) {
        throw new UnauthorizedException('Invalid token');
      }
      //3. Attach user info to request
      request.user = result.payload;
      this.logger.debug(
        `User authenticated: ${JSON.stringify(result.payload)}`,
      );
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
  private extractTokenFromHeader(request: RequestWithUser): string {
    const authHeader = request.headers.authorization;
    // VALIDATION: Ensure authorization header exists and is a string
    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Token not found');
    }
    // Split "Bearer token" into type and token parts
    const [type, token] = authHeader.split(' ');
    // CLEANING: Remove any quotes and whitespace from token
    // Some clients might send tokens wrapped in quotes
    const cleanToken = token.replace(/['"]+/g, '').trim();
    // VALIDATION: Ensure it's a Bearer token (not Basic auth, etc.)
    if (type !== 'Bearer') {
      throw new UnauthorizedException('Invalid token type');
    }
    return cleanToken;
  }
}
