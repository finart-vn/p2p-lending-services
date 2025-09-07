import { Test, TestingModule } from '@nestjs/testing';
import { KeyTokenController } from '@user-service/key-token/key-token.controller';
import { KeyTokenService } from '@user-service/key-token/key-token.service';

// Mock KeyTokenService
const mockKeyTokenService = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('KeyTokenController', () => {
  let controller: KeyTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyTokenController],
      providers: [
        {
          provide: KeyTokenService,
          useValue: mockKeyTokenService,
        },
      ],
    }).compile();

    controller = module.get<KeyTokenController>(KeyTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
