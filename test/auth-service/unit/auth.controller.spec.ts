import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@p2p-lending/auth-service/src/auth.controller';
import { AuthService } from '@p2p-lending/auth-service/src/auth.service';
import { TokenKeyService } from '@p2p-lending/auth-service/src/token-key/token-key.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    verifyOtp: jest.fn(),
    validateToken: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
  };

  const mockTokenKeyService = {
    generateTokenKey: jest.fn(),
    validateToken: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: TokenKeyService,
          useValue: mockTokenKeyService,
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should have auth service injected', () => {
    expect(authService).toBeDefined();
  });
});
