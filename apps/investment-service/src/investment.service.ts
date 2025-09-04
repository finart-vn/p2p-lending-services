import {
  Investment,
  InvestmentStatus,
  Prisma,
} from '@investment-service/prisma';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import {
  CancelInvestmentRequest,
  CreateInvestmentRequest,
  UpdateInvestmentRequest,
} from '@p2p-lending/contracts/investment';

import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class InvestmentService {
  private readonly logger = new Logger(InvestmentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createInvestment(@Payload() payload: CreateInvestmentRequest) {
    try {
      const investment = await this.prisma.investment.create({
        data: {
          ...payload,
          amount: Prisma.Decimal(payload.amount.toString()),
          percentage: Prisma.Decimal(payload.percentage.toString()),
          expectedReturn: Prisma.Decimal(payload.expectedReturn.toString()),
          totalReceived: Prisma.Decimal(payload.totalReceived.toString()),
        },
      });
      return investment;
    } catch (error) {
      this.logger.error(`Failed to create investment: ${error}`);
      throw new RpcException({
        message: 'Failed to create investment',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getInvestmentById(@Payload() payload: string) {
    try {
      const investment = await this.prisma.investment.findUnique({
        where: { id: payload },
      });
      if (!investment) {
        throw new RpcException({
          message: 'Investment not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return investment;
    } catch (error) {
      this.logger.error(`Failed to get investment by id: ${error}`);
      throw new RpcException({
        message: 'Failed to get investment by id',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getInvestmentsByUser(@Payload() payload: string) {
    try {
      const investments = await this.prisma.investment.findMany({
        where: { lenderId: payload },
        orderBy: { investedAt: 'desc' },
      });
      return investments;
    } catch (error) {
      this.logger.error(`Failed to get investments by user: ${error}`);
      throw new RpcException({
        message: 'Failed to get investments by user',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getInvestmentsByLoan(@Payload() payload: string) {
    try {
      const investments = await this.prisma.investment.findMany({
        where: { loanId: payload },
        orderBy: { investedAt: 'asc' },
      });
      return investments;
    } catch (error) {
      this.logger.error(`Failed to get investments by loan: ${error}`);
      throw new RpcException({
        message: 'Failed to get investments by loan',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateInvestment(@Payload() payload: UpdateInvestmentRequest) {
    try {
      const investment = await this.prisma.investment.findUnique({
        where: { id: payload.id },
      });
      if (!investment) {
        throw new RpcException({
          message: 'Investment not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      const updateData: Partial<Investment> = {};

      if (payload.amount !== undefined) {
        updateData.amount = Prisma.Decimal(payload.amount.toString());
      }
      if (payload.percentage !== undefined) {
        updateData.percentage = Prisma.Decimal(payload.percentage.toString());
      }
      if (payload.expectedReturn !== undefined) {
        updateData.expectedReturn = Prisma.Decimal(
          payload.expectedReturn.toString(),
        );
      }
      if (payload.totalReceived !== undefined) {
        updateData.totalReceived = Prisma.Decimal(
          payload.totalReceived.toString(),
        );
      }
      if (payload.status !== undefined) {
        updateData.status = payload.status;
      }
      if (payload.completedAt !== undefined) {
        updateData.completedAt = payload.completedAt;
      }

      const updatedInvestment = await this.prisma.investment.update({
        where: { id: payload.id },
        data: updateData,
      });
      return updatedInvestment;
    } catch (error) {
      this.logger.error(`Failed to update investment: ${error}`);
      throw new RpcException({
        message: 'Failed to update investment',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async cancelInvestment(@Payload() payload: CancelInvestmentRequest) {
    try {
      const investment = await this.prisma.investment.findUnique({
        where: { id: payload.id },
      });
      if (!investment) {
        throw new RpcException({
          message: 'Investment not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      if (investment.status !== InvestmentStatus.PENDING) {
        throw new RpcException({
          message: 'Only pending investments can be cancelled',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const cancelledInvestment = await this.prisma.investment.update({
        where: { id: payload.id },
        data: { status: InvestmentStatus.CANCELLED },
      });
      return cancelledInvestment;
    } catch (error) {
      this.logger.error(`Failed to cancel investment: ${error}`);
      throw error;
    }
  }

  // async getInvestmentPortfolio(@Payload() payload: string) {
  //   try {
  //     const investments = await this.prisma.investment.findMany({
  //       where: { lenderId: payload },
  //       orderBy: { investedAt: 'desc' },
  //     });

  //     const totalInvestments = investments.length;
  //     const totalAmount = investments.reduce(
  //       (sum, inv) => sum + Number(inv.amount),
  //       0,
  //     );
  //     const totalExpectedReturn = investments.reduce(
  //       (sum, inv) => sum + Number(inv.expectedReturn),
  //       0,
  //     );
  //     const totalReceived = investments.reduce(
  //       (sum, inv) => sum + Number(inv.totalReceived),
  //       0,
  //     );

  //     const activeInvestments = investments.filter(
  //       (inv) => inv.status === InvestmentStatus.ACTIVE,
  //     ).length;
  //     const completedInvestments = investments.filter(
  //       (inv) => inv.status === InvestmentStatus.COMPLETED,
  //     ).length;
  //     const defaultedInvestments = investments.filter(
  //       (inv) => inv.status === InvestmentStatus.DEFAULTED,
  //     ).length;

  //     return {
  //       totalInvestments,
  //       totalAmount,
  //       totalExpectedReturn,
  //       totalReceived,
  //       activeInvestments,
  //       completedInvestments,
  //       defaultedInvestments,
  //       investments,
  //     };
  //   } catch (error) {
  //     this.logger.error(`Failed to get investment portfolio: ${error}`);
  //     throw new RpcException({
  //       message: 'Failed to get investment portfolio',
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }

  // async calculateInvestmentReturns(@Payload() payload: string) {
  //   try {
  //     const investment = await this.prisma.investment.findUnique({
  //       where: { id: payload },
  //     });
  //     if (!investment) {
  //       throw new RpcException({
  //         message: 'Investment not found',
  //         statusCode: HttpStatus.NOT_FOUND,
  //       });
  //     }

  //     const principalAmount = Number(investment.amount);
  //     const totalReceived = Number(investment.totalReceived);
  //     const interestEarned = totalReceived - principalAmount;
  //     const totalReturn = totalReceived;

  //     const investedAt = new Date(investment.investedAt);
  //     const now = new Date();
  //     const daysInvested = Math.ceil(
  //       (now.getTime() - investedAt.getTime()) / (1000 * 60 * 60 * 24),
  //     );

  //     const annualizedReturn =
  //       daysInvested > 0
  //         ? ((totalReturn / principalAmount - 1) * 365) / daysInvested
  //         : 0;

  //     return {
  //       investmentId: investment.id,
  //       principalAmount,
  //       interestEarned,
  //       totalReturn,
  //       annualizedReturn: annualizedReturn * 100, // Convert to percentage
  //       daysInvested,
  //     };
  //   } catch (error) {
  //     this.logger.error(`Failed to calculate investment returns: ${error}`);
  //     throw new RpcException({
  //       message: 'Failed to calculate investment returns',
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }

  // async getAllInvestments() {
  //   try {
  //     return await this.prisma.investment.findMany({
  //       orderBy: { investedAt: 'desc' },
  //     });
  //   } catch (error) {
  //     this.logger.error(`Failed to get all investments: ${error}`);
  //     throw new RpcException({
  //       message: 'Failed to get all investments',
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }

  // async deleteInvestment(@Payload() payload: string) {
  //   try {
  //     const investment = await this.prisma.investment.findUnique({
  //       where: { id: payload },
  //     });
  //     if (!investment) {
  //       throw new RpcException({
  //         message: 'Investment not found',
  //         statusCode: HttpStatus.NOT_FOUND,
  //       });
  //     }

  //     await this.prisma.investment.delete({
  //       where: { id: payload },
  //     });
  //     return { message: 'Investment deleted successfully' };
  //   } catch (error) {
  //     this.logger.error(`Failed to delete investment: ${error}`);
  //     throw new RpcException({
  //       message: 'Failed to delete investment',
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }
}
