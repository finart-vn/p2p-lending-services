import { ApiProperty } from '@nestjs/swagger';
import { CreateLoanRequest } from '@p2p-lending/contracts/loan';
import { LoanPurpose } from '@p2p-lending/loan-service/generated/prisma';

export class ApiLoanCreateRequestDto implements CreateLoanRequest {
  @ApiProperty({ description: 'Borrower ID', example: '12345' })
  borrowerId: string;

  @ApiProperty({
    description: 'Loan description',
    example: 'This loan is for...',
  })
  description: string | null;

  @ApiProperty({
    description: 'Purpose of the loan',
    example: LoanPurpose.BUSINESS,
  })
  purpose: LoanPurpose;

  @ApiProperty({ description: 'Requested amount', example: 10000 })
  requestedAmount: number;

  @ApiProperty({ description: 'Funded amount', example: 0 })
  fundedAmount: number;

  @ApiProperty({ description: 'Interest rate', example: 5.5 })
  interestRate: number;

  @ApiProperty({ description: 'Loan term in months', example: 12 })
  term: number;

  @ApiProperty({ description: 'Monthly payment', example: 0 })
  monthlyPayment: number;

  @ApiProperty({ description: 'Loan term in months', example: 12 })
  termMonths: number;

  @ApiProperty({ description: 'Funding deadline', example: new Date() })
  fundingDeadline: Date | null;
}
