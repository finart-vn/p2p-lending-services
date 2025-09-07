import { Roles } from '@api-gateway/applications/decorators/roles.decorator';
import { ApiLoanCreateRequestDto } from '@api-gateway/applications/DTOs/loan/loan-create.dto';
import { ApiLoanUpdateRequestDto } from '@api-gateway/applications/DTOs/loan/loan-update.dto';
import { AuthGuard } from '@api-gateway/applications/guards/auth.guard';
import { RolesGuard } from '@api-gateway/applications/guards/roles.guard';
import { LoanClient } from '@api-gateway/clients/loan.client';
import { RequestWithUser } from '@api-gateway/shared/interfaces/auth.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from '@user-service/prisma';

@Controller('v1/borrower/loan')
@ApiTags('Borrower')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.BORROWER)
export class BorrowerLoanController {
  constructor(private readonly borrowerClient: LoanClient) {}

  @Post()
  @ApiOperation({ summary: 'Create a loan' })
  async createLoan(
    @Body(new ValidationPipe()) loanDto: ApiLoanCreateRequestDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.borrowerClient.createLoan(req.user.sub, loanDto);
  }

  @Put()
  @ApiOperation({ summary: 'Update a loan' })
  async updateLoan(
    @Body(new ValidationPipe()) loanDto: ApiLoanUpdateRequestDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.borrowerClient.updateLoan(req.user.sub, loanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get loans for authenticated user' })
  getLoans(@Req() req: RequestWithUser) {
    if (!req.user || !req.user.sub) {
      throw new Error('User not authenticated');
    }
    console.log('Get loans for user:', req.user);
    return this.borrowerClient.getLoansByBorrower(req.user.sub);
  }

  @Get('borrower')
  @ApiOperation({ summary: 'Get loans by borrower for authenticated user' })
  getLoansByBorrower(@Req() req: RequestWithUser) {
    if (!req.user || !req.user.sub) {
      throw new Error('User not authenticated');
    }
    console.log('Get loans by borrower for user:', req.user);
    return this.borrowerClient.getLoansByBorrower(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a loan by id for authenticated user' })
  getLoanById(@Param('id') id: string, @Req() req: RequestWithUser) {
    if (!req.user || !req.user.sub) {
      throw new Error('User not authenticated');
    }
    console.log('Get loan by id:', id, 'for user:', req.user);
    return this.borrowerClient.getLoanById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a loan by id for authenticated user' })
  deleteLoan(@Param('id') id: string, @Req() req: RequestWithUser) {
    if (!req.user || !req.user.sub) {
      throw new Error('User not authenticated');
    }
    console.log('Delete loan by id:', id, 'for user:', req.user);
    return this.borrowerClient.deleteLoan(id);
  }
}
