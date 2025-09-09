import { ApiInvestmentCancelRequestDto } from '@api-gateway/applications/DTOs/investment/investment-cancel.dto';
import { ApiInvestmentCreateRequestDto } from '@api-gateway/applications/DTOs/investment/investment-create.dto';
import { ApiInvestmentUpdateRequestDto } from '@api-gateway/applications/DTOs/investment/investment-update.dto';
import { Investment } from '@investment-service/prisma';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common';
import { BaseClient } from '@p2p-lending/common/brokers/base.client';
import { RmqExchange, RmqService } from '@p2p-lending/common/enums';
import {
  CancelInvestmentRequest,
  CreateInvestmentRequest,
  InvestmentCalculationResponse,
  InvestmentPortfolioResponse,
  UpdateInvestmentRequest,
} from '@p2p-lending/contracts/investment';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class InvestmentClient extends BaseClient {
  constructor(
    @Inject(RmqService.INVESTMENT) protected readonly client: ClientProxy,
    @Inject(RmqExchange.LOAN) private readonly exchange: ClientProxy,
  ) {
    super(client, RmqService.INVESTMENT);
  }

  async createInvestment(
    lenderId: string,
    investment: ApiInvestmentCreateRequestDto,
  ) {
    const investmentCreated = await this.send<
      CreateInvestmentRequest,
      Investment
    >(
      { cmd: MESSAGE_PATTERNS.INVESTMENT.CREATE },
      {
        ...investment,
        lenderId,
      },
    );

    await this.ensureConnection(this.exchange, () => {
      this.logger.log('Emitting investment created event to exchange');
      this.exchange
        .emit(MESSAGE_PATTERNS.EVENTS.INVESTMENT_CREATED, investmentCreated)
        .pipe(
          catchError((error: unknown) => {
            this.logger.error(
              `Error sending message to ${this.serviceName}: ${JSON.stringify(error)}`,
            );
            return throwError(() => error);
          }),
        );
    });

    return investmentCreated;
  }

  async updateInvestment(investment: ApiInvestmentUpdateRequestDto) {
    const investmentUpdated = await this.send<
      UpdateInvestmentRequest,
      Investment
    >({ cmd: MESSAGE_PATTERNS.INVESTMENT.UPDATE }, investment);

    return investmentUpdated;
  }

  async cancelInvestment(investment: ApiInvestmentCancelRequestDto) {
    const investmentCancelled = await this.send<
      CancelInvestmentRequest,
      Investment
    >({ cmd: MESSAGE_PATTERNS.INVESTMENT.CANCEL }, investment);

    return investmentCancelled;
  }

  async getInvestmentById(investmentId: string) {
    return this.send<string, Investment>(
      { cmd: MESSAGE_PATTERNS.INVESTMENT.GET_BY_ID },
      investmentId,
    );
  }

  async getInvestmentsByUser(userId: string) {
    return this.send<string, Investment[]>(
      { cmd: MESSAGE_PATTERNS.INVESTMENT.GET_BY_USER },
      userId,
    );
  }

  async getInvestmentsByLoan(loanId: string) {
    return this.send<string, Investment[]>(
      { cmd: 'investment.get_by_loan' },
      loanId,
    );
  }

  async getInvestmentPortfolio(userId: string) {
    return this.send<string, InvestmentPortfolioResponse>(
      { cmd: MESSAGE_PATTERNS.INVESTMENT.GET_PORTFOLIO },
      userId,
    );
  }

  async calculateInvestmentReturns(investmentId: string) {
    return this.send<string, InvestmentCalculationResponse>(
      { cmd: MESSAGE_PATTERNS.INVESTMENT.CALCULATE_RETURNS },
      investmentId,
    );
  }

  async getAllInvestments() {
    return this.send<void, Investment[]>(
      { cmd: 'investment.get_all' },
      undefined,
    );
  }

  async deleteInvestment(investmentId: string) {
    return this.send<string, { message: string }>(
      { cmd: 'investment.delete' },
      investmentId,
    );
  }
}
