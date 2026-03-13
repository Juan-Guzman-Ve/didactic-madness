import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
@Controller('roles')
export class RoleController extends BaseController<
  CreateRoleCommand,
  UpdateRoleCommand,
  DeleteRoleCommand,
  GetRoleByIdQuery,
  ListRolesQuery,
  RoleResponse,
  ListRolesResponse
> {
  constructor(
    createHandler: CreateRoleCommandHandler,
    updateHandler: UpdateRoleCommandHandler,
    deleteHandler: DeleteRoleCommandHandler,
    getByIdHandler: GetRoleByIdQueryHandler,
    listHandler: ListRolesQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler, listHandler);
  }
}