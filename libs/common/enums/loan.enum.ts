enum LoanPurpose {
  PERSONAL,
  BUSINESS,
  EDUCATION,
  HOME_IMPROVEMENT,
  DEBT_CONSOLIDATION,
}

enum LoanStatus {
  DRAFT,
  PENDING,
  APPROVED,
  LISTED,
  FUNDING,
  ACTIVE,
  COMPLETED,
  DEFAULTED,
  REJECTED,
}

enum InvestmentStatus {
  PENDING,
  ACTIVE,
  COMPLETED,
  DEFAULTED,
}

export { InvestmentStatus, LoanPurpose, LoanStatus };
