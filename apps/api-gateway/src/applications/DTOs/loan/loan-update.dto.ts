import { LoanPurpose, LoanStatus } from '@loan-service/prisma';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class ApiLoanUpdateRequestDto {
  @ApiProperty({ description: 'Loan ID', example: '123' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Requested amount', example: 10000 })
  @IsNumber()
  requestedAmount: number;

  @ApiProperty({ description: 'Funded amount', example: 0 })
  @IsNumber()
  fundedAmount: number;

  @ApiProperty({ description: 'Interest rate', example: 5.5 })
  @IsNumber()
  interestRate: number;

  @ApiProperty({ description: 'Loan term in months', example: 12 })
  @IsNumber()
  termMonths: number;

  @ApiProperty({ description: 'Monthly payment', example: 0 })
  @IsNumber()
  monthlyPayment: number;

  @IsEnum(LoanPurpose)
  @ApiProperty({
    description: 'Purpose of the loan',
    example: LoanPurpose.BUSINESS,
  })
  @IsEnum(LoanPurpose)
  purpose: LoanPurpose;

  @ApiProperty({
    description: 'Loan description',
    example: 'This loan is for...',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Loan status',
    enum: LoanStatus,
    example: LoanStatus.ACTIVE,
  })
  @IsEnum(LoanStatus)
  status: LoanStatus;
}
