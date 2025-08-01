import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Prisma, PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'error' | 'info' | 'warn'
  >
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  constructor(private configService: ConfigService) {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    });

    // Log queries in development
    this.$on('query', (event: Prisma.QueryEvent) => {
      this.logger.debug(`Query: ${event.query}`);
      this.logger.debug(`Params: ${event.params}`);
      this.logger.debug(`Duration: ${event.duration}ms`);
    });

    this.$on('error', (event: Prisma.LogEvent) => {
      this.logger.error('Prisma error:', event);
    });
  }
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Connected to database');
    } catch (error) {
      this.logger.error('Error connecting to database', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Disconnected from database');
    } catch (error) {
      this.logger.error('Error disconnecting from database', error);
    }
  }
}
