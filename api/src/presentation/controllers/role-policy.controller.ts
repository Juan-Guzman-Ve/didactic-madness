import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
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
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('role-policies')
@ApiBearerAuth()
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


  @RequirePolicies('roles:manage')
  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<RolePolicyResponse> {
    return super.getById(id);
  }


  @RequirePolicies('roles:manage')
  @ApiBody({ type: CreateRolePolicyCommand })
  @Post()
  override create(@Body() command: CreateRolePolicyCommand): Promise<RolePolicyResponse> {
    return super.create(command);
  }


  @RequirePolicies('roles:manage')
  @ApiBody({ type: UpdateRolePolicyCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRolePolicyCommand,
  ): Promise<RolePolicyResponse> {
    return super.update(id, body);
  }


  @RequirePolicies('roles:manage')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  override delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return super.delete(id);
  }

  @RequirePolicies('roles:manage')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListRolePoliciesQuery): Promise<ListRolePoliciesResponse> {
    return this.listHandler.execute(query);
  }
}
