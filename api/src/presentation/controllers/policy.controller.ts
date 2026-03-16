import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
@Controller('policies')
export class PolicyController extends BaseController<
  CreatePolicyCommand,
  UpdatePolicyCommand,
  DeletePolicyCommand,
  GetPolicyByIdQuery,
  ListPoliciesQuery,
  PolicyResponse,
  ListPoliciesResponse
> {
  constructor(
    createHandler: CreatePolicyCommandHandler,
    updateHandler: UpdatePolicyCommandHandler,
    deleteHandler: DeletePolicyCommandHandler,
    getByIdHandler: GetPolicyByIdQueryHandler,
    listHandler: ListPoliciesQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler, listHandler);
  }
}
