import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common';
import {
  CancelInvestmentRequest,
  CreateInvestmentRequest,
  UpdateInvestmentRequest,
} from '@p2p-lending/contracts/investment';

import { InvestmentService } from './investment.service';

@Controller()
export class InvestmentServiceController {
  constructor(private readonly investmentService: InvestmentService) {}

  /**
   * Create a new investment
   * @param payload - The investment request payload
   * @returns The created investment
   */
  @MessagePattern({ cmd: MESSAGE_PATTERNS.INVESTMENT.CREATE })
  async createInvestment(@Payload() payload: CreateInvestmentRequest) {
    return await this.investmentService.createInvestment(payload);
  }

  /**
   * Get an investment by id
   * @param payload - The investment id
   * @returns The investment
   */
  @MessagePattern({ cmd: MESSAGE_PATTERNS.INVESTMENT.GET_BY_ID })
  async getInvestmentById(@Payload() payload: string) {
    return await this.investmentService.getInvestmentById(payload);
  }

  /**
   * Get investments by user (lender)
   * @param payload - The user id
   * @returns The investments
   */
  @MessagePattern({ cmd: MESSAGE_PATTERNS.INVESTMENT.GET_BY_USER })
  async getInvestmentsByUser(@Payload() payload: string) {
    return await this.investmentService.getInvestmentsByUser(payload);
  }

  /**
   * Get investments by loan
   * @param payload - The loan id
   * @returns The investments
   */
  @MessagePattern({ cmd: 'investment.get_by_loan' })
  async getInvestmentsByLoan(@Payload() payload: string) {
    return await this.investmentService.getInvestmentsByLoan(payload);
  }

  /**
   * Update an investment
   * @param payload - The investment update payload
   * @returns The updated investment
   */
  @MessagePattern({ cmd: MESSAGE_PATTERNS.INVESTMENT.UPDATE })
  async updateInvestment(@Payload() payload: UpdateInvestmentRequest) {
    return await this.investmentService.updateInvestment(payload);
  }

  /**
   * Cancel an investment
   * @param payload - The investment cancellation payload
   * @returns The cancelled investment
   */
  @MessagePattern({ cmd: MESSAGE_PATTERNS.INVESTMENT.CANCEL })
  async cancelInvestment(@Payload() payload: CancelInvestmentRequest) {
    return await this.investmentService.cancelInvestment(payload);
  }

  // /**
  //  * Get investment portfolio for a user
  //  * @param payload - The user id
  //  * @returns The investment portfolio
  //  */
  // @MessagePattern({ cmd: MESSAGE_PATTERNS.INVESTMENT.GET_PORTFOLIO })
  // async getInvestmentPortfolio(@Payload() payload: string) {
  //   return await this.investmentService.getInvestmentPortfolio(payload);
  // }

  // /**
  //  * Calculate investment returns
  //  * @param payload - The investment id
  //  * @returns The calculated returns
  //  */
  // @MessagePattern({ cmd: MESSAGE_PATTERNS.INVESTMENT.CALCULATE_RETURNS })
  // async calculateInvestmentReturns(@Payload() payload: string) {
  //   return await this.investmentService.calculateInvestmentReturns(payload);
  // }

  // /**
  //  * Get all investments
  //  * @returns All investments
  //  */
  // @MessagePattern({ cmd: 'investment.get_all' })
  // async getAllInvestments() {
  //   return await this.investmentService.getAllInvestments();
  // }

  // /**
  //  * Delete an investment
  //  * @param payload - The investment id
  //  * @returns Success message
  //  */
  // @MessagePattern({ cmd: 'investment.delete' })
  // async deleteInvestment(@Payload() payload: string) {
  //   return await this.investmentService.deleteInvestment(payload);
  // }
}
