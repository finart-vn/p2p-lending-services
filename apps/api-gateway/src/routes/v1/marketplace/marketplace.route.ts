import { LoanClient } from '@api-gateway/clients/loan.client';
import {
  CreditRating,
  MarketplaceFiltersResponseDto,
  MarketplaceSearchDto,
  MarketplaceSearchResponseDto,
} from '@api-gateway/dtos/marketplace/marketplace-search.dto';
import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Marketplace')
@Controller('v1/marketplace')
export class MarketplaceController {
  constructor(private readonly loanClient: LoanClient) {}

  @Get('loans')
  @ApiOperation({ summary: 'Get all loans for marketplace with basic filters' })
  @ApiResponse({
    status: 200,
    description: 'List of marketplace loans',
    type: MarketplaceSearchResponseDto,
  })
  async getLoansForMarketplace(
    @Query(new ValidationPipe()) query: MarketplaceSearchDto,
  ) {
    return await this.loanClient.searchMarketplaceLoans(query);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Advanced search for loans with comprehensive filters',
    description: `
    Search marketplace loans with advanced filtering options including:
    - Experience levels (Entry, Intermediate, Expert)
    - Loan types (Business, Personal, Car, Real Estate, Consumer)
    - Countries (Latvia, Estonia, Lithuania, Poland, Czech Republic)
    - Credit ratings (A+, A, A-, B+, B, B-)
    - Amount range filtering
    - Interest rate filtering
    - Term duration filtering
    - Text search in descriptions
    - Sorting and pagination
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Search results with loans and filter statistics',
    type: MarketplaceSearchResponseDto,
  })
  async searchLoans(
    @Query(new ValidationPipe()) searchDto: MarketplaceSearchDto,
  ) {
    return await this.loanClient.searchMarketplaceLoans(searchDto);
  }

  @Get('filters')
  @ApiOperation({
    summary: 'Get available marketplace filters and statistics',
    description:
      'Returns all available filter options with their counts and range statistics for amounts, interest rates, and terms',
  })
  @ApiResponse({
    status: 200,
    description: 'Available filters and their statistics',
    type: MarketplaceFiltersResponseDto,
  })
  async getMarketplaceFilters() {
    return await this.loanClient.getMarketplaceFilters();
  }

  @Get('loans/featured')
  @ApiOperation({ summary: 'Get featured/recommended loans for marketplace' })
  @ApiResponse({
    status: 200,
    description: 'List of featured marketplace loans',
    type: MarketplaceSearchResponseDto,
  })
  async getFeaturedLoans(
    @Query(new ValidationPipe()) query: MarketplaceSearchDto,
  ) {
    // Get loans with high ratings and good funding progress
    const featuredQuery = {
      ...query,
      ratings: [CreditRating.A_PLUS, CreditRating.A, CreditRating.A_MINUS],
      sortBy: 'fundingProgress',
      sortOrder: 'desc' as const,
      limit: 10,
    };
    return await this.loanClient.searchMarketplaceLoans(featuredQuery);
  }

  @Get('loans/ending-soon')
  @ApiOperation({
    summary: 'Get loans ending soon (funding deadline approaching)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of loans with approaching funding deadlines',
    type: MarketplaceSearchResponseDto,
  })
  async getLoansEndingSoon(
    @Query(new ValidationPipe()) query: MarketplaceSearchDto,
  ) {
    // Get loans sorted by funding deadline
    const endingSoonQuery = {
      ...query,
      sortBy: 'fundingDeadline',
      sortOrder: 'asc' as const,
      limit: 20,
    };
    return await this.loanClient.searchMarketplaceLoans(endingSoonQuery);
  }
}
