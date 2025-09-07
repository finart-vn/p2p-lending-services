import { InvestmentStatus } from '@investment-service/prisma';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ApiInvestmentCreateRequestDto {
  @ApiProperty({
    description: 'Loan id',
    example: 'd80fa95a-e1ca-400d-a97a-66d33423cdc9',
  })
  @IsString()
  loanId: string;

  @ApiProperty({ description: 'Amount', example: 10000 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ description: 'Percentage', example: 10 })
  @IsNumber()
  @Min(0.01)
  @Max(100)
  percentage: number;

  @ApiProperty({ description: 'Expected return', example: 10 })
  @IsNumber()
  @Min(0)
  expectedReturn: number;

  @ApiProperty({ description: 'Total received', example: 10 })
  @IsNumber()
  @Min(0)
  totalReceived: number;

  @ApiProperty({ description: 'Status', example: InvestmentStatus.PENDING })
  @IsOptional()
  @IsEnum(InvestmentStatus)
  status?: InvestmentStatus;
}
