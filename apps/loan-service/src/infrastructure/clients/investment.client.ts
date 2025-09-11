import { Investment } from '@investment-service/prisma';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseClient } from '@p2p-lending/common/brokers/base.client';
import { MESSAGE_PATTERNS } from '@p2p-lending/common/constants/message-patterns';
import { RmqService } from '@p2p-lending/common/enums';

@Injectable()
export class InvestmentClient extends BaseClient {
  constructor(
    @Inject(RmqService.INVESTMENT)
    private readonly investmentClient: ClientProxy,
  ) {
    super(investmentClient, RmqService.INVESTMENT);
  }

  async getInvestmentsByLoans(loanIds: string[]) {
    try {
      this.logger.log(`Fetching investments for ${loanIds.length} loans`);

      return this.send<string[], Investment[]>(
        { cmd: MESSAGE_PATTERNS.INVESTMENT.GET_BY_LOAN },
        loanIds,
      );
      this.logger.log('Get investments by LOANS');
    } catch (error) {
      this.logger.error(`Failed to fetch investments for loans:`, error);
      return [];
    }
  }
}
