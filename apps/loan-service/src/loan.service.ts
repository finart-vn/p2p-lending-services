import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import {
  CreateLoanRequest,
  UpdateLoanRequest,
} from '@p2p-lending/contracts/loan';

import { LoanStatus, Prisma } from '../generated/prisma';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class LoanService {
  private readonly logger = new Logger(LoanService.name);

  constructor(private readonly prisma: PrismaService) {}

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

  async getLoanById(@Payload() payload: string) {
    try {
      const loan = await this.prisma.loan.findUnique({
        where: { id: payload },
      });
      if (!loan) {
        throw new RpcException({
          message: 'Loan not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return loan;
    } catch (error) {
      this.logger.error(`Failed to get loan by id: ${error}`);
      throw new RpcException({
        message: 'Failed to get loan by id',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getLoansByBorrower(@Payload() payload: string) {
    try {
      const loans = await this.prisma.loan.findMany({
        where: { borrowerId: payload },
      });
      return loans;
    } catch (error) {
      this.logger.error(`Failed to get loans by borrower: ${error}`);
      throw new RpcException({
        message: 'Failed to get loans by borrower',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getActiveLoans(@Payload() payload: string) {
    const loans = await this.prisma.loan.findMany({
      where: { borrowerId: payload, status: LoanStatus.ACTIVE },
    });
    return loans;
  }

  async updateLoan(@Payload() payload: UpdateLoanRequest) {
    try {
      const loan = await this.prisma.loan.findUnique({
        where: { id: payload.id },
      });
      if (!loan) {
        throw new RpcException({
          message: 'Loan not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const updatedLoan = await this.prisma.loan.update({
        where: { id: payload.id },
        data: payload,
      });
      return updatedLoan;
    } catch (error) {
      this.logger.error(`Failed to update loan: ${error}`);
      throw new RpcException({
        message: 'Failed to update loan',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteLoan(@Payload() payload: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: payload },
    });
    if (!loan) {
      throw new RpcException({
        message: 'Loan not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    await this.prisma.loan.delete({
      where: { id: payload },
    });
    return { message: 'Loan deleted successfully' };
  }
}
