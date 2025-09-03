import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateLoanRequest } from '@p2p-lending/contracts/loan';
import { Loan, LoanStatus } from '@p2p-lending/loan-service/generated/prisma';

import { ChangeLoanStatusCommand } from './commands/change-loan-status.command';
import { CreateLoanCommand } from './commands/create-loan.command';
import { DeleteLoanCommand } from './commands/delete-loan.command';
import { UpdateLoanCommand } from './commands/update-loan.command';
import { GetActiveLoansQuery } from './queries/get-active-loans.query';
import { GetAllLoansQuery } from './queries/get-all-loans.query';
import { GetLoanByIdQuery } from './queries/get-loan-by-id.query';
import { GetLoansByBorrowerQuery } from './queries/get-loans-by-borrower.query';
import { GetLoansByIdsQuery } from './queries/get-loans-by-ids.query';

@Injectable()
export class LoanCqrsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // Command methods
  async createLoan(data: CreateLoanRequest): Promise<Loan> {
    const command = new CreateLoanCommand(
      data.borrowerId,
      data.requestedAmount,
      data.interestRate,
      data.termMonths,
      data.monthlyPayment,
      data.purpose,
      data.description,
    );
    return this.commandBus.execute(command);
  }

  async updateLoan(updates): Promise<Loan> {
    const command = new UpdateLoanCommand(updates);
    return this.commandBus.execute(command);
  }

  async deleteLoan(loanId: string): Promise<{ message: string }> {
    const command = new DeleteLoanCommand(loanId);
    return this.commandBus.execute(command);
  }

  async changeLoanStatus(
    loanId: string,
    newStatus: LoanStatus,
    listingDate?: Date,
    fundingDeadline?: Date,
  ): Promise<Loan> {
    const command = new ChangeLoanStatusCommand(
      loanId,
      newStatus,
      listingDate,
      fundingDeadline,
    );
    return this.commandBus.execute(command);
  }

  // Query methods
  async getLoanById(loanId: string): Promise<Loan> {
    const query = new GetLoanByIdQuery(loanId);
    return this.queryBus.execute(query);
  }

  async getLoansByIds(loanIds: string[]): Promise<Loan[]> {
    const query = new GetLoansByIdsQuery(loanIds);
    return this.queryBus.execute(query);
  }

  async getLoansByBorrower(borrowerId: string): Promise<Loan[]> {
    const query = new GetLoansByBorrowerQuery(borrowerId);
    return this.queryBus.execute(query);
  }

  async getActiveLoans(borrowerId: string): Promise<Loan[]> {
    const query = new GetActiveLoansQuery(borrowerId);
    return this.queryBus.execute(query);
  }

  async getAllLoans(): Promise<Loan[]> {
    const query = new GetAllLoansQuery();
    return this.queryBus.execute(query);
  }
}
