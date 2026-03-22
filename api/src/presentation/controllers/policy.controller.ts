import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBody } from '@nestjs/swagger';
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
@ApiExtraModels(ListPoliciesQuery)
@Controller('policies')
@RequirePolicies('policies:manage')
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

  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<PolicyResponse> {
    return super.getById(id);
  }

  @ApiBody({ type: CreatePolicyCommand })
  @Post()
  override create(@Body() command: CreatePolicyCommand): Promise<PolicyResponse> {
    return super.create(command);
  }

  @ApiBody({ type: UpdatePolicyCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePolicyCommand,
  ): Promise<PolicyResponse> {
    return super.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  override delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return super.delete(id);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListPoliciesQuery): Promise<ListPoliciesResponse> {
    return this.listHandler.execute(query);
  }
}
