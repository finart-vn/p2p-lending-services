import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // TODO: Implement detailed request logging logic
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const timestamp = new Date().toISOString();

    // TODO: Add request body logging if needed
    // TODO: Add correlation ID
    // TODO: Add user identification if available

    this.logger.log(
      `${method} ${originalUrl} - ${ip} - ${userAgent} - ${timestamp}`,
    );

    res.on('finish', () => {
      // TODO: Log response details
      const { statusCode } = res;
      this.logger.log(`${method} ${originalUrl} - ${statusCode} - ${ip}`);
    });

    next();
  }
}
