import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';
import {
  CreatePolicyCommand,
  CreatePolicyCommandHandler,
  DeletePolicyCommand,
  DeletePolicyCommandHandler,
  GetPolicyByIdQuery,
  GetPolicyByIdQueryHandler,
  ListPoliciesQuery,
  ListPoliciesQueryHandler,
  ListPoliciesResponse,
  PolicyResponse,
  UpdatePolicyCommand,
  UpdatePolicyCommandHandler,
} from '@app/application/features/policy';
import { BaseController } from '@app/presentation/base';

@ApiTags('policies')
@ApiExtraModels(ListPoliciesQuery)
@Controller('policies')
export class PolicyController extends BaseController<
  CreatePolicyCommand,
  UpdatePolicyCommand,
  DeletePolicyCommand,
  GetPolicyByIdQuery,
  PolicyResponse
> {
  constructor(
    createHandler: CreatePolicyCommandHandler,
    updateHandler: UpdatePolicyCommandHandler,
    deleteHandler: DeletePolicyCommandHandler,
    getByIdHandler: GetPolicyByIdQueryHandler,
    private readonly listHandler: ListPoliciesQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler);
  }

  @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sort', required: false, type: String })
    list(@Query() query: ListPoliciesQuery): Promise<ListPoliciesResponse> {
      return this.listHandler.execute(query);
    }
}
