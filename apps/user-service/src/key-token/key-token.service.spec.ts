import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { KeyTokenService } from './key-token.service';

describe('KeyTokenService', () => {
  let service: KeyTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyTokenService, PrismaService],
    }).compile();

    service = module.get<KeyTokenService>(KeyTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
