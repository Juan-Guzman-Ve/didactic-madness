import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';
import {
  CreateUserCommand,
  CreateUserCommandHandler,
  DeleteUserCommand,
  DeleteUserCommandHandler,
  GetUserByIdQuery,
  GetUserByIdQueryHandler,
  ListUsersQuery,
  ListUsersQueryHandler,
  ListUsersResponse,
  UpdateUserCommand,
  UpdateUserCommandHandler,
  UserResponse,
} from '@app/application/features/user';
import { BaseController } from '@app/presentation/base';

@ApiTags('users')
@ApiExtraModels(ListUsersQuery)
@Controller('users')
export class UserController extends BaseController<
  CreateUserCommand,
  UpdateUserCommand,
  DeleteUserCommand,
  GetUserByIdQuery,
  UserResponse
> {
  constructor(
    createHandler: CreateUserCommandHandler,
    updateHandler: UpdateUserCommandHandler,
    deleteHandler: DeleteUserCommandHandler,
    getByIdHandler: GetUserByIdQueryHandler,
    private readonly listHandler: ListUsersQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler);
  }

  @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sort', required: false, type: String })
    list(@Query() query: ListUsersQuery): Promise<ListUsersResponse> {
      return this.listHandler.execute(query);
    }
}
