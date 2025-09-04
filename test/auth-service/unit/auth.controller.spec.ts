import { AuthController } from '@auth-service/auth.controller';
import { AuthService } from '@auth-service/auth.service';
import { TokenKeyService } from '@auth-service/token-key/token-key.service';
import { Test, TestingModule } from '@nestjs/testing';

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
