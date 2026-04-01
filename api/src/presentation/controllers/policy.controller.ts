import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
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
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('policies')
@ApiBearerAuth()
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


  @RequirePolicies('policies:manage')
  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<PolicyResponse> {
    return super.getById(id);
  }


  @RequirePolicies('policies:manage')
  @ApiBody({ type: CreatePolicyCommand })
  @Post()
  override create(@Body() command: CreatePolicyCommand): Promise<PolicyResponse> {
    return super.create(command);
  }


  @RequirePolicies('policies:manage')
  @ApiBody({ type: UpdatePolicyCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePolicyCommand,
  ): Promise<PolicyResponse> {
    return super.update(id, body);
  }


  @RequirePolicies('policies:manage')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  override delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return super.delete(id);
  }

  @RequirePolicies('policies:manage')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListPoliciesQuery): Promise<ListPoliciesResponse> {
    return this.listHandler.execute(query);
  }
}
