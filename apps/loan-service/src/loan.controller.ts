import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common';
import {
  CreateLoanRequest,
  UpdateLoanRequest,
} from '@p2p-lending/contracts/loan';

import { LoanService } from './loan.service';

@Controller()
export class LoanServiceController {
  constructor(private readonly loanServiceService: LoanService) {}
  /**
   * Create a new loan
   * @param payload - The loan request payload
   * @returns The created loan
   */
  @MessagePattern({ cmd: MESSAGE_PATTERNS.LOAN.CREATE })
  async createLoan(@Payload() payload: CreateLoanRequest) {
    return await this.loanServiceService.createLoan(payload);
  }

  /**
   * Get a loan by id
   * @param payload - The loan id
   * @returns The loan
   */
  @MessagePattern(MESSAGE_PATTERNS.LOAN.GET_BY_ID)
  async getLoanById(@Payload() payload: string) {
    return await this.loanServiceService.getLoanById(payload);
  }

  /**
   * Get loans by borrower
   * @param payload - The borrower id
   * @returns The loans
   */
  @MessagePattern(MESSAGE_PATTERNS.LOAN.GET_BY_USER)
  async getLoansByBorrower(@Payload() payload: string) {
    return await this.loanServiceService.getLoansByBorrower(payload);
  }

  @MessagePattern(MESSAGE_PATTERNS.LOAN.GET_ACTIVE)
  async getActiveLoans(@Payload() payload: string) {
    return await this.loanServiceService.getActiveLoans(payload);
  }

  /**
   * Update a loan
   * @param payload - The loan request payload
   * @returns The updated loan
   */
  @MessagePattern(MESSAGE_PATTERNS.LOAN.UPDATE)
  async updateLoan(@Payload() payload: UpdateLoanRequest) {
    return await this.loanServiceService.updateLoan(payload);
  }

  /**
   * Delete a loan
   * @param payload - The loan id
   * @returns The deleted loan
   */
  @MessagePattern(MESSAGE_PATTERNS.LOAN.DELETE)
  async deleteLoan(@Payload() payload: string) {
    return await this.loanServiceService.deleteLoan(payload);
  }
}
