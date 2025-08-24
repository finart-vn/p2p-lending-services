import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Public')
@Controller('v1/public')
export class PublicController {
  constructor() {}

  @Get('loans')
  @ApiOperation({ summary: 'Get all loans' })
  getAllLoans() {
    return {
      message: 'Get all loans',
      data: [],
    };
  }

  @Get('loan/:id')
  @ApiOperation({ summary: 'Get a loan by id' })
  getLoanById(@Param('id') id: string) {
    console.log(id);
    return {
      message: 'Get a loan by id',
      data: null,
    };
  }

  @Get('loans/marketplace')
  @ApiOperation({ summary: 'Get all loans for marketplace' })
  getLoansForMarketplace() {
    return {
      message: 'Get all loans for marketplace',
      data: [],
    };
  }
}
