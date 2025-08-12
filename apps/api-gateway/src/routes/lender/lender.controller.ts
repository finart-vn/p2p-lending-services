import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from '@p2p-lending/user-service/generated/prisma';

import { Roles } from '../../decorators/roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { RequestWithUser } from '../../interfaces/auth.interface';

@ApiTags('Lender')
@Controller('lender')
@UseGuards(AuthGuard, RolesGuard)
export class LenderController {
  private readonly logger = new Logger(LenderController.name);
  @Get('get-all-loans')
  @ApiOperation({ summary: 'Get all loans' })
  @ApiBearerAuth()
  //   @UseGuards(AuthGuard)F
  @Roles(RoleEnum.LENDER)
  getLender(@Req() req: RequestWithUser) {
    this.logger.log('Getting all loansF ');
    return {
      message: 'All loans',
      user: req.user,
    };
  }
}
