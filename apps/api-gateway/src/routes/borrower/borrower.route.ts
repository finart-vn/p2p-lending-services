import { BorrowerClient } from '@api-gateway/clients/borrower.client';
import { ApiLoanCreateRequestDto } from '@api-gateway/dtos/loan/loan-create.dto';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('borrower')
@ApiTags('Borrower')
export class BorrowerController {
  constructor(private readonly borrowerClient: BorrowerClient) {}

  @Post('create-loan')
  @ApiOperation({ summary: 'Create a loan' })
  async createLoan(
    @Body(new ValidationPipe()) loanDto: ApiLoanCreateRequestDto,
  ) {
    return await this.borrowerClient.createLoan(loanDto);
  }
}
