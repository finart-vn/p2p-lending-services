import { Roles } from '@api-gateway/applications/decorators/roles.decorator';
import {
  ApiInvestmentCancelRequestDto,
  ApiInvestmentCreateRequestDto,
  ApiInvestmentUpdateRequestDto,
} from '@api-gateway/applications/DTOs';
import { AuthGuard } from '@api-gateway/applications/guards/auth.guard';
import { RolesGuard } from '@api-gateway/applications/guards/roles.guard';
import { InvestmentClient } from '@api-gateway/clients/investment.client';
import { LoanClient } from '@api-gateway/clients/loan.client';
import { RequestWithUser } from '@api-gateway/shared/interfaces/auth.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from '@p2p-lending/user-service/generated/prisma';

@ApiTags('Lender')
@Controller('v1/lender')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.LENDER)
export class LenderController {
  private readonly logger = new Logger(LenderController.name);
  constructor(
    private readonly investmentClient: InvestmentClient,
    private readonly loanClient: LoanClient,
  ) {}

  @Post('fund-loan')
  @ApiOperation({ summary: 'Fund a loan' })
  async fundLoan(
    @Req() req: RequestWithUser,
    @Body(new ValidationPipe()) body: ApiInvestmentCreateRequestDto,
  ) {
    return await this.investmentClient.createInvestment(req.user.sub, body);
  }

  @Get('my-investments')
  @ApiOperation({ summary: 'Get all investments for the lender' })
  async getInvestments(@Req() req: RequestWithUser) {
    this.logger.log('Getting investments for lender:', req.user.sub);
    const loanIds = new Set<string>();
    const investments = await this.investmentClient.getInvestmentsByUser(
      req.user.sub,
    );

    investments.forEach((investment) => {
      loanIds.add(investment.loanId);
    });

    if (!loanIds.size) {
      return [];
    }
    const loans = await this.loanClient.getLoanByIds(Array.from(loanIds));
    return {
      investments,
      loans,
    };
  }

  @Get('investment/:id')
  @ApiOperation({ summary: 'Get investment by ID' })
  async getInvestmentById(@Param('id') id: string) {
    this.logger.log('Getting investment by ID:', id);
    return await this.investmentClient.getInvestmentById(id);
  }

  @Patch('investment')
  @ApiOperation({ summary: 'Update investment information' })
  async updateInvestment(
    @Body(new ValidationPipe()) body: ApiInvestmentUpdateRequestDto,
  ) {
    return await this.investmentClient.updateInvestment(body);
  }

  @Delete('investment')
  @ApiOperation({ summary: 'Cancel investment' })
  async cancelInvestment(
    @Body(new ValidationPipe()) body: ApiInvestmentCancelRequestDto,
  ) {
    return await this.investmentClient.cancelInvestment(body);
  }

  @Get('portfolio')
  @ApiOperation({ summary: 'Get investment portfolio' })
  async getPortfolio(@Req() req: RequestWithUser) {
    this.logger.log('Getting portfolio for lender:', req.user.sub);
    return await this.investmentClient.getInvestmentPortfolio(req.user.sub);
  }

  @Get('investments/:id/returns')
  @ApiOperation({ summary: 'Calculate investment returns' })
  async calculateReturns(@Param('id') id: string) {
    this.logger.log('Calculating returns for investment:', id);
    return await this.investmentClient.calculateInvestmentReturns(id);
  }

  @Delete('loans/:id')
  @ApiOperation({ summary: 'Cancel/Delete a loan' })
  async cancelLoan(@Param('id') id: string) {
    this.logger.log('Cancelling loan:', id);
    return await this.loanClient.deleteLoan(id);
  }
}
