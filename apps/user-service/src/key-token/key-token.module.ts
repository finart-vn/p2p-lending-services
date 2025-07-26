import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { KeyTokenController } from './key-token.controller';
import { KeyTokenService } from './key-token.service';

@Module({
  controllers: [KeyTokenController],
  providers: [KeyTokenService, PrismaService],
  exports: [KeyTokenService],
})
export class KeyTokenModule {}
