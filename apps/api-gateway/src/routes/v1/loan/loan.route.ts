import { BorrowerClient } from '@api-gateway/clients/borrower.client';
import { Roles } from '@api-gateway/decorators/roles.decorator';
import { ApiLoanCreateRequestDto } from '@api-gateway/dtos/loan/loan-create.dto';
import { AuthGuard } from '@api-gateway/guards/auth.guard';
import { RequestWithUser } from '@api-gateway/interfaces/auth.interface';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from '@p2p-lending/user-service/generated/prisma';

@Controller('v1/loan')
@ApiTags('Loan')
export class LoanController {
  constructor(private readonly borrowerClient: BorrowerClient) {}

  @Post()
  @ApiOperation({ summary: 'Create a loan' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleEnum.BORROWER)
  async createLoan(
    @Body(new ValidationPipe()) loanDto: ApiLoanCreateRequestDto,
  ) {
    console.log('Creating loan with data:', loanDto);
    return await this.borrowerClient.createLoan(
      '095d68c7-0438-4c22-a45e-c14a6a685bf9', // TODO: get borrowerId from auth service
      loanDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get loans for authenticated user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleEnum.BORROWER, RoleEnum.LENDER)
  getLoans(@Req() req: RequestWithUser) {
    console.log('Get loans for user:', req.user);
    // TODO: Implement get loans for authenticated user
    return {
      message: 'Get loans for authenticated user',
      user: req.user,
      data: [],
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a loan by id for authenticated user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleEnum.BORROWER, RoleEnum.LENDER)
  getLoanById(@Param('id') id: string, @Req() req: RequestWithUser) {
    console.log('Get loan by id:', id, 'for user:', req.user);
    // TODO: Implement get loan by id for authenticated user
    return {
      message: `Get loan by id: ${id}`,
      user: req.user,
      data: null,
    };
  }
}
