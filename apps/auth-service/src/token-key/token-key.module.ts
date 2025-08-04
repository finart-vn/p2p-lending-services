import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { TokenKeyService } from './token-key.service';

@Module({
  imports: [ConfigModule],
  providers: [TokenKeyService, JwtService],
  exports: [TokenKeyService],
})
export class TokenKeyModule {}
