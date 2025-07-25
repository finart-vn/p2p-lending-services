import { Injectable } from '@nestjs/common';
import CreateKeyTokenDto from 'libs/DTOs/key-token/create.key-token.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KeyTokenService {
  constructor(private prisma: PrismaService) {}
  async createKeyToken(keyToken: CreateKeyTokenDto) {
    const createdKeyToken = await this.prisma.tokenKey.create({
      data: {
        userId: keyToken.userId,
        publicKey: keyToken.publicKey,
        refreshToken: keyToken.refreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });

    return createdKeyToken;
  }
}
