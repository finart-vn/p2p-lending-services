import { Test, TestingModule } from '@nestjs/testing';
import { KeyTokenService } from '@user-service/key-token/key-token.service';
import { PrismaService } from '@user-service/prisma/prisma.service';

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
