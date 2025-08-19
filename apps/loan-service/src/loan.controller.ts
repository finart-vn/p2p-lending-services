import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common';

import { LoanServiceService } from './loan.service';

@Controller()
export class LoanServiceController {
  constructor(private readonly loanServiceService: LoanServiceService) {}

  @Get()
  getHello(): string {
    return this.loanServiceService.getHello();
  }

  @MessagePattern({ cmd: MESSAGE_PATTERNS.LOAN.CREATE })
  createLoan(@Payload() loan: any) {
    console.log(loan);
  }
}
