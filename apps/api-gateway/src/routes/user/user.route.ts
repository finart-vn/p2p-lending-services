import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from '@p2p-lending/user-service/generated/prisma';

import { Roles } from '../../decorators/roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RequestWithUser } from '../../interfaces/auth.interface';

@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleEnum.ADMIN)
  getUser(@Req() req: RequestWithUser) {
    const user = req.user;

    this.logger.log('Getting user profile');
    return user;
  }
}
