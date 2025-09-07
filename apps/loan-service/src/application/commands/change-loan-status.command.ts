import { LoanStatus } from '@loan-service/prisma';

export class ChangeLoanStatusCommand {
  constructor(
    public readonly loanId: string,
    public readonly newStatus: LoanStatus,
    public readonly listingDate?: Date,
    public readonly fundingDeadline?: Date,
  ) {}
}
