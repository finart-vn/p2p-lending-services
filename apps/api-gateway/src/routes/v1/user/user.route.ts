import { UserClient } from '@api-gateway/clients/user.client';
import { Roles } from '@api-gateway/decorators/roles.decorator';
import { AuthGuard } from '@api-gateway/guards/auth.guard';
import { RequestWithUser } from '@api-gateway/interfaces/auth.interface';
import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from '@p2p-lending/user-service/generated/prisma';

@ApiTags('User')
@Controller('v1/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userClient: UserClient) {}

  @Get('me')
  @ApiOperation({ summary: 'Get own profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.LENDER, RoleEnum.BORROWER)
  async getUser(@Req() req: RequestWithUser) {
    const user = req.user;
    this.logger.log(`Getting own profile for user: ${user?.sub}`);
    const userExisted = await this.userClient.getUserById(user?.sub);
    return userExisted;
  }
}
