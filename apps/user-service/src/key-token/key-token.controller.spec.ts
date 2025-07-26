import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { KeyTokenController } from './key-token.controller';
import { KeyTokenService } from './key-token.service';

describe('KeyTokenController', () => {
  let controller: KeyTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyTokenController],
      providers: [KeyTokenService, PrismaService],
    }).compile();

    controller = module.get<KeyTokenController>(KeyTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
