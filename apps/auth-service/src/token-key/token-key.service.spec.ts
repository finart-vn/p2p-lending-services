import { Test, TestingModule } from '@nestjs/testing';

import { TokenKeyService } from './token-key.service';

describe('TokenKeyService', () => {
  let service: TokenKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenKeyService],
    }).compile();

    service = module.get<TokenKeyService>(TokenKeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
