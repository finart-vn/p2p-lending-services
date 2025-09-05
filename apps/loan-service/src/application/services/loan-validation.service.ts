import { LoanPurpose } from '@loan-service/prisma';
import { Injectable } from '@nestjs/common';

import {
  LOAN_LIMITS,
  LOAN_PURPOSE_LIMITS,
} from '../../shared/constants/loan-limits.constants';
import { LoanCalculationsUtil } from '../../shared/utils/loan-calculations.util';

export interface LoanValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface CreateLoanValidationData {
  requestedAmount: number;
  interestRate: number;
  termMonths: number;
  purpose: LoanPurpose;
  borrowerId: string;
}

export interface UpdateLoanValidationData {
  id: string;
  requestedAmount?: number;
  interestRate?: number;
  termMonths?: number;
  purpose?: LoanPurpose;
}

@Injectable()
export class LoanValidationService {
  /**
   * Validate loan creation data
   */
  validateCreateLoan(data: CreateLoanValidationData): LoanValidationResult {
    const errors: string[] = [];

    // Validate borrower ID
    if (!data.borrowerId || data.borrowerId.trim() === '') {
      errors.push('Borrower ID is required');
    }

    // Validate loan amount
    if (
      !LoanCalculationsUtil.isValidLoanAmount(
        data.requestedAmount,
        LOAN_LIMITS.MIN_AMOUNT,
        LOAN_LIMITS.MAX_AMOUNT,
      )
    ) {
      errors.push(
        `Loan amount must be between $${LOAN_LIMITS.MIN_AMOUNT} and $${LOAN_LIMITS.MAX_AMOUNT}`,
      );
    }

    // Validate interest rate
    if (
      !LoanCalculationsUtil.isValidInterestRate(
        data.interestRate,
        LOAN_LIMITS.MIN_INTEREST_RATE,
        LOAN_LIMITS.MAX_INTEREST_RATE,
      )
    ) {
      errors.push(
        `Interest rate must be between ${LOAN_LIMITS.MIN_INTEREST_RATE}% and ${LOAN_LIMITS.MAX_INTEREST_RATE}%`,
      );
    }

    // Validate loan term
    if (
      !LoanCalculationsUtil.isValidLoanTerm(
        data.termMonths,
        LOAN_LIMITS.MIN_TERM_MONTHS,
        LOAN_LIMITS.MAX_TERM_MONTHS,
      )
    ) {
      errors.push(
        `Loan term must be between ${LOAN_LIMITS.MIN_TERM_MONTHS} and ${LOAN_LIMITS.MAX_TERM_MONTHS} months`,
      );
    }

    // Validate purpose-specific limits
    const purposeLimit = LOAN_PURPOSE_LIMITS[data.purpose];
    if (purposeLimit && data.requestedAmount > purposeLimit) {
      errors.push(`${data.purpose} loans cannot exceed $${purposeLimit}`);
    }

    // Validate loan purpose
    if (!Object.values(LoanPurpose).includes(data.purpose)) {
      errors.push('Invalid loan purpose');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate loan update data
   */
  validateUpdateLoan(data: UpdateLoanValidationData): LoanValidationResult {
    const errors: string[] = [];

    // Validate loan ID
    if (!data.id || data.id.trim() === '') {
      errors.push('Loan ID is required');
    }

    // Validate loan amount if provided
    if (data.requestedAmount !== undefined) {
      if (
        !LoanCalculationsUtil.isValidLoanAmount(
          data.requestedAmount,
          LOAN_LIMITS.MIN_AMOUNT,
          LOAN_LIMITS.MAX_AMOUNT,
        )
      ) {
        errors.push(
          `Loan amount must be between $${LOAN_LIMITS.MIN_AMOUNT} and $${LOAN_LIMITS.MAX_AMOUNT}`,
        );
      }
    }

    // Validate interest rate if provided
    if (data.interestRate !== undefined) {
      if (
        !LoanCalculationsUtil.isValidInterestRate(
          data.interestRate,
          LOAN_LIMITS.MIN_INTEREST_RATE,
          LOAN_LIMITS.MAX_INTEREST_RATE,
        )
      ) {
        errors.push(
          `Interest rate must be between ${LOAN_LIMITS.MIN_INTEREST_RATE}% and ${LOAN_LIMITS.MAX_INTEREST_RATE}%`,
        );
      }
    }

    // Validate loan term if provided
    if (data.termMonths !== undefined) {
      if (
        !LoanCalculationsUtil.isValidLoanTerm(
          data.termMonths,
          LOAN_LIMITS.MIN_TERM_MONTHS,
          LOAN_LIMITS.MAX_TERM_MONTHS,
        )
      ) {
        errors.push(
          `Loan term must be between ${LOAN_LIMITS.MIN_TERM_MONTHS} and ${LOAN_LIMITS.MAX_TERM_MONTHS} months`,
        );
      }
    }

    // Validate purpose-specific limits if both purpose and amount are provided
    if (data.purpose && data.requestedAmount) {
      const purposeLimit = LOAN_PURPOSE_LIMITS[data.purpose];
      if (purposeLimit && data.requestedAmount > purposeLimit) {
        errors.push(`${data.purpose} loans cannot exceed $${purposeLimit}`);
      }
    }

    // Validate loan purpose if provided
    if (
      data.purpose !== undefined &&
      !Object.values(LoanPurpose).includes(data.purpose)
    ) {
      errors.push('Invalid loan purpose');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate loan ID format
   */
  validateLoanId(loanId: string): LoanValidationResult {
    const errors: string[] = [];

    if (!loanId || loanId.trim() === '') {
      errors.push('Loan ID is required');
    } else if (loanId.length < 10) {
      errors.push('Invalid loan ID format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate borrower ID format
   */
  validateBorrowerId(borrowerId: string): LoanValidationResult {
    const errors: string[] = [];

    if (!borrowerId || borrowerId.trim() === '') {
      errors.push('Borrower ID is required');
    } else if (borrowerId.length < 10) {
      errors.push('Invalid borrower ID format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate array of loan IDs
   */
  validateLoanIds(loanIds: string[]): LoanValidationResult {
    const errors: string[] = [];

    if (!Array.isArray(loanIds)) {
      errors.push('Loan IDs must be an array');
      return { isValid: false, errors };
    }

    if (loanIds.length === 0) {
      errors.push('At least one loan ID is required');
      return { isValid: false, errors };
    }

    if (loanIds.length > 100) {
      errors.push('Cannot request more than 100 loans at once');
    }

    // Validate each loan ID
    loanIds.forEach((id, index) => {
      const validation = this.validateLoanId(id);
      if (!validation.isValid) {
        errors.push(
          `Loan ID at index ${index}: ${validation.errors.join(', ')}`,
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
