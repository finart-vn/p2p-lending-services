import { Test, TestingModule } from '@nestjs/testing';
import { KeyTokenController } from './key-token.controller';

describe('KeyTokenController', () => {
  let controller: KeyTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyTokenController],
    }).compile();

    controller = module.get<KeyTokenController>(KeyTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
