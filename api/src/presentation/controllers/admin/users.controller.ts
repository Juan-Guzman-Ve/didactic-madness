import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
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
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('admin / users')
@ApiBearerAuth()
@ApiExtraModels(ListUsersQuery)
@Controller('admin/users')
export class AdminUsersController extends BaseController<
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

  @RequirePolicies('users:read')
  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<UserResponse> {
    return super.getById(id);
  }

  @RequirePolicies('users:create')
  @ApiBody({ type: CreateUserCommand })
  @Post()
  override create(@Body() command: CreateUserCommand): Promise<UserResponse> {
    return super.create(command);
  }

  @RequirePolicies('users:update')
  @ApiBody({ type: UpdateUserCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserCommand,
  ): Promise<UserResponse> {
    return super.update(id, body);
  }

  @RequirePolicies('users:delete')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  override delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return super.delete(id);
  }

  @RequirePolicies('users:read')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListUsersQuery): Promise<ListUsersResponse> {
    return this.listHandler.execute(query);
  }
}
