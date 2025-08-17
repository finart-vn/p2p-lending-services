// ===== UTILITY TYPES =====

export interface TokenPayload {
  userId: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
  type: 'access' | 'refresh';
}

export interface OtpData {
  code: string;
  expiresAt: Date;
  purpose: string;
  attempts: number;
  isUsed: boolean;
}
