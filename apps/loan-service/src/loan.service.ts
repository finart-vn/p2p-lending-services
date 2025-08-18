import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class LoanServiceService {
  private readonly logger = new Logger(LoanServiceService.name);

  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Loan Service is running!';
  }

  // TODO: Implement loan service methods
  // - createLoan()
  // - getLoanById()
  // - updateLoan()
  // - deleteLoan()
  // - getLoansByBorrower()
  // - getActiveLoans()
  // - etc.
}
