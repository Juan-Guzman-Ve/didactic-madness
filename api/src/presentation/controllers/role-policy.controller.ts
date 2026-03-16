import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';
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
@ApiExtraModels(ListRolePoliciesQuery)
@Controller('role-policies')
export class RolePolicyController extends BaseController<
  CreateRolePolicyCommand,
  UpdateRolePolicyCommand,
  DeleteRolePolicyCommand,
  GetRolePolicyByIdQuery,
  RolePolicyResponse
> {
  constructor(
    createHandler: CreateRolePolicyCommandHandler,
    updateHandler: UpdateRolePolicyCommandHandler,
    deleteHandler: DeleteRolePolicyCommandHandler,
    getByIdHandler: GetRolePolicyByIdQueryHandler,
    private readonly listHandler: ListRolePoliciesQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler);
  }

  @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sort', required: false, type: String })
    list(@Query() query: ListRolePoliciesQuery): Promise<ListRolePoliciesResponse> {
      return this.listHandler.execute(query);
    }
}
