import { MarketplaceSearchRequest } from '@p2p-lending/contracts/loan/marketplace-requests';

export class GetMarketplaceLoansQuery {
  constructor(
    public readonly marketplaceSearchRequest: MarketplaceSearchRequest,
  ) {}
}
