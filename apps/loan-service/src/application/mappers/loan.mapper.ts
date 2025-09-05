import { Loan } from '@loan-service/prisma';

import { LoanDetails, LoanSummary } from '../../shared/types/loan.types';
import { LoanCalculationsUtil } from '../../shared/utils/loan-calculations.util';

export class LoanMapper {
  /**
   * Map database loan to loan summary
   */
  static toLoanSummary(loan: Loan): LoanSummary {
    const fundingProgress = LoanCalculationsUtil.calculateFundingProgress(
      Number(loan.fundedAmount),
      Number(loan.requestedAmount),
    );

    return {
      id: loan.id,
      loanNumber: loan.loanNumber,
      borrowerId: loan.borrowerId,
      requestedAmount: Number(loan.requestedAmount),
      fundedAmount: Number(loan.fundedAmount),
      interestRate: Number(loan.interestRate),
      termMonths: loan.termMonths,
      status: loan.status,
      purpose: loan.purpose,
      createdAt: loan.createdAt,
      fundingProgress,
    };
  }

  /**
   * Map database loan to loan details
   */
  static toLoanDetails(loan: Loan): LoanDetails {
    const fundingProgress = LoanCalculationsUtil.calculateFundingProgress(
      Number(loan.fundedAmount),
      Number(loan.requestedAmount),
    );

    const daysRemaining = loan.fundingDeadline
      ? LoanCalculationsUtil.calculateDaysRemaining(loan.fundingDeadline)
      : 0;

    const totalInterest = LoanCalculationsUtil.calculateTotalInterest(
      Number(loan.requestedAmount),
      Number(loan.monthlyPayment),
      loan.termMonths,
    );

    return {
      id: loan.id,
      loanNumber: loan.loanNumber,
      borrowerId: loan.borrowerId,
      requestedAmount: Number(loan.requestedAmount),
      fundedAmount: Number(loan.fundedAmount),
      interestRate: Number(loan.interestRate),
      termMonths: loan.termMonths,
      monthlyPayment: Number(loan.monthlyPayment),
      status: loan.status,
      purpose: loan.purpose,
      description: loan.description,
      listingDate: loan.listingDate,
      fundingDeadline: loan.fundingDeadline,
      disbursedAt: loan.disbursedAt,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
      fundingProgress,
      daysRemaining,
      totalInterest,
    };
  }

  /**
   * Map array of database loans to loan summaries
   */
  static toLoanSummaries(loans: Loan[]): LoanSummary[] {
    return loans.map((loan) => this.toLoanSummary(loan));
  }

  /**
   * Map array of database loans to loan details
   */
  static toLoanDetailsArray(loans: Loan[]): LoanDetails[] {
    return loans.map((loan) => this.toLoanDetails(loan));
  }
}
