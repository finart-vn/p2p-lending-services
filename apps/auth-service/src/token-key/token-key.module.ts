import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';
import { TokenKeyService } from './token-key.service';

@Module({
  providers: [TokenKeyService, JwtService, PrismaService],
  exports: [TokenKeyService],
})
export class TokenKeyModule {}
