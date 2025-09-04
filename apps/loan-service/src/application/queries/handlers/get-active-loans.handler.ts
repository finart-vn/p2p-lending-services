import { LoanRepository } from '@loan-service/infrastructure/repositories/loan.repository';
import { Loan, LoanStatus } from '@loan-service/prisma';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetActiveLoansQuery } from '../get-active-loans.query';

@Injectable()
@QueryHandler(GetActiveLoansQuery)
export class GetActiveLoansHandler
  implements IQueryHandler<GetActiveLoansQuery>
{
  private readonly logger = new Logger(GetActiveLoansHandler.name);

  constructor(
    @Inject('LoanRepository')
    private readonly loanRepository: LoanRepository,
  ) {}

  async execute(query: GetActiveLoansQuery): Promise<Loan[]> {
    this.logger.log(`Getting active loans for borrower: ${query.borrowerId}`);

    try {
      const loans = await this.loanRepository.findByBorrowerAndStatus(
        query.borrowerId,
        LoanStatus.ACTIVE,
      );
      return loans;
    } catch (error) {
      this.logger.error(
        `Failed to get active loans: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
