import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common';
import { CreateLoanRequest } from '@p2p-lending/contracts/loan';

import { LoanService } from './loan.service';

@Controller()
export class LoanServiceController {
  constructor(private readonly loanServiceService: LoanService) {}

  @Get()
  getHello(): string {
    return this.loanServiceService.getHello();
  }

  @MessagePattern({ cmd: MESSAGE_PATTERNS.LOAN.CREATE })
  async createLoan(@Payload() payload: CreateLoanRequest) {
    return await this.loanServiceService.createLoan(payload);
  }
}
