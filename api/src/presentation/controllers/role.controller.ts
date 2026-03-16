import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';
import {
  CreateRoleCommand,
  CreateRoleCommandHandler,
  DeleteRoleCommand,
  DeleteRoleCommandHandler,
  GetRoleByIdQuery,
  GetRoleByIdQueryHandler,
  ListRolesQuery,
  ListRolesQueryHandler,
  ListRolesResponse,
  RoleResponse,
  UpdateRoleCommand,
  UpdateRoleCommandHandler,
} from '@app/application/features/role';
import { BaseController } from '@app/presentation/base';

@ApiTags('roles')
@ApiExtraModels(ListRolesQuery)
@Controller('roles')
export class RoleController extends BaseController<
  CreateRoleCommand,
  UpdateRoleCommand,
  DeleteRoleCommand,
  GetRoleByIdQuery,
  RoleResponse
> {
  constructor(
    createHandler: CreateRoleCommandHandler,
    updateHandler: UpdateRoleCommandHandler,
    deleteHandler: DeleteRoleCommandHandler,
    getByIdHandler: GetRoleByIdQueryHandler,
    private readonly listHandler: ListRolesQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler);
  }

  @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sort', required: false, type: String })
    list(@Query() query: ListRolesQuery): Promise<ListRolesResponse> {
      return this.listHandler.execute(query);
    }
}