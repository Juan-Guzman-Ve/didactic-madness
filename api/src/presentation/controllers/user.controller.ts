import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
@Controller('users')
export class UserController extends BaseController<
  CreateUserCommand,
  UpdateUserCommand,
  DeleteUserCommand,
  GetUserByIdQuery,
  ListUsersQuery,
  UserResponse,
  ListUsersResponse
> {
  constructor(
    createHandler: CreateUserCommandHandler,
    updateHandler: UpdateUserCommandHandler,
    deleteHandler: DeleteUserCommandHandler,
    getByIdHandler: GetUserByIdQueryHandler,
    listHandler: ListUsersQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler, listHandler);
  }
}
