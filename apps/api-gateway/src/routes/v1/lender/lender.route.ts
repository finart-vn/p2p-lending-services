import { InvestmentClient } from '@api-gateway/clients/investment.client';
import { LoanClient } from '@api-gateway/clients/loan.client';
import { Roles } from '@api-gateway/decorators/roles.decorator';
import {
  ApiInvestmentCancelRequestDto,
  ApiInvestmentCreateRequestDto,
  ApiInvestmentUpdateRequestDto,
} from '@api-gateway/dtos';
import { AuthGuard } from '@api-gateway/guards/auth.guard';
import { RolesGuard } from '@api-gateway/guards/roles.guard';
import { RequestWithUser } from '@api-gateway/interfaces/auth.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
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
    return await this.investmentClient.getInvestmentsByUser(req.user.sub);
  }

  @Get('investments/:id')
  @ApiOperation({ summary: 'Get investment by ID' })
  async getInvestmentById(@Param('id') id: string) {
    this.logger.log('Getting investment by ID:', id);
    return await this.investmentClient.getInvestmentById(id);
  }

  @Put('investments/:id')
  @ApiOperation({ summary: 'Update investment information' })
  async updateInvestment(
    @Param('id') id: string,
    @Body(new ValidationPipe()) body: ApiInvestmentUpdateRequestDto,
  ) {
    this.logger.log('Updating investment:', id);

    return await this.investmentClient.updateInvestment(body);
  }

  @Delete('investments/:id')
  @ApiOperation({ summary: 'Cancel investment' })
  async cancelInvestment(
    @Param('id') id: string,
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
