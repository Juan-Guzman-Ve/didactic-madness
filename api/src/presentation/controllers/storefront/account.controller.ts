import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  GetUserByIdQuery,
  GetUserByIdQueryHandler,
  UpdateUserCommand,
  UpdateUserCommandHandler,
  UserResponse,
} from '@app/application/features/user';
import { CurrentUser } from '@app/presentation/decorators';

@ApiTags('storefront / account')
@ApiBearerAuth()
@Controller('account')
export class StorefrontAccountController {
  constructor(
    private readonly getByIdHandler: GetUserByIdQueryHandler,
    private readonly updateHandler: UpdateUserCommandHandler,
  ) {}

  @Get()
  getProfile(@CurrentUser() user: { id: number }): Promise<UserResponse> {
    return this.getByIdHandler.execute({ id: user.id } as GetUserByIdQuery);
  }

  @ApiBody({ type: UpdateUserCommand })
  @Put()
  updateProfile(
    @Body() body: UpdateUserCommand,
    @CurrentUser() user: { id: number },
  ): Promise<UserResponse> {
    return this.updateHandler.execute({ ...body, id: user.id } as UpdateUserCommand);
  }
}
