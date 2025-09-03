import { Injectable, Logger, Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Loan } from '@p2p-lending/loan-service/generated/prisma';
import { LoanRepository } from '../../domain/repositories/loan.repository.interface';
import { GetLoanByIdQuery } from '../get-loan-by-id.query';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

@Injectable()
@QueryHandler(GetLoanByIdQuery)
export class GetLoanByIdHandler implements IQueryHandler<GetLoanByIdQuery> {
  private readonly logger = new Logger(GetLoanByIdHandler.name);

  constructor(
    @Inject('LoanRepository')
    private readonly loanRepository: LoanRepository,
  ) {}

  async execute(query: GetLoanByIdQuery): Promise<Loan> {
    this.logger.log(`Getting loan by ID: ${query.loanId}`);

    try {
      const loan = await this.loanRepository.findById(query.loanId);

      if (!loan) {
        throw new RpcException({
          message: 'Loan not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      return loan;
    } catch (error) {
      this.logger.error(
        `Failed to get loan by ID: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
