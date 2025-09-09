import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common';
import {
  CreateLoanRequest,
  UpdateLoanRequest,
} from '@p2p-lending/contracts/loan';
import { MarketplaceSearchRequest } from '@p2p-lending/contracts/loan/marketplace-requests';

import { LoanCqrsService } from '../../application/loan-cqrs.service';

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

  /**
   * Get active loans for a borrower
   * @param payload - The borrower id
   * @returns The active loans
   */
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
    return await this.loanCqrsService.updateLoan(payload);
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
    return await this.loanCqrsService.searchMarketplaceLoans(payload);
  }

  /**
   * Get marketplace filters and statistics
   * @returns The available filters and their counts
   */
  @MessagePattern({ cmd: MESSAGE_PATTERNS.LOAN.GET_MARKETPLACE_FILTERS })
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
