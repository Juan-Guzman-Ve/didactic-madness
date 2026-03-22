import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBody } from '@nestjs/swagger';
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
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('roles')
@ApiExtraModels(ListRolesQuery)
@Controller('roles')
@RequirePolicies('roles:manage')
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

  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<RoleResponse> {
    return super.getById(id);
  }

  @ApiBody({ type: CreateRoleCommand })
  @Post()
  override create(@Body() command: CreateRoleCommand): Promise<RoleResponse> {
    return super.create(command);
  }

  @ApiBody({ type: UpdateRoleCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRoleCommand,
  ): Promise<RoleResponse> {
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
  list(@Query() query: ListRolesQuery): Promise<ListRolesResponse> {
    return this.listHandler.execute(query);
  }
}