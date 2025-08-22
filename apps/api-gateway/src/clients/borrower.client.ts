import { ApiLoanCreateRequestDto } from '@api-gateway/dtos/loan/loan-create.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common';
import { RmqService } from '@p2p-lending/common/enums';
import { CreateLoanRequest } from '@p2p-lending/contracts/loan';
import { Loan } from '@p2p-lending/loan-service/generated/prisma';

import { BaseClient } from './base.client';

@Injectable()
export class BorrowerClient extends BaseClient {
  constructor(@Inject(RmqService.LOAN) protected readonly client: ClientProxy) {
    super(client, RmqService.LOAN);
  }

  async createLoan(loan: ApiLoanCreateRequestDto) {
    return await this.send<CreateLoanRequest, Loan>(
      { cmd: MESSAGE_PATTERNS.LOAN.CREATE },
      {
        borrowerId: '12345', // TODO: get borrowerId from auth service
        ...loan,
      },
    );
  }
}
