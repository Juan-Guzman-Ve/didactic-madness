import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateRolePolicyCommand,
  CreateRolePolicyCommandHandler,
  DeleteRolePolicyCommand,
  DeleteRolePolicyCommandHandler,
  GetRolePolicyByIdQuery,
  GetRolePolicyByIdQueryHandler,
  ListRolePoliciesQuery,
  ListRolePoliciesQueryHandler,
  ListRolePoliciesResponse,
  RolePolicyResponse,
  UpdateRolePolicyCommand,
  UpdateRolePolicyCommandHandler,
} from '@app/application/features/role-policy';
import { BaseController } from '@app/presentation/base';

@ApiTags('role-policies')
@Controller('role-policies')
export class RolePolicyController extends BaseController<
  CreateRolePolicyCommand,
  UpdateRolePolicyCommand,
  DeleteRolePolicyCommand,
  GetRolePolicyByIdQuery,
  ListRolePoliciesQuery,
  RolePolicyResponse,
  ListRolePoliciesResponse
> {
  constructor(
    createHandler: CreateRolePolicyCommandHandler,
    updateHandler: UpdateRolePolicyCommandHandler,
    deleteHandler: DeleteRolePolicyCommandHandler,
    getByIdHandler: GetRolePolicyByIdQueryHandler,
    listHandler: ListRolePoliciesQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler, listHandler);
  }
}
