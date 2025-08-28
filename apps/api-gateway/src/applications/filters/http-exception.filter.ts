import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ApiErrorResponseDto } from '../DTOs/common/common-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseError = exception.getResponse() as
      | string
      | Record<string, unknown>;

    const message = this.extractErrorMessage(responseError);

    const errorResponse: ApiErrorResponseDto = {
      success: false,
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }

  private extractErrorMessage(
    responseError: string | Record<string, unknown>,
  ): string | string[] {
    // If the response is a string, return it directly
    if (typeof responseError === 'string') {
      return responseError;
    }

    // If the response is an object, extract the message property
    if (responseError && typeof responseError === 'object') {
      const { message } = responseError;

      // Handle different message types
      if (typeof message === 'string') {
        return message;
      }

      if (Array.isArray(message)) {
        return message.length > 0 ? message : 'Unknown error occurred';
      }
      // Handle object
      if (message && typeof message === 'object') {
        try {
          return JSON.stringify(message);
        } catch {
          return 'Error occurred (unable to serialize message)';
        }
      }
    }

    // Fallback for cases where no valid message is found
    return 'Unknown error occurred';
  }
}
