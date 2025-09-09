import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseClient } from '@p2p-lending/common/brokers/base.client';
import { RmqService } from '@p2p-lending/common/enums';

@Injectable()
export class InvestmentClient extends BaseClient {
  constructor(
    @Inject(RmqService.INVESTMENT)
    private readonly investmentClient: ClientProxy,
  ) {
    super(investmentClient, RmqService.INVESTMENT);
  }

  getInvestmentsByLoans(loanIds: string[]) {
    try {
      this.logger.log(`Fetching investments for ${loanIds.length} loans`);

      // Since the investment service doesn't have a bulk method, we'll fetch individually
      // In a production system, you'd want to implement a bulk method in the investment service

      this.logger.log('Get investments by LOANS');
    } catch (error) {
      this.logger.error(`Failed to fetch investments for loans:`, error);
      return [];
    }
  }
}
