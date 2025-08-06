// Export all message payload interfaces
export * from './auth';
export * from './user';

// Common message wrapper types
export interface MessageRequest<T = any> {
  pattern: string;
  data: T;
  correlationId?: string;
  timestamp?: Date;
  userId?: string;
  traceId?: string;
}

export interface MessageResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: Date;
  correlationId?: string;
  traceId?: string;
}

// Standard error response
export interface StandardError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
  timestamp: Date;
  path?: string;
}

// Common pagination interface
export interface PaginationRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Health check interfaces
export interface HealthCheckRequest {
  includeDetails?: boolean;
  timeout?: number;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  service: string;
  timestamp: Date;
  uptime: number;
  version?: string;
  details?: Record<string, any>;
  dependencies?: {
    [key: string]: {
      status: 'healthy' | 'unhealthy';
      responseTime?: number;
      error?: string;
    };
  };
}
