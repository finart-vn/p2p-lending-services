import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResponseDto } from '../dtos/common.dto';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data: unknown) => {
        // If the response is already formatted, return as is
        if (data instanceof ApiResponseDto) {
          return data;
        }

        // If it's already a standardized response format, return as is
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'timestamp' in data
        ) {
          return data;
        }

        // Otherwise, wrap in standard format
        return new ApiResponseDto(
          data,
          'Request completed successfully',
          request.url,
        );
      }),
    );
  }
}
