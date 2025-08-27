import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import {
  CreateLoanRequest,
  UpdateLoanRequest,
} from '@p2p-lending/contracts/loan';

// import {
//   Country,
//   CreditRating,
//   ExperienceLevel,
//   LoanType,
//   MarketplaceLoan,
//   MarketplaceSearchRequest,
//   MarketplaceSearchResponse,
// } from '@p2p-lending/contracts/loan/marketplace-requests';
import { LoanStatus, Prisma } from '../generated/prisma';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class LoanService {
  private readonly logger = new Logger(LoanService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createLoan(@Payload() payload: CreateLoanRequest) {
    const loan = await this.prisma.loan.create({
      data: {
        ...payload,
        requestedAmount: Prisma.Decimal(payload.requestedAmount.toString()),
        fundedAmount: Prisma.Decimal(payload.fundedAmount.toString()),
        interestRate: Prisma.Decimal(payload.interestRate.toString()),
        monthlyPayment: Prisma.Decimal(payload.monthlyPayment.toString()),
      },
    });
    return loan;
  }

  async getLoanById(@Payload() payload: string) {
    try {
      const loan = await this.prisma.loan.findUnique({
        where: { id: payload },
      });
      if (!loan) {
        throw new RpcException({
          message: 'Loan not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return loan;
    } catch (error) {
      this.logger.error(`Failed to get loan by id: ${error}`);
      throw new RpcException({
        message: 'Failed to get loan by id',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getLoansByBorrower(@Payload() payload: string) {
    try {
      const loans = await this.prisma.loan.findMany({
        where: { borrowerId: payload },
      });
      return loans;
    } catch (error) {
      this.logger.error(`Failed to get loans by borrower: ${error}`);
      throw new RpcException({
        message: 'Failed to get loans by borrower',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getActiveLoans(@Payload() payload: string) {
    const loans = await this.prisma.loan.findMany({
      where: { borrowerId: payload, status: LoanStatus.ACTIVE },
    });
    return loans;
  }

  async getAllLoans() {
    return await this.prisma.loan.findMany({
      include: {
        investments: true,
      },
    });
  }

  async updateLoan(@Payload() payload: UpdateLoanRequest) {
    try {
      const loan = await this.prisma.loan.findUnique({
        where: { id: payload.id },
      });
      if (!loan) {
        throw new RpcException({
          message: 'Loan not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const updatedLoan = await this.prisma.loan.update({
        where: { id: payload.id },
        data: payload,
      });
      return updatedLoan;
    } catch (error) {
      this.logger.error(`Failed to update loan: ${error}`);
      throw new RpcException({
        message: 'Failed to update loan',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteLoan(@Payload() payload: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: payload },
    });
    if (!loan) {
      throw new RpcException({
        message: 'Loan not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    await this.prisma.loan.delete({
      where: { id: payload },
    });
    return { message: 'Loan deleted successfully' };
  }

  // async searchMarketplaceLoans(
  //   @Payload() payload: MarketplaceSearchRequest,
  // ): Promise<MarketplaceSearchResponse> {
  //   try {
  //     const {
  //       search,
  //       minAmount,
  //       maxAmount,
  //       minInterestRate,
  //       maxInterestRate,
  //       minTermMonths,
  //       maxTermMonths,
  //       loanTypes,
  //       statuses = [LoanStatus.LISTED, LoanStatus.FUNDING],
  //       page = 1,
  //       limit = 20,
  //       sortBy = 'createdAt',
  //       sortOrder = 'desc',
  //     } = payload;

  //     // Build where clause
  //     const where: any = {
  //       status: { in: statuses },
  //     };

  //     if (search) {
  //       where.OR = [
  //         { description: { contains: search, mode: 'insensitive' } },
  //         { purpose: { in: this.mapSearchToPurposes(search) } },
  //       ];
  //     }

  //     if (minAmount || maxAmount) {
  //       where.requestedAmount = {};
  //       if (minAmount)
  //         where.requestedAmount.gte = Prisma.Decimal(minAmount.toString());
  //       if (maxAmount)
  //         where.requestedAmount.lte = Prisma.Decimal(maxAmount.toString());
  //     }

  //     if (minInterestRate || maxInterestRate) {
  //       where.interestRate = {};
  //       if (minInterestRate)
  //         where.interestRate.gte = Prisma.Decimal(minInterestRate.toString());
  //       if (maxInterestRate)
  //         where.interestRate.lte = Prisma.Decimal(maxInterestRate.toString());
  //     }

  //     if (minTermMonths || maxTermMonths) {
  //       where.termMonths = {};
  //       if (minTermMonths) where.termMonths.gte = minTermMonths;
  //       if (maxTermMonths) where.termMonths.lte = maxTermMonths;
  //     }

  //     if (loanTypes?.length) {
  //       where.purpose = { in: this.mapLoanTypesToPurposes(loanTypes) };
  //     }

  //     // Calculate offset for pagination
  //     const offset = (page - 1) * limit;

  //     // Get total count
  //     const total = await this.prisma.loan.count({ where });

  //     // Build order by clause
  //     const orderBy: any = {};
  //     if (sortBy === 'fundingProgress') {
  //       orderBy._relevance = {
  //         fields: ['fundedAmount', 'requestedAmount'],
  //         sort: sortOrder,
  //       };
  //     } else {
  //       orderBy[sortBy] = sortOrder;
  //     }

  //     // Get loans with investments for funding calculations
  //     const loans = await this.prisma.loan.findMany({
  //       where,
  //       include: {
  //         investments: true,
  //       },
  //       orderBy,
  //       skip: offset,
  //       take: limit,
  //     });

  //     // Transform loans to marketplace format
  //     const marketplaceLoans = loans.map((loan) =>
  //       this.transformToMarketplaceLoan(loan),
  //     );

  //     // Get filter statistics
  //     const filters = await this.getMarketplaceFilters();

  //     return {
  //       total,
  //       page,
  //       limit,
  //       totalPages: Math.ceil(total / limit),
  //       loans: marketplaceLoans,
  //       filters,
  //     };
  //   } catch (error) {
  //     this.logger.error(`Failed to search marketplace loans: ${error}`);
  //     throw new RpcException({
  //       message: 'Failed to search marketplace loans',
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }

  // async getMarketplaceFilters() {
  //   try {
  //     // Get available loan statuses for marketplace
  //     const marketplaceStatuses = [LoanStatus.LISTED, LoanStatus.FUNDING];

  //     // Get statistics for filters
  //     const [loanTypeCounts, amountStats, interestRateStats, termStats] =
  //       await Promise.all([
  //         this.prisma.loan.groupBy({
  //           by: ['purpose'],
  //           where: { status: { in: marketplaceStatuses } },
  //           _count: true,
  //         }),
  //         this.prisma.loan.aggregate({
  //           where: { status: { in: marketplaceStatuses } },
  //           _min: { requestedAmount: true },
  //           _max: { requestedAmount: true },
  //           _avg: { requestedAmount: true },
  //         }),
  //         this.prisma.loan.aggregate({
  //           where: { status: { in: marketplaceStatuses } },
  //           _min: { interestRate: true },
  //           _max: { interestRate: true },
  //           _avg: { interestRate: true },
  //         }),
  //         this.prisma.loan.aggregate({
  //           where: { status: { in: marketplaceStatuses } },
  //           _min: { termMonths: true },
  //           _max: { termMonths: true },
  //           _avg: { termMonths: true },
  //         }),
  //       ]);

  //     return {
  //       experienceLevels: [
  //         { value: ExperienceLevel.ENTRY, label: 'Entry Level', count: 171 },
  //         {
  //           value: ExperienceLevel.INTERMEDIATE,
  //           label: 'Intermediate',
  //           count: 2770,
  //         },
  //         { value: ExperienceLevel.EXPERT, label: 'Expert', count: 1982 },
  //       ],
  //       loanTypes: loanTypeCounts.map((item) => ({
  //         value: item.purpose,
  //         label: this.getLoanTypeLabel(item.purpose),
  //         count: item._count,
  //       })),
  //       countries: [
  //         { value: Country.LATVIA, label: 'Latvia', count: 35 },
  //         { value: Country.ESTONIA, label: 'Estonia', count: 28 },
  //         { value: Country.LITHUANIA, label: 'Lithuania', count: 22 },
  //         { value: Country.POLAND, label: 'Poland', count: 18 },
  //         { value: Country.CZECH_REPUBLIC, label: 'Czech Republic', count: 12 },
  //       ],
  //       ratings: [
  //         { value: CreditRating.A_PLUS, label: 'A+', count: 25 },
  //         { value: CreditRating.A, label: 'A', count: 30 },
  //         { value: CreditRating.A_MINUS, label: 'A-', count: 20 },
  //         { value: CreditRating.B_PLUS, label: 'B+', count: 15 },
  //         { value: CreditRating.B, label: 'B', count: 18 },
  //         { value: CreditRating.B_MINUS, label: 'B-', count: 10 },
  //       ],
  //       amountRange: {
  //         min: Number(amountStats._min.requestedAmount) || 0,
  //         max: Number(amountStats._max.requestedAmount) || 0,
  //         average: Number(amountStats._avg.requestedAmount) || 0,
  //       },
  //       interestRateRange: {
  //         min: Number(interestRateStats._min.interestRate) || 0,
  //         max: Number(interestRateStats._max.interestRate) || 0,
  //         average: Number(interestRateStats._avg.interestRate) || 0,
  //       },
  //       termRange: {
  //         min: termStats._min.termMonths || 0,
  //         max: termStats._max.termMonths || 0,
  //         average: Math.round(termStats._avg.termMonths || 0),
  //       },
  //     };
  //   } catch (error) {
  //     this.logger.error(`Failed to get marketplace filters: ${error}`);
  //     throw new RpcException({
  //       message: 'Failed to get marketplace filters',
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }

  // private transformToMarketplaceLoan(loan: any): MarketplaceLoan {
  //   const fundingProgress =
  //     loan.requestedAmount > 0
  //       ? Math.round(
  //           (Number(loan.fundedAmount) / Number(loan.requestedAmount)) * 100,
  //         )
  //       : 0;

  //   const daysRemaining = loan.fundingDeadline
  //     ? Math.max(
  //         0,
  //         Math.ceil(
  //           (new Date(loan.fundingDeadline).getTime() - new Date().getTime()) /
  //             (1000 * 60 * 60 * 24),
  //         ),
  //       )
  //     : 0;

  //   const investorCount = loan.investments?.length || 0;
  //   const expectedReturn = Number(loan.interestRate) + 2; // Basic calculation

  //   return {
  //     id: loan.id,
  //     loanNumber: loan.loanNumber,
  //     requestedAmount: Number(loan.requestedAmount),
  //     fundedAmount: Number(loan.fundedAmount),
  //     fundingProgress,
  //     interestRate: Number(loan.interestRate),
  //     termMonths: loan.termMonths,
  //     monthlyPayment: Number(loan.monthlyPayment),
  //     purpose: loan.purpose,
  //     description: loan.description,
  //     status: loan.status,
  //     listingDate: loan.listingDate,
  //     fundingDeadline: loan.fundingDeadline,
  //     experienceLevel: this.getBorrowerExperienceLevel(loan.borrowerId),
  //     creditRating: this.getBorrowerCreditRating(loan.borrowerId),
  //     country: this.getBorrowerCountry(loan.borrowerId),
  //     daysRemaining,
  //     investorCount,
  //     expectedReturn,
  //   };
  // }

  // private mapSearchToPurposes(search: string) {
  //   const searchLower = search.toLowerCase();
  //   const purposes: string[] = [];

  //   if (searchLower.includes('business') || searchLower.includes('company')) {
  //     purposes.push('BUSINESS');
  //   }
  //   if (
  //     searchLower.includes('personal') ||
  //     searchLower.includes('individual')
  //   ) {
  //     purposes.push('PERSONAL');
  //   }
  //   if (searchLower.includes('education') || searchLower.includes('study')) {
  //     purposes.push('EDUCATION');
  //   }
  //   if (searchLower.includes('home') || searchLower.includes('house')) {
  //     purposes.push('HOME_IMPROVEMENT');
  //   }
  //   if (searchLower.includes('debt') || searchLower.includes('consolidation')) {
  //     purposes.push('DEBT_CONSOLIDATION');
  //   }

  //   return purposes.length > 0
  //     ? purposes
  //     : [
  //         'PERSONAL',
  //         'BUSINESS',
  //         'EDUCATION',
  //         'HOME_IMPROVEMENT',
  //         'DEBT_CONSOLIDATION',
  //       ];
  // }

  // private mapLoanTypesToPurposes(loanTypes: LoanType[]) {
  //   const purposeMap = {
  //     [LoanType.BUSINESS]: ['BUSINESS'],
  //     [LoanType.PERSONAL]: ['PERSONAL', 'DEBT_CONSOLIDATION'],
  //     [LoanType.CAR]: ['PERSONAL'],
  //     [LoanType.REAL_ESTATE]: ['HOME_IMPROVEMENT'],
  //     [LoanType.CONSUMER]: ['PERSONAL', 'DEBT_CONSOLIDATION'],
  //   };

  //   return loanTypes.flatMap((type) => purposeMap[type] || []);
  // }

  // private getLoanTypeLabel(purpose: string): string {
  //   const labels = {
  //     BUSINESS: 'Business loans',
  //     PERSONAL: 'Personal loans',
  //     EDUCATION: 'Education loans',
  //     HOME_IMPROVEMENT: 'Home improvement',
  //     DEBT_CONSOLIDATION: 'Debt consolidation',
  //   };
  //   return labels[purpose] || purpose;
  // }

  // private getBorrowerExperienceLevel(borrowerId: string): ExperienceLevel {
  //   // TODO: Implement logic to get borrower experience level
  //   // This could be based on loan history, credit score, etc.
  //   const hash = borrowerId.split('').reduce((a, b) => {
  //     a = (a << 5) - a + b.charCodeAt(0);
  //     return a & a;
  //   }, 0);

  //   const levels = [
  //     ExperienceLevel.ENTRY,
  //     ExperienceLevel.INTERMEDIATE,
  //     ExperienceLevel.EXPERT,
  //   ];
  //   return levels[Math.abs(hash) % levels.length];
  // }

  // private getBorrowerCreditRating(borrowerId: string): CreditRating {
  //   // TODO: Implement logic to get borrower credit rating
  //   // This should come from credit scoring service
  //   const hash = borrowerId.split('').reduce((a, b) => {
  //     a = (a << 5) - a + b.charCodeAt(0);
  //     return a & a;
  //   }, 0);

  //   const ratings = [
  //     CreditRating.A_PLUS,
  //     CreditRating.A,
  //     CreditRating.A_MINUS,
  //     CreditRating.B_PLUS,
  //     CreditRating.B,
  //     CreditRating.B_MINUS,
  //   ];
  //   return ratings[Math.abs(hash) % ratings.length];
  // }

  // private getBorrowerCountry(borrowerId: string): Country {
  //   // TODO: Implement logic to get borrower country
  //   // This should come from user profile
  //   const hash = borrowerId.split('').reduce((a, b) => {
  //     a = (a << 5) - a + b.charCodeAt(0);
  //     return a & a;
  //   }, 0);

  //   const countries = [
  //     Country.LATVIA,
  //     Country.ESTONIA,
  //     Country.LITHUANIA,
  //     Country.POLAND,
  //     Country.CZECH_REPUBLIC,
  //   ];
  //   return countries[Math.abs(hash) % countries.length];
  // }
}
