import { Test, TestingModule } from '@nestjs/testing';
import { KeyTokenService } from '@p2p-lending/user-service/src/key-token/key-token.service';
import { PrismaService } from '@p2p-lending/user-service/src/prisma/prisma.service';

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
