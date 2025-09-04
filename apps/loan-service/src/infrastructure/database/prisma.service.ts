import { Prisma, PrismaClient } from '@loan-service/prisma';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

    this.$on('error', (error: Prisma.LogEvent) => {
      // Handle specific Prisma error types
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002': {
            // Unique constraint violation
            const field = error.meta?.target;
            throw new Error(
              `Unique constraint failed on field(s): ${String(field)}. This record already exists.`,
            );
          }
          case 'P2025':
            // Record not found
            throw new Error('Record not found');
          case 'P2003':
            // Foreign key constraint violation
            throw new Error('Foreign key constraint violation');
          case 'P2014':
            // Required relation violation
            throw new Error('Required relation violation');
          default:
            throw new Error(`Database operation failed: ${error.message}`);
        }
      }

      if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        throw new Error(`Unknown database error: ${error.message}`);
      }

      if (error instanceof Prisma.PrismaClientRustPanicError) {
        throw new Error(`Database engine panic: ${error.message}`);
      }

      if (error instanceof Prisma.PrismaClientInitializationError) {
        throw new Error(`Database initialization failed: ${error.message}`);
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new Error(`Validation error: ${error.message}`);
      }

      // Generic error fallback
      throw new Error(`Database operation failed`);
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
