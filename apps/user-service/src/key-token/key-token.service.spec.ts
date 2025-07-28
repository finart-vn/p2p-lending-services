import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { KeyTokenService } from './key-token.service';

// Mock PrismaService
const mockPrismaService = {
  tokenKeys: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

describe('KeyTokenService', () => {
  let service: KeyTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeyTokenService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<KeyTokenService>(KeyTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
