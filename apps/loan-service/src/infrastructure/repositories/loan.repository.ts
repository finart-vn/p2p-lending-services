import { Loan, LoanPurpose, LoanStatus, Prisma } from '@loan-service/prisma';
import { Injectable } from '@nestjs/common';

import { LoanRepository as ILoanRepository } from '../../domain/repositories/loan.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LoanRepository implements ILoanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(loan: Partial<Loan>): Promise<Loan> {
    const savedLoan = await this.prisma.loan.upsert({
      where: { id: loan.id || '' },
      create: {
        id: loan.id || crypto.randomUUID(),
        borrowerId: loan.borrowerId || '',
        loanNumber: loan.loanNumber || 0,
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
        createdAt: loan.createdAt || new Date(),
        updatedAt: loan.updatedAt || new Date(),
      },
      update: {
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

    return savedLoan;
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
}
