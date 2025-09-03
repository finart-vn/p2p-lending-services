import { LoanStatus } from '@p2p-lending/loan-service/generated/prisma';

export class ChangeLoanStatusCommand {
  constructor(
    public readonly loanId: string,
    public readonly newStatus: LoanStatus,
    public readonly listingDate?: Date,
    public readonly fundingDeadline?: Date,
  ) {}
}
