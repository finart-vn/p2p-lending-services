import { Loan, LoanPurpose, LoanStatus } from '@loan-service/prisma';

export interface LoanRepository {
  save(loan: Partial<Loan>): Promise<Loan>;
  findById(id: string): Promise<Loan | null>;
  findByIds(ids: string[]): Promise<Loan[]>;
  findByBorrowerId(borrowerId: string): Promise<Loan[]>;
  findByStatus(status: LoanStatus): Promise<Loan[]>;
  findByBorrowerAndStatus(
    borrowerId: string,
    status: LoanStatus,
  ): Promise<Loan[]>;
  findByPurpose(purpose: LoanPurpose): Promise<Loan[]>;
  findAll(): Promise<Loan[]>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  findMarketplaceLoans(params: {
    where: any;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<Loan[]>;
  countMarketplaceLoans(where: any): Promise<number>;
}
