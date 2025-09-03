import { Injectable, Logger, Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Loan } from '@p2p-lending/loan-service/generated/prisma';
import { LoanRepository } from '../../domain/repositories/loan.repository.interface';
import { GetLoansByIdsQuery } from '../get-loans-by-ids.query';

@Injectable()
@QueryHandler(GetLoansByIdsQuery)
export class GetLoansByIdsHandler implements IQueryHandler<GetLoansByIdsQuery> {
  private readonly logger = new Logger(GetLoansByIdsHandler.name);

  constructor(
    @Inject('LoanRepository')
    private readonly loanRepository: LoanRepository,
  ) {}

  async execute(query: GetLoansByIdsQuery): Promise<Loan[]> {
    this.logger.log(`Getting loans by IDs: ${query.loanIds.join(', ')}`);

    try {
      const loans = await this.loanRepository.findByIds(query.loanIds);
      return loans;
    } catch (error) {
      this.logger.error(
        `Failed to get loans by IDs: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
