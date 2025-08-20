import { Injectable, Logger } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { CreateLoanRequest } from '@p2p-lending/contracts/loan';

import { Prisma } from '../generated/prisma';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class LoanService {
  private readonly logger = new Logger(LoanService.name);

  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Loan Service is running!';
  }

  async createLoan(@Payload() payload: CreateLoanRequest) {
    const loan = await this.prisma.loan.create({
      data: {
        ...payload,
        requestedAmount: Prisma.Decimal(payload.requestedAmount.toString()),
        fundedAmount: Prisma.Decimal(payload.fundedAmount.toString()),
        interestRate: Prisma.Decimal(payload.interestRate.toString()),
        monthlyPayment: Prisma.Decimal(payload.monthlyPayment.toString()),
      },
    });
    return loan;
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
