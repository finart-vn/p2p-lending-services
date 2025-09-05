export enum LoanStatusEnum {
  DRAFT = 'DRAFT',
  LISTED = 'LISTED',
  FUNDING = 'FUNDING',
  FUNDED = 'FUNDED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DEFAULTED = 'DEFAULTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export const LOAN_STATUS_TRANSITIONS = {
  [LoanStatusEnum.DRAFT]: [LoanStatusEnum.LISTED, LoanStatusEnum.REJECTED],
  [LoanStatusEnum.LISTED]: [LoanStatusEnum.FUNDING, LoanStatusEnum.EXPIRED],
  [LoanStatusEnum.FUNDING]: [LoanStatusEnum.FUNDED, LoanStatusEnum.EXPIRED],
  [LoanStatusEnum.FUNDED]: [LoanStatusEnum.ACTIVE],
  [LoanStatusEnum.ACTIVE]: [LoanStatusEnum.COMPLETED, LoanStatusEnum.DEFAULTED],
  [LoanStatusEnum.COMPLETED]: [],
  [LoanStatusEnum.DEFAULTED]: [],
  [LoanStatusEnum.REJECTED]: [],
  [LoanStatusEnum.EXPIRED]: [],
} as const;
