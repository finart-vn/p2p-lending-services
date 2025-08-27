import { ApiLoanCreateRequestDto } from '@api-gateway/dtos/loan/loan-create.dto';
import { ApiLoanUpdateRequestDto } from '@api-gateway/dtos/loan/loan-update.dto';
import { MarketplaceSearchDto } from '@api-gateway/dtos/marketplace/marketplace-search.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common';
import { RmqExchange, RmqService } from '@p2p-lending/common/enums';
import {
  CreateLoanRequest,
  UpdateLoanRequest,
} from '@p2p-lending/contracts/loan';
import {
  MarketplaceFilters,
  MarketplaceSearchRequest,
  MarketplaceSearchResponse,
} from '@p2p-lending/contracts/loan/marketplace-requests';
import { Loan } from '@p2p-lending/loan-service/generated/prisma';
import { catchError, throwError } from 'rxjs';

import { BaseClient } from './base.client';

@Injectable()
export class LoanClient extends BaseClient {
  constructor(
    @Inject(RmqService.LOAN) protected readonly client: ClientProxy,
    @Inject(RmqExchange.LOAN) private readonly exchange: ClientProxy,
  ) {
    super(client, RmqService.LOAN);
  }

  async createLoan(borrowerId: string, loan: ApiLoanCreateRequestDto) {
    const loanCreated = await this.send<CreateLoanRequest, Loan>(
      { cmd: MESSAGE_PATTERNS.LOAN.CREATE },
      {
        borrowerId,
        ...loan,
      },
    );

    await this.ensureConnection(this.exchange, () => {
      this.logger.log('Emitting loan created event to exchange');
      this.exchange
        .emit(MESSAGE_PATTERNS.EVENTS.LOAN_CREATED, loanCreated)
        .pipe(
          catchError((error: unknown) => {
            this.logger.error(
              `Error sending message to ${this.serviceName}: ${JSON.stringify(error)}`,
            );
            return throwError(() => error);
          }),
        );
    });

    return loanCreated;
  }

  async updateLoan(borrowerId: string, loan: ApiLoanUpdateRequestDto) {
    const loanUpdated = await this.send<UpdateLoanRequest, Loan>(
      { cmd: MESSAGE_PATTERNS.LOAN.UPDATE },
      loan,
    );

    return loanUpdated;
  }

  async getLoansByBorrower(borrowerId: string) {
    return this.send<string, Loan[]>(
      { cmd: MESSAGE_PATTERNS.LOAN.GET_BY_USER },
      borrowerId,
    );
  }

  async getLoansByLender(lenderId: string) {
    return this.send<string, Loan[]>(
      { cmd: MESSAGE_PATTERNS.LOAN.GET_BY_USER },
      lenderId,
    );
  }

  async getLoanById(loanId: string) {
    return this.send<string, Loan>(
      { cmd: MESSAGE_PATTERNS.LOAN.GET_BY_ID },
      loanId,
    );
  }

  async deleteLoan(loanId: string) {
    return this.send<string, { message: string }>(
      { cmd: MESSAGE_PATTERNS.LOAN.DELETE },
      loanId,
    );
  }

  async searchMarketplaceLoans(searchDto: MarketplaceSearchDto) {
    const searchRequest: MarketplaceSearchRequest = {
      search: searchDto.search,
      minAmount: searchDto.minAmount,
      maxAmount: searchDto.maxAmount,
      minInterestRate: searchDto.minInterestRate,
      maxInterestRate: searchDto.maxInterestRate,
      minTermMonths: searchDto.minTermMonths,
      maxTermMonths: searchDto.maxTermMonths,
      loanTypes: searchDto.loanTypes,
      ratings: searchDto.ratings,
      statuses: searchDto.statuses,
      page: searchDto.page,
      limit: searchDto.limit,
      sortBy: searchDto.sortBy,
      sortOrder: searchDto.sortOrder,
    };

    return await this.send<MarketplaceSearchRequest, MarketplaceSearchResponse>(
      { cmd: MESSAGE_PATTERNS.LOAN.SEARCH_MARKETPLACE },
      searchRequest,
    );
  }

  async getMarketplaceFilters() {
    return await this.send<void, MarketplaceFilters>(
      { cmd: MESSAGE_PATTERNS.LOAN.GET_MARKETPLACE_FILTERS },
      undefined,
    );
  }
}
