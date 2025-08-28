import { ApiProperty } from '@nestjs/swagger';
import { InvestmentStatus } from '@p2p-lending/investment-service/generated/prisma';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ApiInvestmentUpdateRequestDto {
  @ApiProperty({
    description: 'Investment ID',
    example: 'd80fa95a-e1ca-400d-a97a-66d33423cdc9',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Investment amount',
    example: 10000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @ApiProperty({
    description: 'Investment percentage',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(100)
  percentage?: number;

  @ApiProperty({
    description: 'Expected return amount',
    example: 11000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  expectedReturn?: number;

  @ApiProperty({
    description: 'Total amount received',
    example: 5000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalReceived?: number;

  @ApiProperty({
    description: 'Investment status',
    enum: InvestmentStatus,
    example: InvestmentStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(InvestmentStatus)
  status?: InvestmentStatus;

  @ApiProperty({
    description: 'Completion date',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  completedAt?: Date | null;
}
