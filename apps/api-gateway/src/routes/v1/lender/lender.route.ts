import { Roles } from '@api-gateway/decorators/roles.decorator';
import { AuthGuard } from '@api-gateway/guards/auth.guard';
import { RolesGuard } from '@api-gateway/guards/roles.guard';
import { RequestWithUser } from '@api-gateway/interfaces/auth.interface';
import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from '@p2p-lending/user-service/generated/prisma';

@ApiTags('Lender')
@Controller('v1/lender')
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
