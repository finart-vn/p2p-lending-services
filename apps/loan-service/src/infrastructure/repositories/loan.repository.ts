import { Loan, LoanPurpose, LoanStatus, Prisma } from '@loan-service/prisma';
import { Injectable } from '@nestjs/common';

import { LoanRepository as ILoanRepository } from '../../domain/repositories/loan.repository.interface';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class LoanRepository implements ILoanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(loan: Partial<Loan>): Promise<Loan> {
    // If loan has an ID, it's an update operation
    if (loan.id) {
      return await this.prisma.loan.update({
        where: { id: loan.id },
        data: {
          borrowerId: loan.borrowerId,
          requestedAmount: loan.requestedAmount
            ? Prisma.Decimal(loan.requestedAmount.toString())
            : undefined,
          fundedAmount: loan.fundedAmount
            ? Prisma.Decimal(loan.fundedAmount.toString())
            : undefined,
          interestRate: loan.interestRate
            ? Prisma.Decimal(loan.interestRate.toString())
            : undefined,
          termMonths: loan.termMonths,
          monthlyPayment: loan.monthlyPayment
            ? Prisma.Decimal(loan.monthlyPayment.toString())
            : undefined,
          purpose: loan.purpose,
          description: loan.description,
          status: loan.status,
          listingDate: loan.listingDate,
          fundingDeadline: loan.fundingDeadline,
          disbursedAt: loan.disbursedAt,
        },
      });
    }

    // For new loans, use create and let the database auto-generate loanNumber
    return await this.prisma.loan.create({
      data: {
        borrowerId: loan.borrowerId || '',
        // Don't set loanNumber - let the database auto-generate it
        requestedAmount: loan.requestedAmount
          ? Prisma.Decimal(loan.requestedAmount.toString())
          : Prisma.Decimal(0),
        fundedAmount: loan.fundedAmount
          ? Prisma.Decimal(loan.fundedAmount.toString())
          : Prisma.Decimal(0),
        interestRate: loan.interestRate
          ? Prisma.Decimal(loan.interestRate.toString())
          : Prisma.Decimal(0),
        termMonths: loan.termMonths || 0,
        monthlyPayment: loan.monthlyPayment
          ? Prisma.Decimal(loan.monthlyPayment.toString())
          : Prisma.Decimal(0),
        purpose: loan.purpose || 'PERSONAL',
        description: loan.description,
        status: loan.status || 'DRAFT',
        listingDate: loan.listingDate,
        fundingDeadline: loan.fundingDeadline,
        disbursedAt: loan.disbursedAt,
      },
    });
  }

  async findById(id: string): Promise<Loan | null> {
    return await this.prisma.loan.findUnique({
      where: { id },
    });
  }

  async findByIds(ids: string[]): Promise<Loan[]> {
    return await this.prisma.loan.findMany({
      where: { id: { in: ids } },
    });
  }

  async findByBorrowerId(borrowerId: string): Promise<Loan[]> {
    return await this.prisma.loan.findMany({
      where: { borrowerId },
    });
  }

  async findByStatus(status: LoanStatus): Promise<Loan[]> {
    return await this.prisma.loan.findMany({
      where: { status },
    });
  }

  async findByBorrowerAndStatus(
    borrowerId: string,
    status: LoanStatus,
  ): Promise<Loan[]> {
    return await this.prisma.loan.findMany({
      where: { borrowerId, status },
    });
  }

  async findByPurpose(purpose: LoanPurpose): Promise<Loan[]> {
    return await this.prisma.loan.findMany({
      where: { purpose },
    });
  }

  async findAll(): Promise<Loan[]> {
    return await this.prisma.loan.findMany();
  }

  async delete(id: string): Promise<void> {
    await this.prisma.loan.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.loan.count({
      where: { id },
    });
    return count > 0;
  }

  async findMarketplaceLoans(params: {
    where: Prisma.LoanWhereInput;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<Loan[]> {
    return await this.prisma.loan.findMany({
      where: params.where,
    });
  }

  async countMarketplaceLoans(where: Prisma.LoanWhereInput): Promise<number> {
    return await this.prisma.loan.count({ where });
  }
}
