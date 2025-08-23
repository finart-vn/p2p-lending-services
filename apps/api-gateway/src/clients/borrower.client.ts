import { ApiLoanCreateRequestDto } from '@api-gateway/dtos/loan/loan-create.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS, ROUTING_KEYS } from '@p2p-lending/common';
import { RmqExchange, RmqService } from '@p2p-lending/common/enums';
import { CreateLoanRequest } from '@p2p-lending/contracts/loan';
import { Loan } from '@p2p-lending/loan-service/generated/prisma';
import { catchError, throwError } from 'rxjs';

import { BaseClient } from './base.client';

@Injectable()
export class BorrowerClient extends BaseClient {
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
      this.exchange.emit(ROUTING_KEYS.LOAN, loanCreated).pipe(
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
}
