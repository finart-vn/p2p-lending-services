import { SearchDto } from '@api-gateway/dtos/common.dto';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Marketplace')
@Controller('v1/marketplace')
export class MarketplaceController {
  constructor() {}

  @Get('loans')
  @ApiOperation({ summary: 'Get all loans for marketplace' })
  getLoansForMarketplace() {
    return {
      message: 'Get all loans for marketplace',
      data: [],
    };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search for loans' })
  searchLoans(@Query() query: SearchDto) {
    console.log(query);
    return {
      message: 'Search for loans',
      data: [],
    };
  }
}
