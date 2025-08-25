import { ApiLoanCreateRequestDto } from '@api-gateway/dtos/loan/loan-create.dto';
import { ApiLoanUpdateRequestDto } from '@api-gateway/dtos/loan/loan-update.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common';
import { RmqExchange, RmqService } from '@p2p-lending/common/enums';
import {
  CreateLoanRequest,
  UpdateLoanRequest,
} from '@p2p-lending/contracts/loan';
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

  async updateLoan(loan: ApiLoanUpdateRequestDto) {
    const loanUpdated = await this.send<UpdateLoanRequest, Loan>(
      { cmd: MESSAGE_PATTERNS.LOAN.UPDATE },
      loan,
    );

    return loanUpdated;
  }
}
