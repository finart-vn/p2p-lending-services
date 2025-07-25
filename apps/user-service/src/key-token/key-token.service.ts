import { Injectable, Logger } from '@nestjs/common';
import CreateKeyTokenDto from 'libs/DTOs/key-token/create.key-token.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KeyTokenService {
  private readonly logger = new Logger(KeyTokenService.name);

  constructor(private prisma: PrismaService) {}
  async createKeyToken(keyToken: CreateKeyTokenDto) {}
}
