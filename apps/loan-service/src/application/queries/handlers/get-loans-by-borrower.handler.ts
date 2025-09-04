import { LoanRepository } from '@loan-service/infrastructure/repositories/loan.repository';
import { Loan } from '@loan-service/prisma';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetLoansByBorrowerQuery } from '../get-loans-by-borrower.query';

@Injectable()
@QueryHandler(GetLoansByBorrowerQuery)
export class GetLoansByBorrowerHandler
  implements IQueryHandler<GetLoansByBorrowerQuery>
{
  private readonly logger = new Logger(GetLoansByBorrowerHandler.name);

  constructor(
    @Inject('LoanRepository')
    private readonly loanRepository: LoanRepository,
  ) {}

  async execute(query: GetLoansByBorrowerQuery): Promise<Loan[]> {
    this.logger.log(`Getting loans by borrower: ${query.borrowerId}`);

    try {
      const loans = await this.loanRepository.findByBorrowerId(
        query.borrowerId,
      );
      return loans;
    } catch (error) {
      this.logger.error(
        `Failed to get loans by borrower: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
