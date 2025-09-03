import { Inject, Injectable, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Loan, LoanStatus } from '@p2p-lending/loan-service/generated/prisma';
import { LoanRepository } from '@p2p-lending/loan-service/src/infrastructure/repositories/loan.repository';

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
