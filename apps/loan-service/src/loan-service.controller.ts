import { Controller, Get } from '@nestjs/common';
import { LoanServiceService } from './loan-service.service';

@Controller()
export class LoanServiceController {
  constructor(private readonly loanServiceService: LoanServiceService) {}

  @Get()
  getHello(): string {
    return this.loanServiceService.getHello();
  }
}
