import { Test, TestingModule } from '@nestjs/testing';

import { AuthRouteService } from './auth.route';

describe('AuthRouteService', () => {
  let service: AuthRouteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthRouteService],
    }).compile();

    service = module.get<AuthRouteService>(AuthRouteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
