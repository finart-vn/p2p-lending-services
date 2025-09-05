import { LoanRepository } from '@loan-service/infrastructure/repositories/loan.repository';
import { Loan } from '@loan-service/prisma';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';

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
    this.logger.log('Getting all loans', query);

    try {
      const loans = await this.loanRepository.findAll();
      return loans;
    } catch (error) {
      this.logger.error(`Failed to get all loans`, error);
      throw new RpcException({
        message: 'Failed to get all loans',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
