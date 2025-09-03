import { Inject, Injectable, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Loan } from '@p2p-lending/loan-service/generated/prisma';
import { LoanRepository } from '@p2p-lending/loan-service/src/infrastructure/repositories/loan.repository';

import { GetAllLoansQuery } from '../get-all-loans.query';

@Injectable()
@QueryHandler(GetAllLoansQuery)
export class GetAllLoansHandler implements IQueryHandler<GetAllLoansQuery> {
  private readonly logger = new Logger(GetAllLoansHandler.name);

  constructor(
    @Inject('LoanRepository')
    private readonly loanRepository: LoanRepository,
  ) {}

  async execute(query: GetAllLoansQuery): Promise<Loan[]> {
    this.logger.log('Getting all loans');

    try {
      const loans = await this.loanRepository.findAll();
      return loans;
    } catch (error) {
      this.logger.error(
        `Failed to get all loans: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
