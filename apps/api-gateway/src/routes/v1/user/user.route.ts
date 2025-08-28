import { AuthGuard } from '@api-gateway/applications/guards/auth.guard';
import { UserClient } from '@api-gateway/clients/user.client';
import { RequestWithUser } from '@api-gateway/shared/interfaces/auth.interface';
import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('v1/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userClient: UserClient) {}

  @Get('me')
  @ApiOperation({ summary: 'Get own profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getUser(@Req() req: RequestWithUser) {
    const user = req.user;
    this.logger.log(`Getting own profile for user: ${user?.sub}`);
    return await this.userClient.getUserById(user?.sub);
  }
}
