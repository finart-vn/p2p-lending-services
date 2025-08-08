import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

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
  getUser(@Req() req: RequestWithUser) {
    const user = req.user;

    this.logger.log('Getting user profile');
    return {
      status: 'success',
      user,
    };
  }
}
