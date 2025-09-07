import { UpdateLoanRequest } from '@p2p-lending/contracts/loan/loan-requests';

export type UpdateLoanCommandData = UpdateLoanRequest;

export class UpdateLoanCommand {
  constructor(public readonly updates: UpdateLoanCommandData) {}
}
