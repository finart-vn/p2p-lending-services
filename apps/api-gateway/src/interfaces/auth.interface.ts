import { TokenPayloadDto } from '@p2p-lending/common';

export interface RequestWithUser {
  user?: TokenPayloadDto; // The authenticated user's data from JWT payload
  headers: {
    authorization?: string; // The Authorization header containing the Bearer token
    [key: string]: any;
  };
}

export interface IApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
}
