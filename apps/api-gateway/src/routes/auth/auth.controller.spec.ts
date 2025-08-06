import { Test, TestingModule } from '@nestjs/testing';

import { AuthClient } from '../../clients/auth.client';
import { UserClient } from '../../clients/user.client';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authClient: AuthClient;
  let userClient: UserClient;

  const mockAuthClient = {
    login: jest.fn(),
    register: jest.fn(),
    verifyOtp: jest.fn(),
    validateToken: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
  };

  const mockUserClient = {
    createUser: jest.fn(),
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthClient,
          useValue: mockAuthClient,
        },
        {
          provide: UserClient,
          useValue: mockUserClient,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authClient = module.get<AuthClient>(AuthClient);
    userClient = module.get<UserClient>(UserClient);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have authClient injected', () => {
    expect(authClient).toBeDefined();
  });

  it('should have userClient injected', () => {
    expect(userClient).toBeDefined();
  });
});
