export class LoanCalculationsUtil {
  /**
   * Calculate monthly payment for a loan
   */
  static calculateMonthlyPayment(
    principal: number,
    interestRate: number,
    termMonths: number,
  ): number {
    if (interestRate === 0) {
      return principal / termMonths;
    }

    const monthlyRate = interestRate / 100 / 12;
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);

    return Math.round(payment * 100) / 100;
  }

  /**
   * Calculate total interest for a loan
   */
  static calculateTotalInterest(
    principal: number,
    monthlyPayment: number,
    termMonths: number,
  ): number {
    const totalPayments = monthlyPayment * termMonths;
    return Math.round((totalPayments - principal) * 100) / 100;
  }

  /**
   * Calculate debt-to-income ratio
   */
  static calculateDebtToIncomeRatio(
    totalDebt: number,
    annualIncome: number,
  ): number {
    if (annualIncome === 0) return 0;
    return Math.round((totalDebt / annualIncome) * 10000) / 100; // Return as percentage
  }

  /**
   * Calculate loan-to-income ratio
   */
  static calculateLoanToIncomeRatio(
    loanAmount: number,
    annualIncome: number,
  ): number {
    if (annualIncome === 0) return 0;
    return Math.round((loanAmount / annualIncome) * 100) / 100;
  }

  /**
   * Calculate funding progress percentage
   */
  static calculateFundingProgress(
    fundedAmount: number,
    requestedAmount: number,
  ): number {
    if (requestedAmount === 0) return 0;
    return Math.round((fundedAmount / requestedAmount) * 10000) / 100;
  }

  /**
   * Calculate days remaining for funding
   */
  static calculateDaysRemaining(fundingDeadline: Date): number {
    const now = new Date();
    const diffTime = fundingDeadline.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  /**
   * Validate loan amount against limits
   */
  static isValidLoanAmount(
    amount: number,
    minAmount: number,
    maxAmount: number,
  ): boolean {
    return amount >= minAmount && amount <= maxAmount;
  }

  /**
   * Validate interest rate
   */
  static isValidInterestRate(
    rate: number,
    minRate: number,
    maxRate: number,
  ): boolean {
    return rate >= minRate && rate <= maxRate;
  }

  /**
   * Validate loan term
   */
  static isValidLoanTerm(
    termMonths: number,
    minTerm: number,
    maxTerm: number,
  ): boolean {
    return termMonths >= minTerm && termMonths <= maxTerm;
  }
}
