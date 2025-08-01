import { Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@p2p-lending/common/enums';
import { catchError, firstValueFrom, throwError } from 'rxjs';

export interface MessagePattern {
  cmd: string;
  [key: string]: any;
}

export abstract class BaseClient {
  protected readonly logger = new Logger(this.constructor.name);
  protected readonly defaultTimeout = 5000;
  protected readonly defaultRetries = 3;
  constructor(
    protected readonly client: ClientProxy,
    protected readonly serviceName: RmqService,
  ) {}

  protected async send<TRequest, TResponse>(
    pattern: MessagePattern,
    data: TRequest,
    // options?: RmqOptions['options'],
  ): Promise<TResponse> {
    try {
      await this.ensureConnection();
      const $response = this.client.send<TResponse>(pattern, data).pipe(
        catchError((error: unknown) => {
          this.logger.error(
            `Failed to send message to ${this.serviceName}`,
            error,
          );
          return throwError(() => error);
        }),
      );

      return await firstValueFrom($response);
    } catch (error) {
      this.logger.error(
        `${this.serviceName} request failed for pattern ${JSON.stringify(pattern)}: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Ensure client connection
   */
  protected async ensureConnection(): Promise<void> {
    try {
      await this.client.connect();
      this.logger.log(`Connected to ${this.serviceName}`);
    } catch (error) {
      this.logger.error(`Failed to connect to ${this.serviceName}: ${error}`);
      throw error;
    }
  }
}
