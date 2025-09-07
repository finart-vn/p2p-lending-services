import { PrismaService } from '@auth-service/prisma/prisma.service';
import { TokenKeyService } from '@auth-service/token-key/token-key.service';
import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

describe('TokenKeyService', () => {
  let service: TokenKeyService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
    decode: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockPrismaService = {
    userAuth: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenKeyService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TokenKeyService>(TokenKeyService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup default mock returns
    mockConfigService.get.mockImplementation((key: string) => {
      const config = {
        JWT_SECRET: 'test-secret',
        JWT_REFRESH_SECRET: 'test-refresh-secret',
      };
      return config[key as keyof typeof config];
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have jwt service injected', () => {
    expect(jwtService).toBeDefined();
  });

  it('should have config service injected', () => {
    expect(configService).toBeDefined();
  });

  describe('generateTokenKey', () => {
    it('should generate access and refresh tokens and update database', async () => {
      // Arrange
      const userAuthId = 'auth-456';
      const userId = 'user-123';

      mockJwtService.signAsync
        .mockResolvedValueOnce('mock-access-token')
        .mockResolvedValueOnce('mock-refresh-token');

      mockPrismaService.userAuth.update.mockResolvedValue({
        id: userAuthId,
        refreshToken: 'mock-refresh-token',
      });

      // Act
      const result = await service.generateTokenKey(userAuthId, userId);

      // Assert
      expect(result).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });

      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
      expect(mockConfigService.get).toHaveBeenCalledTimes(2);

      expect(mockPrismaService.userAuth.update).toHaveBeenCalledWith({
        where: { id: userAuthId },
        data: {
          refreshToken: 'mock-refresh-token',
          lastSuccessfulLoginAt: expect.any(Date) as Date,
        },
      });
    });
  });

  describe('validateRefreshToken', () => {
    it('should validate refresh token and return new tokens', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const userAuthId = 'auth-456';
      const userId = 'user-123';

      const mockPayload = { tid: userAuthId, sub: userId };
      const mockUserAuth = {
        id: userAuthId,
        userId,
        refreshToken,
        isActive: true,
      };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockPrismaService.userAuth.findUnique.mockResolvedValue(mockUserAuth);
      mockJwtService.signAsync
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');
      mockPrismaService.userAuth.update.mockResolvedValue({});

      // Act
      const result = await service.validateRefreshToken(refreshToken);

      // Assert
      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshToken, {
        secret: 'test-secret',
        algorithms: ['HS256'],
      });
      expect(mockPrismaService.userAuth.findUnique).toHaveBeenCalledWith({
        where: { id: userAuthId },
      });
    });

    it('should throw RpcException when user not found', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const mockPayload = { tid: 'auth-456', sub: 'user-123' };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockPrismaService.userAuth.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.validateRefreshToken(refreshToken)).rejects.toThrow(
        new RpcException({
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });

    it('should throw RpcException when refresh token does not match', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const userAuthId = 'auth-456';
      const mockPayload = { tid: userAuthId, sub: 'user-123' };
      const mockUserAuth = {
        id: userAuthId,
        refreshToken: 'different-refresh-token',
        isActive: true,
      };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockPrismaService.userAuth.findUnique.mockResolvedValue(mockUserAuth);

      // Act & Assert
      await expect(service.validateRefreshToken(refreshToken)).rejects.toThrow(
        RpcException,
      );
    });

    it('should throw RpcException when user is inactive', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const userAuthId = 'auth-456';
      const mockPayload = { tid: userAuthId, sub: 'user-123' };
      const mockUserAuth = {
        id: userAuthId,
        refreshToken,
        isActive: false,
      };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockPrismaService.userAuth.findUnique.mockResolvedValue(mockUserAuth);

      // Act & Assert
      await expect(service.validateRefreshToken(refreshToken)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('revokeToken', () => {
    it('should revoke refresh token successfully', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const userAuthId = 'auth-456';
      const mockPayload = { tid: userAuthId, sub: 'user-123' };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockPrismaService.userAuth.update.mockResolvedValue({});

      // Act
      const result = await service.revokeToken(refreshToken);

      // Assert
      expect(result).toEqual({
        success: true,
        message: 'Token revoked successfully',
      });

      expect(mockPrismaService.userAuth.update).toHaveBeenCalledWith({
        where: { id: userAuthId },
        data: { refreshToken: null },
      });
    });

    it('should throw RpcException when token validation fails', async () => {
      // Arrange
      const refreshToken = 'invalid-refresh-token';
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      // Act & Assert
      await expect(service.revokeToken(refreshToken)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('validateAccessToken', () => {
    it('should validate access token and return payload', async () => {
      // Arrange
      const accessToken = 'valid-access-token';
      const userAuthId = 'auth-456';
      const mockPayload = { tid: userAuthId, sub: 'user-123' };
      const mockUserAuth = { isActive: true };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockPrismaService.userAuth.findUnique.mockResolvedValue(mockUserAuth);

      // Act
      const result = await service.validateAccessToken(accessToken);

      // Assert
      expect(result).toEqual(mockPayload);
      expect(mockPrismaService.userAuth.findUnique).toHaveBeenCalledWith({
        where: { id: userAuthId },
        select: { isActive: true },
      });
    });

    it('should throw RpcException when user is inactive', async () => {
      // Arrange
      const accessToken = 'valid-access-token';
      const userAuthId = 'auth-456';
      const mockPayload = { tid: userAuthId, sub: 'user-123' };
      const mockUserAuth = { isActive: false };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockPrismaService.userAuth.findUnique.mockResolvedValue(mockUserAuth);

      // Act & Assert
      await expect(service.validateAccessToken(accessToken)).rejects.toThrow(
        RpcException,
      );
    });

    it('should throw RpcException when user not found', async () => {
      // Arrange
      const accessToken = 'valid-access-token';
      const userAuthId = 'auth-456';
      const mockPayload = { tid: userAuthId, sub: 'user-123' };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockPrismaService.userAuth.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.validateAccessToken(accessToken)).rejects.toThrow(
        RpcException,
      );
    });
  });
});
