import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common';
import {
  CreateLoanRequest,
  UpdateLoanRequest,
} from '@p2p-lending/contracts/loan';
import { MarketplaceSearchRequest } from '@p2p-lending/contracts/loan/marketplace-requests';

import { LoanCqrsService } from './application/loan-cqrs.service';

@Controller()
export class LoanServiceController {
  constructor(private readonly loanCqrsService: LoanCqrsService) {}
  /**
   * Create a new loan
   * @param payload - The loan request payload
   * @returns The created loan
   */
  @MessagePattern({ cmd: MESSAGE_PATTERNS.LOAN.CREATE })
  async createLoan(@Payload() payload: CreateLoanRequest) {
    return await this.loanCqrsService.createLoan({
      ...payload,
      description: payload.description || undefined,
    });
  }

  /**
   * Get a loan by id
   * @param payload - The loan id
   * @returns The loan
   */
  @MessagePattern({ cmd: MESSAGE_PATTERNS.LOAN.GET_BY_ID })
  async getLoanById(@Payload() payload: string) {
    return await this.loanCqrsService.getLoanById(payload);
  }

  /**
   * Get loans by ids
   * @param payload - The loan ids
   * @returns The loans
   */
  @MessagePattern({ cmd: MESSAGE_PATTERNS.LOAN.GET_BY_IDS })
  async getLoanByIds(@Payload() payload: string[]) {
    return await this.loanCqrsService.getLoansByIds(payload);
  }

  /**
   * Get loans by borrower
   * @param payload - The borrower id
   * @returns The loans
   */
  @MessagePattern({ cmd: MESSAGE_PATTERNS.LOAN.GET_BY_USER })
  async getLoansByBorrower(@Payload() payload: string) {
    return await this.loanCqrsService.getLoansByBorrower(payload);
  }

  @MessagePattern({ cmd: MESSAGE_PATTERNS.LOAN.GET_ACTIVE })
  async getActiveLoans(@Payload() payload: string) {
    return await this.loanCqrsService.getActiveLoans(payload);
  }

  /**
   * Update a loan
   * @param payload - The loan request payload
   * @returns The updated loan
   */
  @MessagePattern({ cmd: MESSAGE_PATTERNS.LOAN.UPDATE })
  async updateLoan(@Payload() payload: UpdateLoanRequest) {
    const { id, ...updates } = payload;
    return await this.loanCqrsService.updateLoan(id, {
      ...updates,
      description: updates.description || undefined,
    });
  }

  /**
   * Delete a loan
   * @param payload - The loan id
   * @returns The deleted loan
   */
  @MessagePattern({ cmd: MESSAGE_PATTERNS.LOAN.DELETE })
  async deleteLoan(@Payload() payload: string) {
    return await this.loanCqrsService.deleteLoan(payload);
  }

  /**
   * Search marketplace loans with filters
   * @param payload - The search request payload
   * @returns The search results with loans and filters
   */
  @MessagePattern({ cmd: MESSAGE_PATTERNS.LOAN.SEARCH_MARKETPLACE })
  async searchMarketplaceLoans(@Payload() payload: MarketplaceSearchRequest) {
    console.log(payload);
    const loans = await this.loanCqrsService.getAllLoans();

    return {
      total: 10,
      page: 1,
      limit: 10,
      totalPages: 1,
      loans,
      filters: {
        experienceLevels: [],
        loanTypes: [],
        countries: [],
        ratings: [],
      },
    };
  }

  /**
   * Get marketplace filters and statistics
   * @returns The available filters and their counts
   */
  @MessagePattern({ cmd: MESSAGE_PATTERNS.LOAN.GET_MARKETPLACE_FILTERS })
  getMarketplaceFilters() {
    return {
      experienceLevels: [],
      loanTypes: [],
      countries: [],
      ratings: [],
    };
    // return await this.loanServiceService.getMarketplaceFilters();
  }
}
