export interface LoanDeletedEventData {
  loanId: string;
  borrowerId: string;
  deletedAt: Date;
}

export class LoanDeletedEvent {
  constructor(
    public readonly data: LoanDeletedEventData,
    public readonly occurredOn: Date = new Date(),
  ) {}
}
