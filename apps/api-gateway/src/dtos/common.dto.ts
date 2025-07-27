import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'asc';
}

export class ApiResponseDto<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
}

export class PaginatedResponseDto<T> extends ApiResponseDto<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class ErrorResponseDto {
  success: false;
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
}

// TODO: Add more common DTOs as needed
export class IdParamDto {
  @IsString()
  id: string;
}

export class SearchDto {
  @IsOptional()
  @IsString()
  q?: string; // search query

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
