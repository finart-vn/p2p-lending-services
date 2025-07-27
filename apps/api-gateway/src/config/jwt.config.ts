export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
  issuer: string;
  audience: string;
}

export const jwtConfig: JwtConfig = {
  // TODO: Configure JWT settings
  secret: process.env.JWT_SECRET || 'your-secret-key-here',
  expiresIn: process.env.JWT_EXPIRES_IN || '15m',

  // Refresh token configuration
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-here',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // JWT claims
  issuer: process.env.JWT_ISSUER || 'p2p-lending-api',
  audience: process.env.JWT_AUDIENCE || 'p2p-lending-client',
};

export const getJwtConfig = (): JwtConfig => jwtConfig;

// TODO: Add JWT utility functions
export class JwtUtils {
  static extractTokenFromHeader(authHeader: string): string | null {
    // TODO: Implement token extraction logic
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  static isTokenExpired(token: string): boolean {
    // TODO: Implement token expiration check
    return false;
  }

  static getTokenPayload(token: string): any {
    // TODO: Implement token payload extraction
    return null;
  }
}
