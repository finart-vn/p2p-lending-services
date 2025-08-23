import { HttpException, Logger } from '@nestjs/common';
import { ClientProxy, ClientRMQ } from '@nestjs/microservices';
import { RmqService } from '@p2p-lending/common/enums';
import { BrokerError } from '@p2p-lending/common/interfaces/message-payloads/broker.interface';
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
      await this.ensureConnection(this.client);
      const $response = this.client.send<TResponse>(pattern, data).pipe(
        catchError((error: unknown) => {
          this.logger.error(
            `Error sending message to ${this.serviceName}: ${JSON.stringify(error)}`,
          );
          return throwError(() => error);
        }),
      );

      return await firstValueFrom($response);
    } catch (error: unknown) {
      this.logger.error(
        `${this.serviceName} request failed for pattern ${JSON.stringify(pattern)}: ${JSON.stringify(error)}`,
      );
      throw new HttpException(
        (error as BrokerError).message,
        (error as BrokerError).statusCode,
      );
    }
  }

  protected async emit<TRequest, TResponse>(
    pattern: string,
    data: TRequest,
  ): Promise<TResponse> {
    await this.ensureConnection(this.client);

    const $response = this.client.emit<TResponse>(pattern, data);

    return await firstValueFrom($response);
  }

  /**
   * Ensure client connection
   */
  protected async ensureConnection(
    client: ClientProxy,
    fnCallback?: () => Promise<void> | void,
  ): Promise<void> {
    const rmqClient = client as ClientRMQ;
    const options = rmqClient['options'];
    try {
      await client.connect();
      this.logger.log(
        `Connected to exchange-name: ${options?.exchange || 'DEFAULT'}, queue: ${options?.queue || 'DEFAULT'}`,
      );
      if (fnCallback) {
        await fnCallback();
      }
    } catch (error) {
      this.logger.error(
        `Failed to connect to exchange-name: ${options?.exchange || 'DEFAULT'}, queue: ${options?.queue || 'DEFAULT'}: ${error}`,
      );
      throw error;
    }
  }
}
