import { Module } from '@nestjs/common';
import { KeyTokenController } from './key-token.controller';
import { KeyTokenService } from './key-token.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [KeyTokenController],
  providers: [KeyTokenService, PrismaService],
  exports: [KeyTokenService],
})
export class KeyTokenModule {}
