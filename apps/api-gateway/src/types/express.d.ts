import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        roles: string[];
        // TODO: Add more user properties as needed
      };
      requestId?: string;
      correlationId?: string;
    }
  }
}

export {};
