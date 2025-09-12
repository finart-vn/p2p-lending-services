import { InvestmentClient } from '@loan-service/infrastructure/clients/investment.client';
import { LoanRepository } from '@loan-service/infrastructure/repositories/loan.repository';
import { Loan, LoanStatus, Prisma } from '@loan-service/prisma';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import {
  MarketplaceLoan,
  MarketplaceSearchRequest,
  MarketplaceSearchResponse,
} from '@p2p-lending/contracts/loan/marketplace-requests';

import { GetMarketplaceLoansQuery } from '../get-market-loans.query';

@Injectable()
@QueryHandler(GetMarketplaceLoansQuery)
export class GetMarketplaceLoansHandler
  implements IQueryHandler<GetMarketplaceLoansQuery>
{
  private readonly logger = new Logger(GetMarketplaceLoansHandler.name);

  constructor(
    @Inject('LoanRepository')
    private readonly loanRepository: LoanRepository,

    @Inject(InvestmentClient)
    private readonly investmentClient: InvestmentClient,
  ) {}

  async execute(
    query: GetMarketplaceLoansQuery,
  ): Promise<MarketplaceSearchResponse> {
    this.logger.log(
      'Searching marketplace loans',
      query.marketplaceSearchRequest,
    );

    try {
      const { marketplaceSearchRequest } = query;
      const {
        page = 1,
        limit = 20,
        sortBy = 'listingDate',
        sortOrder = 'desc',
      } = marketplaceSearchRequest;

      // Build search criteria
      const whereClause = this.buildSearchCriteria(marketplaceSearchRequest);

      // Get total count for pagination
      const total =
        await this.loanRepository.countMarketplaceLoans(whereClause);

      // Get loans with pagination and sorting
      const loans = await this.loanRepository.findMarketplaceLoans({
        where: whereClause,
        page,
        limit,
        sortBy,
        sortOrder,
      });

      // Get investment data for each loan
      const marketplaceLoans = await this.enrichLoansWithInvestmentData(loans);

      // Get filters for the marketplace
      const filters = this.getMarketplaceFilters();

      return {
        loans: marketplaceLoans,
        facets: filters,
        paging: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Failed to search marketplace loans', error);
      throw new RpcException({
        message: 'Failed to search marketplace loans',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private buildSearchCriteria(request: MarketplaceSearchRequest) {
    //1. Only show loans available for investment
    this.logger.log('Building search criteria', request);
    const where: Prisma.LoanWhereInput = {
      status: {
        notIn: [
          LoanStatus.DRAFT,
          LoanStatus.PENDING,
          LoanStatus.REJECTED,
          LoanStatus.DEFAULTED,
        ],
      }, // Only show loans available for investment
    };
    // 2. Will more searching

    return where;
  }

  private async enrichLoansWithInvestmentData(
    loans: Loan[],
  ): Promise<MarketplaceLoan[]> {
    const loanIds = loans.map((loan) => loan.id);
    this.logger.log('Enriching loans with investment data', loanIds);
    // Get investment data for all loans
    const investmentByLoanIds =
      await this.investmentClient.getInvestmentsByLoans(loanIds);

    this.logger.debug('Investment data', investmentByLoanIds);
    return [];
  }

  getMarketplaceFilters() {
    // This would typically return aggregated filter data
    // For now, return basic structure
    return {
      experienceLevels: [
        { value: 'beginner', label: 'Beginner', count: 0 },
        { value: 'intermediate', label: 'Intermediate', count: 0 },
        { value: 'expert', label: 'Expert', count: 0 },
      ],
      loanTypes: [
        { value: 'PERSONAL', label: 'Personal', count: 0 },
        { value: 'BUSINESS', label: 'Business', count: 0 },
        { value: 'CAR', label: 'Car', count: 0 },
        { value: 'REAL_ESTATE', label: 'Real Estate', count: 0 },
        { value: 'CONSUMER', label: 'Consumer', count: 0 },
      ],
      countries: [{ value: 'US', label: 'United States', count: 0 }],
      ratings: [
        { value: 'A+', label: 'A+', count: 0 },
        { value: 'A', label: 'A', count: 0 },
        { value: 'A-', label: 'A-', count: 0 },
        { value: 'B+', label: 'B+', count: 0 },
        { value: 'B', label: 'B', count: 0 },
        { value: 'B-', label: 'B-', count: 0 },
      ],
      amountRange: { min: 1000, max: 50000, average: 15000 },
      interestRateRange: { min: 3, max: 25, average: 12 },
      termRange: { min: 12, max: 60, average: 36 },
    };
  }
}
