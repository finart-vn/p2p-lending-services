import { Global, Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from '@nestjs/config';

import { BaseServiceConfig } from './base.config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env.local',
        '.env',
      ],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {
  /**
   * Creates a configuration module for a specific service
   */
  static forService<T extends BaseServiceConfig>(
    configFactory: () => T,
    configToken = 'SERVICE_CONFIG',
  ) {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: configToken,
          useFactory: configFactory,
        },
      ],
      exports: [configToken],
    };
  }
}
